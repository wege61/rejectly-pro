import zlib from "zlib";
import JSZip from "jszip";

/**
 * Finds the most likely profile photo embedded in a CV file (PDF or DOCX).
 *
 * PDFs are read through their image XObjects instead of scanning for JPEG
 * markers, because marker scanning breaks on photos that carry an EXIF
 * thumbnail (the thumbnail's end marker truncates the real image) and cannot
 * see PNG-style (FlateDecode) images at all.
 */

export interface ExtractedPhoto {
  dataUrl: string;
  width: number;
  height: number;
}

interface Candidate extends ExtractedPhoto {
  area: number;
}

// Profile photos are roughly portrait or square; logos and banners are not.
const MIN_SIDE = 80;
const MAX_ASPECT_RATIO = 2.5;
const MAX_AREA = 12_000_000;

export async function extractPhotoFromCV(file: Buffer): Promise<ExtractedPhoto | null> {
  const candidates = isZip(file) ? await docxImages(file) : isPDF(file) ? pdfImages(file) : [];
  return pickPhoto(candidates);
}

function pickPhoto(candidates: Candidate[]): ExtractedPhoto | null {
  let best: Candidate | null = null;
  for (const c of candidates) {
    const ratio = Math.max(c.width, c.height) / Math.min(c.width, c.height);
    if (Math.min(c.width, c.height) < MIN_SIDE || ratio > MAX_ASPECT_RATIO || c.area > MAX_AREA) continue;
    if (!best || c.area > best.area) best = c;
  }
  if (!best) return null;
  return { dataUrl: best.dataUrl, width: best.width, height: best.height };
}

const isPDF = (buf: Buffer) => buf.subarray(0, 1024).includes("%PDF");
const isZip = (buf: Buffer) => buf[0] === 0x50 && buf[1] === 0x4b;

// ---------------------------------------------------------------------------
// PDF
// ---------------------------------------------------------------------------

function pdfImages(pdf: Buffer): Candidate[] {
  const text = pdf.toString("latin1");
  const results: Candidate[] = [];
  const imageDict = /\/Subtype\s*\/Image\b/g;
  let match: RegExpExecArray | null;

  // Soft masks are grayscale images the size of the photo; never pick those.
  const maskObjects = new Set([...text.matchAll(/\/(?:SMask|Mask)\s+(\d+)\s+\d+\s+R/g)].map((m) => m[1]));

  while ((match = imageDict.exec(text))) {
    const dictStart = text.lastIndexOf("obj", match.index);
    const streamKeyword = text.indexOf("stream", match.index);
    if (dictStart < 0 || streamKeyword < 0) continue;
    const dict = text.slice(dictStart, streamKeyword);
    // The match must belong to this object's dictionary, not an earlier one.
    if (dict.includes("endobj")) continue;
    const objectNumber = text.slice(Math.max(0, dictStart - 24), dictStart).match(/(\d+)\s+\d+\s+$/)?.[1];
    if (objectNumber && maskObjects.has(objectNumber)) continue;

    let dataStart = streamKeyword + "stream".length;
    if (text[dataStart] === "\r") dataStart++;
    if (text[dataStart] === "\n") dataStart++;

    const length = streamLength(text, dict, dataStart);
    if (length <= 0) continue;
    const data = pdf.subarray(dataStart, dataStart + length);

    try {
      const image = decodePdfImage(dict, data);
      if (image) results.push(image);
    } catch (err) {
      console.log("[photoExtractor] Skipping undecodable image:", (err as Error).message);
    }
  }
  return results;
}

function streamLength(text: string, dict: string, dataStart: number): number {
  const direct = dict.match(/\/Length\s+(\d+)(?!\s+\d+\s+R)/);
  if (direct) return Number(direct[1]);

  const ref = dict.match(/\/Length\s+(\d+)\s+(\d+)\s+R/);
  if (ref) {
    const obj = text.match(new RegExp(`(?:^|[^0-9])${ref[1]}\\s+${ref[2]}\\s+obj\\s*(\\d+)`));
    if (obj) return Number(obj[1]);
  }

  // Indirect length stored somewhere we can't read (e.g. an object stream).
  const end = text.indexOf("endstream", dataStart);
  if (end < 0) return 0;
  let stop = end;
  while (stop > dataStart && (text[stop - 1] === "\n" || text[stop - 1] === "\r")) stop--;
  return stop - dataStart;
}

function dictNumber(dict: string, key: string): number | undefined {
  const m = dict.match(new RegExp(`/${key}\\s+(\\d+)`));
  return m ? Number(m[1]) : undefined;
}

