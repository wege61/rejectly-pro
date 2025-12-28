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
 */
export async function loadFontsToDocument(doc: jsPDF): Promise<void> {
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
        console.warn("Font files not found, using default font");
        return; // Use default font
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
        console.warn("Failed to load Roboto-Regular.ttf, using default font");
        return;
      }
      const regularBuffer = await regularResponse.arrayBuffer();
      regularBase64 = arrayBufferToBase64(regularBuffer);

      const boldResponse = await fetch("/fonts/Roboto-Bold.ttf");
      if (!boldResponse.ok) {
        console.warn("Failed to load Roboto-Bold.ttf, using default font");
        return;
      }
      const boldBuffer = await boldResponse.arrayBuffer();
      boldBase64 = arrayBufferToBase64(boldBuffer);
    }

    // Add fonts to jsPDF virtual file system
    doc.addFileToVFS("Roboto-Regular.ttf", regularBase64);
    doc.addFileToVFS("Roboto-Bold.ttf", boldBase64);

    // Register fonts with jsPDF
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

    // Set Roboto as default font
    doc.setFont("Roboto", "normal");
  } catch (error) {
    console.error("Failed to load fonts:", error);
    // Continue with default font instead of throwing
    console.warn("Using default Helvetica font");
  }
}
