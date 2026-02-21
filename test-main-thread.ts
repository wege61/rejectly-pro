import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

console.log("Starting test...");

async function testMainThread() {
  const pdfBytes = fs.readFileSync("/Users/alp179/Downloads/Климова_Ангелина (1).pdf");
  
  // Disable the Web Worker completely! Runs locally on main thread.
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfBytes),
    disableFontFace: true,
    isEvalSupported: false,
    useWorkerFetch: false,
  });

  const pdfDoc = await loadingTask.promise;
  console.log("Num Pages:", pdfDoc.numPages);
  
  const page = await pdfDoc.getPage(1);
  const ops = await page.getOperatorList();
  
  for (let i = 0; i < ops.fnArray.length; i++) {
    if (ops.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
      const objId = ops.argsArray[i][0];
      const imgData = await page.objs.get(objId);
      console.log(`Found image: ${imgData.width}x${imgData.height}`);
      return;
    }
  }
}

testMainThread().catch(console.error);
