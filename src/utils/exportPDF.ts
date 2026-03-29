import { GeneratedCV } from '@/types/cv';
import { generateCVPDF } from '@/lib/pdf/cvGenerator';

export const generatePDF = async (_elementId: string, filename: string, cvData?: GeneratedCV): Promise<void> => {
  if (!cvData) return;

  try {
    const doc = await generateCVPDF(cvData);
    const pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    doc.save(pdfFilename);
  } catch (e) {
    console.error('PDF generation failed:', e);
  }
};
