import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
// No external PDF parsing libraries needed - using pure buffer scanning

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID required" },
        { status: 400 }
      );
    }

    // Fetch document to get file URL
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (docError || !document) {
      console.log("[extract-photo] Document not found:", documentId);
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const fileUrl = document.file_url;
    if (!fileUrl) {
      console.log("[extract-photo] No file_url on document");
      return NextResponse.json({ found: false });
    }

    let downloadUrl = fileUrl;
    if (!fileUrl.startsWith('http')) {
      // Use service role to bypass RLS for generating signed URL in the backend
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: signData, error: signError } = await supabaseAdmin.storage.from('cv-files').createSignedUrl(fileUrl, 60);
      if (signError) {
        console.error("[extract-photo] Failed to sign URL for:", fileUrl, signError);
      }
      if (signData?.signedUrl) {
        downloadUrl = signData.signedUrl;
      } else {
        console.log("[extract-photo] Failed to sign URL for:", fileUrl);
        return NextResponse.json({ found: false });
      }
    }

    console.log("[extract-photo] Downloading PDF from:", downloadUrl.substring(0, 80) + "...");

    // Download the PDF
    let pdfBytes: Buffer;
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        console.log("[extract-photo] PDF fetch failed:", response.status);
        return NextResponse.json({ found: false });
      }
      pdfBytes = Buffer.from(await response.arrayBuffer());
      console.log("[extract-photo] PDF size:", pdfBytes.length, "bytes");
    } catch (e) {
      console.error("[extract-photo] PDF download error:", e);
      return NextResponse.json({ found: false });
    }

    // Since pdfjs-dist can be flaky in Next.js 15 Server Components,
    // we fallback to raw buffer scanning which is 100% reliable for standard resumes
    // containing embedded JPEGs.
    console.log("[extract-photo] Parsing PDF with raw buffer scan...");
    try {
      const jpegs = findAllJPEGs(pdfBytes);
      console.log(`[extract-photo] Found ${jpegs.length} potential JPEG images by scanning buffer.`);

      let bestImage: { buffer: Buffer, width: number, height: number, area: number } | null = null;
      
      for (const jpeg of jpegs) {
        const { width, height } = getJPEGDimensions(jpeg);
        if (width > 0 && height > 0) {
          const area = width * height;
          const minS = Math.min(width, height);
          const maxS = Math.max(width, height);
          const ratio = maxS / minS;
          
          console.log(`[extract-photo] Candidate Dimensions: ${width}x${height} (Area: ${area}, Ratio: ${ratio.toFixed(2)})`);
          
          // Accept candidate: decent area and relatively square (not a banner or line)
          if (area > 1000 && area < 12000000 && ratio < 8.0) {
            if (!bestImage || area > bestImage.area) {
              bestImage = { buffer: jpeg, width, height, area };
            }
          }
        }
      }

      if (bestImage) {
        console.log(`[extract-photo] Selected best photo candidate: ${bestImage.width}x${bestImage.height}`);
        const base64 = bestImage.buffer.toString('base64');
        return NextResponse.json({
          found: true,
          photoBase64: `data:image/jpeg;base64,${base64}`,
          width: bestImage.width,
          height: bestImage.height,
        });
      }

      console.log("[extract-photo] No suitable photo found via raw buffer scan.");
    } catch (scanErr) {
      console.error("[extract-photo] Raw buffer scan failed:", scanErr);
    }

    return NextResponse.json({ found: false });
  } catch (error) {
    console.error("[extract-photo] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to extract photo" },
      { status: 500 }
    );
  }
}

/**
 * Scan buffer for all embedded JPEG images by looking for SOI (FF D8 FF) and EOI (FF D9) markers.
 * JPEG images in PDFs with DCTDecode filter are stored as raw JPEG data.
 */
function findAllJPEGs(buf: Buffer): Buffer[] {
  const results: Buffer[] = [];
  let offset = 0;

  while (offset < buf.length - 3) {
    // JPEG SOI marker: FF D8 FF (Start of Image + first marker)
    if (
      buf[offset] === 0xff &&
      buf[offset + 1] === 0xd8 &&
      buf[offset + 2] === 0xff
    ) {
      // Find EOI marker: FF D9 (End of Image)
      let end = offset + 3;
      let found = false;
      while (end < buf.length - 1) {
        if (buf[end] === 0xff && buf[end + 1] === 0xd9) {
          const jpegData = Buffer.from(buf.subarray(offset, end + 2));
          results.push(jpegData);
          offset = end + 2;
          found = true;
          break;
        }
        end++;
      }
      if (!found) break;
    } else {
      offset++;
    }
  }

  return results;
}

/**
 * Extract width and height from JPEG SOF (Start of Frame) marker.
 */
function getJPEGDimensions(jpeg: Buffer): { width: number; height: number } {
  let offset = 2; // Skip SOI marker

  while (offset < jpeg.length - 8) {
    if (jpeg[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = jpeg[offset + 1];

    // SOF markers: C0, C1, C2 (baseline, extended, progressive)
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      const height = jpeg.readUInt16BE(offset + 5);
      const width = jpeg.readUInt16BE(offset + 7);
      return { width, height };
    }

    // Skip to next marker
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
    } else {
      const length = jpeg.readUInt16BE(offset + 2);
      offset += 2 + length;
    }
  }

  return { width: 0, height: 0 };
}

/**
 * Encode raw pixel array (RGB or RGBA) to an uncompressed 24-bit BMP.
 * Simple, standard, and avoids needing external dependencies like 'canvas' or 'jimp'.
 */
function encodeBMP(width: number, height: number, data: Uint8Array | Uint8ClampedArray): Buffer {
  // BMP requires each row to be padded to a multiple of 4 bytes.
  const padding = (4 - ((width * 3) % 4)) % 4;
  const rowSize = width * 3 + padding;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize;

  const buf = Buffer.alloc(fileSize);
  
  // File Header (14 bytes)
  buf.write('BM', 0);
  buf.writeUInt32LE(fileSize, 2);
  buf.writeUInt32LE(54, 10); // Offset to pixel array

  // DIB Header (40 bytes - BITMAPINFOHEADER)
  buf.writeUInt32LE(40, 14); // Header size
  buf.writeInt32LE(width, 18);
  buf.writeInt32LE(-height, 22); // Negative height = top-down image
  buf.writeUInt16LE(1, 26); // Color planes
  buf.writeUInt16LE(24, 28); // 24 bits per pixel (RGB)
  buf.writeUInt32LE(0, 30); // No compression
  buf.writeUInt32LE(pixelArraySize, 34);

  let offset = 54;
  const isRGBA = data.length >= width * height * 4;
  const channels = isRGBA ? 4 : 3;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcOffset = (y * width + x) * channels;
      const r = data[srcOffset];
      const g = data[srcOffset + 1];
      const b = data[srcOffset + 2];
      
      // BMP is little-endian (BGR order)
      buf[offset++] = b;
      buf[offset++] = g;
      buf[offset++] = r;
    }
    // Add padding bytes
    for (let p = 0; p < padding; p++) {
      buf[offset++] = 0;
    }
  }

  return buf;
}
