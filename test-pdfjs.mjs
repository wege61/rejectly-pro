import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function test() {
  const pdfBytes = fs.readFileSync('test-cv.pdf'); // let me download the file first
}
