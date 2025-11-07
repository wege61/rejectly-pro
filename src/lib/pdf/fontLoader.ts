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
  return btoa(binary);
}

/**
 * Loads Roboto fonts and adds them to jsPDF document
 * This enables Unicode character support (Turkish, Arabic, Chinese, etc.)
 */
export async function loadFontsToDocument(doc: jsPDF): Promise<void> {
  try {
    // Fetch Roboto Regular font
    const regularResponse = await fetch("/fonts/Roboto-Regular.ttf");
    if (!regularResponse.ok) {
      throw new Error("Failed to load Roboto-Regular.ttf");
    }
    const regularBuffer = await regularResponse.arrayBuffer();
    const regularBase64 = arrayBufferToBase64(regularBuffer);

    // Fetch Roboto Bold font
    const boldResponse = await fetch("/fonts/Roboto-Bold.ttf");
    if (!boldResponse.ok) {
      throw new Error("Failed to load Roboto-Bold.ttf");
    }
    const boldBuffer = await boldResponse.arrayBuffer();
    const boldBase64 = arrayBufferToBase64(boldBuffer);

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