function decodePdfImage(dict: string, data: Buffer): Candidate | null {
  const filters = [...(dict.match(/\/Filter\s*(\[[^\]]*\]|\/\w+)/)?.[1] ?? "").matchAll(/\/(\w+)/g)].map((m) => m[1]);

  if (filters.length === 1 && filters[0] === "DCTDecode") {
    const { width, height } = jpegDimensions(data);
    if (!width || !height) return null;
    return { dataUrl: `data:image/jpeg;base64,${data.toString("base64")}`, width, height, area: width * height };
  }

  if (filters.length !== 1 || filters[0] !== "FlateDecode") return null; // JPX, CCITT, etc.
  if (/\/ColorSpace\s*\[\s*\/Indexed/.test(dict)) return null;

  const width = dictNumber(dict, "Width");
  const height = dictNumber(dict, "Height");
  if (!width || !height || dictNumber(dict, "BitsPerComponent") !== 8) return null;
  // Bail out before inflating anything we'd reject anyway.
  if (Math.min(width, height) < MIN_SIDE || width * height > MAX_AREA) return null;

  const raw = zlib.inflateSync(data);
  const predictor = dictNumber(dict, "Predictor") ?? 1;
  let channels: number;
  let rows: Buffer;

  if (predictor >= 10) {
    // PNG predictors: the inflated data is already PNG-filtered scanlines.
    channels = dictNumber(dict, "Colors") ?? 1;
    rows = raw;
  } else if (predictor === 1) {
    channels = raw.length / (width * height);
    if (![1, 3, 4].includes(channels)) return null;
    rows = addNoneFilter(raw, width * channels, height);
  } else {
    return null; // TIFF predictor, effectively unused in CVs
  }

  if (channels === 4) {
    rows = cmykToRgb(predictor >= 10 ? unfilterPng(rows, width, height, 4) : raw, width, height);
    channels = 3;
  }
  if (channels !== 1 && channels !== 3) return null;

  const png = encodePng(width, height, channels === 3 ? 2 : 0, rows);
  return { dataUrl: `data:image/png;base64,${png.toString("base64")}`, width, height, area: width * height };
}

function addNoneFilter(raw: Buffer, stride: number, height: number): Buffer {
  const out = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) raw.copy(out, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  return out;
}

function unfilterPng(filtered: Buffer, width: number, height: number, bpp: number): Buffer {
  const stride = width * bpp;
  const out = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const type = filtered[y * (stride + 1)];
    const src = y * (stride + 1) + 1;
    const dst = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[dst + x - bpp] : 0;
      const b = y > 0 ? out[dst + x - stride] : 0;
      const c = x >= bpp && y > 0 ? out[dst + x - stride - bpp] : 0;
      let pred = 0;
      if (type === 1) pred = a;
      else if (type === 2) pred = b;
      else if (type === 3) pred = (a + b) >> 1;
      else if (type === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        pred = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[dst + x] = (filtered[src + x] + pred) & 0xff;
    }
  }
  return out;
}

function cmykToRgb(cmyk: Buffer, width: number, height: number): Buffer {
  const stride = width * 3;
  const out = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const k = 255 - cmyk[i + 3];
      const o = y * (stride + 1) + 1 + x * 3;
      out[o] = ((255 - cmyk[i]) * k) / 255;
      out[o + 1] = ((255 - cmyk[i + 1]) * k) / 255;
      out[o + 2] = ((255 - cmyk[i + 2]) * k) / 255;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// DOCX
// ---------------------------------------------------------------------------

async function docxImages(docx: Buffer): Promise<Candidate[]> {
  const zip = await JSZip.loadAsync(docx);
  const results: Candidate[] = [];
  for (const entry of Object.values(zip.files)) {
    if (entry.dir || !entry.name.startsWith("word/media/")) continue;
    const data = await entry.async("nodebuffer");
    const isJpeg = data[0] === 0xff && data[1] === 0xd8;
    const isPng = data.subarray(1, 4).toString("latin1") === "PNG";
    if (!isJpeg && !isPng) continue; // EMF/WMF/GIF can't be embedded by jsPDF as-is
    const { width, height } = isJpeg ? jpegDimensions(data) : { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
    if (!width || !height) continue;
    const mime = isJpeg ? "image/jpeg" : "image/png";
    results.push({ dataUrl: `data:${mime};base64,${data.toString("base64")}`, width, height, area: width * height });
  }
  return results;
}

// ---------------------------------------------------------------------------
// Image helpers
// ---------------------------------------------------------------------------

/** Reads width/height from any JPEG SOF marker (baseline, progressive, lossless, arithmetic). */
export function jpegDimensions(jpeg: Buffer): { width: number; height: number } {
  let offset = 2;
  while (offset + 9 < jpeg.length) {
    if (jpeg[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = jpeg[offset + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: jpeg.readUInt16BE(offset + 5), width: jpeg.readUInt16BE(offset + 7) };
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0xff) {
      offset += marker === 0xff ? 1 : 2;
      continue;
    }
    offset += 2 + jpeg.readUInt16BE(offset + 2);
  }
  return { width: 0, height: 0 };
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeAndData = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([len, typeAndData, crc]);
}

/** colorType: 0 = grayscale, 2 = RGB. `filteredRows` are PNG scanlines with filter bytes. */
function encodePng(width: number, height: number, colorType: 0 | 2, filteredRows: Buffer): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = colorType;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(filteredRows)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}
