const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
require("pdfjs-dist/legacy/build/pdf.worker.js");

const pdfBytes = fs.readFileSync("/Users/alp179/Downloads/Климова_Ангелина (1).pdf");

pdfjsLib.getDocument({
  data: new Uint8Array(pdfBytes),
  disableFontFace: true,
  isEvalSupported: false,
}).promise.then(doc => {
  console.log("Success! Pages:", doc.numPages);
}).catch(console.error);
