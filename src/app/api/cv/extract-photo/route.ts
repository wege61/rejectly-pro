import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    console.log("[extract-photo] Downloading PDF from:", fileUrl.substring(0, 80) + "...");

    // Download the PDF
    let pdfBytes: Buffer;
    try {
      const response = await fetch(fileUrl);
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

    // Extract JPEG images from raw PDF bytes
    // Most CV photos are embedded as JPEG (DCTDecode) - we scan for JPEG markers
    const jpegImages = findAllJPEGs(pdfBytes);
    console.log("[extract-photo] Found", jpegImages.length, "JPEG images in PDF");

    if (jpegImages.length === 0) {
      return NextResponse.json({ found: false });
    }

    // Pick the best candidate:
    // - Filter out tiny images (<3KB, likely icons/logos)
    // - Filter out huge images (>5MB, likely full-page scans)
    // - Prefer medium-sized images (typical photo: 10KB-500KB)
    const candidates = jpegImages
      .filter((img) => img.length > 3000 && img.length < 5_000_000)
      .sort((a, b) => {
        // Score: prefer images in the "photo" size range (10KB-500KB)
        const scoreA = a.length > 10000 && a.length < 500000 ? 1 : 0;
        const scoreB = b.length > 10000 && b.length < 500000 ? 1 : 0;
        if (scoreA !== scoreB) return scoreB - scoreA;
        // Among similar scores, prefer larger (more likely a photo than a logo)
        return b.length - a.length;
      });

    if (candidates.length === 0) {
      console.log("[extract-photo] No suitable JPEG candidates after filtering");
      return NextResponse.json({ found: false });
    }

    const best = candidates[0];
    console.log("[extract-photo] Selected JPEG image, size:", best.length, "bytes");

    // Read JPEG dimensions from SOF marker
    const dims = getJPEGDimensions(best);

    const base64 = best.toString("base64");
    return NextResponse.json({
      found: true,
      photoBase64: `data:image/jpeg;base64,${base64}`,
      width: dims.width,
      height: dims.height,
    });
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
