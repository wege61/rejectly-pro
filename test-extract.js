const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function testExtraction() {
  const standardFontDataUrl = 'node_modules/pdfjs-dist/standard_fonts/';
  
  // Create a minimal reliable PDF if none exists or use a local small one
  console.log("PDFJS Version:", pdfjsLib.version);
}
testExtraction().catch(console.error);
