import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "fs";
import path from "path";

// 1. Read worker from disk
const workerPath = path.join(process.cwd(), "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs");
const workerCode = fs.readFileSync(workerPath, "utf8");

// 2. Convert to Data URL (Node.js supports data: URLs for ESM workers)
const base64Worker = Buffer.from(workerCode).toString("base64");
pdfjsLib.GlobalWorkerOptions.workerSrc = `data:text/javascript;base64,${base64Worker}`;

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

async function run() {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array([0,1,2,3]),
      disableFontFace: true,
      isEvalSupported: false,
    });
    await loadingTask.promise;
  } catch (e: any) {
    console.error("Caught error:", e.message);
  }
}

run();
