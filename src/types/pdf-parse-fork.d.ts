/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "pdf-parse-fork" {
  interface PDFInfo {
    PDFFormatVersion: string;
    IsAcroFormPresent: boolean;
    IsXFAPresent: boolean;
    [key: string]: any;
  }

  interface PDFMetadata {
    [key: string]: any;
  }

  interface PDFData {
    numpages: number;
    numrender: number;
    info: PDFInfo;
    metadata: PDFMetadata | null;
    text: string;
    version: string;
  }

  function parse(
    dataBuffer: Buffer,
    options?: Record<string, unknown>
  ): Promise<PDFData>;

  export default parse;
}
