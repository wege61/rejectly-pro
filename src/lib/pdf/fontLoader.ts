import { jsPDF } from "jspdf";

/**
 * Converts ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // Use Buffer.from for server, btoa for browser
  if (typeof window === 'undefined') {
    return Buffer.from(binary, 'binary').toString('base64');
  }
  return btoa(binary);
}

/**
 * Loads Roboto fonts and adds them to jsPDF document
 * Works in both browser and server environments
 * CRITICAL: Roboto is required for Turkish/international character support
 */
export async function loadFontsToDocument(doc: jsPDF): Promise<boolean> {
  try {
    let regularBase64: string;
    let boldBase64: string;

    // Server-side: use dynamic import for fs
    if (typeof window === 'undefined') {
      const fs = await import('fs');
      const path = await import('path');

      const publicDir = path.join(process.cwd(), 'public');
      const regularPath = path.join(publicDir, 'fonts', 'Roboto-Regular.ttf');
      const boldPath = path.join(publicDir, 'fonts', 'Roboto-Bold.ttf');

      // Check if fonts exist
      if (!fs.existsSync(regularPath) || !fs.existsSync(boldPath)) {
        console.error("CRITICAL: Font files not found at:", { regularPath, boldPath });
        console.warn("Turkish/international characters may not render correctly!");
        return false;
      }

      const regularBuffer = fs.readFileSync(regularPath);
      const boldBuffer = fs.readFileSync(boldPath);

      regularBase64 = regularBuffer.toString('base64');
      boldBase64 = boldBuffer.toString('base64');
    }
    // Browser-side: fetch via HTTP
    else {
      const regularResponse = await fetch("/fonts/Roboto-Regular.ttf");
      if (!regularResponse.ok) {
        console.error("CRITICAL: Failed to load Roboto-Regular.ttf");
        console.warn("Turkish/international characters may not render correctly!");
        return false;
      }
      const regularBuffer = await regularResponse.arrayBuffer();
      regularBase64 = arrayBufferToBase64(regularBuffer);

      const boldResponse = await fetch("/fonts/Roboto-Bold.ttf");
      if (!boldResponse.ok) {
        console.error("CRITICAL: Failed to load Roboto-Bold.ttf");
        console.warn("Turkish/international characters may not render correctly!");
        return false;
      }
      const boldBuffer = await boldResponse.arrayBuffer();
      boldBase64 = arrayBufferToBase64(boldBuffer);
    }

    // Add fonts to jsPDF virtual file system
    doc.addFileToVFS("Roboto-Regular.ttf", regularBase64);
    doc.addFileToVFS("Roboto-Bold.ttf", boldBase64);

    // Register fonts with jsPDF
    // CRITICAL: Use Identity-H encoding for proper Unicode/Turkish character support
    // Without this, characters like ç, ğ, ı, ö, ş, ü may have spacing issues
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal", undefined, "Identity-H");
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold", undefined, "Identity-H");

    // Set Roboto as default font
    doc.setFont("Roboto", "normal");

    // Reset character spacing to prevent spacing issues
    // This is critical for consistent text rendering
    if (typeof doc.setCharSpace === 'function') {
      doc.setCharSpace(0);
    }

    return true;
  } catch (error) {
    console.error("CRITICAL: Failed to load fonts:", error);
    console.warn("Turkish/international characters may not render correctly! Using Helvetica fallback.");
    return false;
  }
}
