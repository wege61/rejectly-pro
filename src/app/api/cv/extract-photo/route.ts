import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import path from "path";
// @ts-ignore - Ignore missing types for legacy build
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// Force Vercel to include the worker in the Serverless bundle
import "pdfjs-dist/legacy/build/pdf.worker.mjs";

// Tell pdfjs to use the included worker's absolute path
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(process.cwd(), "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs");

// Polyfill for Node.js environments if needed
if (typeof Promise.withResolvers === "undefined") {
  Promise.withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

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

    // Parse PDF using pdfjs-dist to find properly encoded images
    console.log("[extract-photo] Parsing PDF with pdfjs-dist...");
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(pdfBytes),
        disableFontFace: true,
        isEvalSupported: false,
      });
      const pdfDoc = await loadingTask.promise;
      
      let bestImage: { width: number, height: number, data: Uint8ClampedArray } | null = null;
      let maxArea = 0;

      // Scan first 4 pages for photos (some CVs have photo on page 2 or 3)
      const numPages = Math.min(pdfDoc.numPages, 4);
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const ops = await page.getOperatorList();
        
        for (let i = 0; i < ops.fnArray.length; i++) {
          if (ops.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
            const objId = ops.argsArray[i][0];
            try {
              let imgData: any;
              if (page.objs.has(objId)) {
                imgData = await page.objs.get(objId);
              } else {
                imgData = page.commonObjs.has(objId) 
                  ? await page.commonObjs.get(objId) 
                  : await new Promise((resolve) => page.objs.get(objId, resolve));
              }
              if (imgData && imgData.data && imgData.width && imgData.height) {
                // Filter sizes: CV photos can be very high res (e.g. 2000x2000 = 4M area)
                // Filter out very tiny icons (< 80px) and extreme panoramas/banners
                const area = imgData.width * imgData.height;
                const minS = Math.min(imgData.width, imgData.height);
                const maxS = Math.max(imgData.width, imgData.height);
                const ratio = maxS / minS;
                
                // Allow up to 12M area and ratio up to 4 (in case they have a portrait photo)
                if (area > 5000 && area < 12000000 && ratio < 4.0) {
                  if (area > maxArea) {
                    maxArea = area;
                    bestImage = { width: imgData.width, height: imgData.height, data: imgData.data };
                  }
                }
              }
            } catch (imgErr) {
              console.warn("Could not extract image object:", objId, imgErr);
            }
          }
        }
      }

      const img = bestImage;
      if (img) {
        const { width, height, data } = img;
        console.log(`[extract-photo] Extracted raw image with dimensions ${width}x${height}`);
        // Encode raw RGBA/RGB to BMP format
        const bmpBuffer = encodeBMP(width, height, data);
        const base64 = bmpBuffer.toString('base64');
        return NextResponse.json({
          found: true,
          photoBase64: `data:image/bmp;base64,${base64}`,
          width: width,
          height: height,
        });
      }
    } catch (pdfjsErr) {
      console.error("[extract-photo] pdfjs parsing failed:", pdfjsErr);
    }

    console.log("[extract-photo] No suitable photo found via parsing either.");
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
