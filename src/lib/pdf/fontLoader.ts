import { jsPDF } from "jspdf";

/**
 * Converts ArrayBuffer to base64 string
 * Works in both browser and Node.js environments
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);

  // Check if we're in Node.js environment
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  // Browser environment
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Loads Roboto fonts and adds them to jsPDF document
 * This enables Unicode character support (Turkish, Arabic, Chinese, etc.)
 * Works in both browser and server environments
 */
export async function loadFontsToDocument(doc: jsPDF): Promise<void> {
  try {
    let regularBase64: string;
    let boldBase64: string;

    // Check if we're in Node.js environment (server-side)
    const isServer = typeof window === 'undefined';

    if (isServer) {
      // Server-side: read fonts from file system
      const fs = await import('fs');
      const path = await import('path');

      const publicDir = path.join(process.cwd(), 'public');

      const regularPath = path.join(publicDir, 'fonts', 'Roboto-Regular.ttf');
      const boldPath = path.join(publicDir, 'fonts', 'Roboto-Bold.ttf');

      const regularBuffer = fs.readFileSync(regularPath);
      const boldBuffer = fs.readFileSync(boldPath);

      regularBase64 = regularBuffer.toString('base64');
      boldBase64 = boldBuffer.toString('base64');
    } else {
      // Browser-side: fetch fonts via HTTP
      const regularResponse = await fetch("/fonts/Roboto-Regular.ttf");
      if (!regularResponse.ok) {
        throw new Error("Failed to load Roboto-Regular.ttf");
      }
      const regularBuffer = await regularResponse.arrayBuffer();
      regularBase64 = arrayBufferToBase64(regularBuffer);

      const boldResponse = await fetch("/fonts/Roboto-Bold.ttf");
      if (!boldResponse.ok) {
        throw new Error("Failed to load Roboto-Bold.ttf");
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
    // Fallback to default font if loading fails
    // This ensures PDF generation doesn't fail completely
    throw new Error(
      "Font loading failed. Please ensure font files are in public/fonts directory."
    );
  }
}
