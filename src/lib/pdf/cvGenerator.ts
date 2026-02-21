import { jsPDF } from "jspdf";
import { GeneratedCV } from "@/types/cv";
import { ColorTemplateColors } from "@/types/cvCustomization";
import { getColorTemplate, DEFAULT_COLOR_TEMPLATE } from "./colorTemplates";
import { loadFontsToDocument } from "./fontLoader";

const DEFAULT_COLORS = DEFAULT_COLOR_TEMPLATE.colors;

const FONTS = {
  heading: 16,
  subheading: 12,
  body: 10,
  small: 9,
};

export interface CVPDFOptions {
  colorTemplate?: string;
  photoBase64?: string;
}

export async function generateCVPDF(
  cv: GeneratedCV,
  highlightSection?: string,
  options?: CVPDFOptions
): Promise<jsPDF> {
  const doc = new jsPDF();

  // Resolve colors from template
  const COLORS: ColorTemplateColors = options?.colorTemplate
    ? getColorTemplate(options.colorTemplate).colors
    : DEFAULT_COLORS;

  const photoBase64 = options?.photoBase64;

  // Load Unicode-compatible fonts (Roboto) for international character support
  await loadFontsToDocument(doc);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Photo dimensions
  const photoSize = 25; // mm
  const hasPhoto = !!photoBase64;
  const contactTextWidth = hasPhoto ? contentWidth - photoSize - 5 : contentWidth;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number): string[] => {
    return doc.splitTextToSize(text, maxWidth);
  };

  // Helper function to draw highlight border around a section
  const drawHighlightBorder = (startY: number, endY: number) => {
    const padding = 3;
    const borderWidth = 2;
    doc.setDrawColor(COLORS.highlight);
    doc.setLineWidth(borderWidth);
    doc.roundedRect(
      margin - padding,
      startY - padding,
      contentWidth + padding * 2,
      endY - startY + padding * 2,
      3,
      3
    );
    doc.setLineWidth(0.5); // Reset line width
  };

  // 1. CONTACT SECTION
  const contactStartY = yPosition;

  // Add photo if available (right side of contact section)
  if (hasPhoto && photoBase64) {
    try {
      console.log("[cvGenerator] Adding photo to PDF, data length:", photoBase64.length, "starts with:", photoBase64.substring(0, 30));
      const photoX = pageWidth - margin - photoSize;
      const photoY = yPosition - 2;

      doc.setFillColor("#ffffff");
      doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, "F");

      // Convert photo to JPEG via canvas for maximum jsPDF compatibility
      const jpegDataUrl = await convertToJPEG(photoBase64);
      console.log("[cvGenerator] After conversion, format:", jpegDataUrl.substring(0, 30));

      const format = jpegDataUrl.includes("image/png") ? "PNG" : "JPEG";
      
      // Calculate object-fit: cover dimensions
      const imgProps = doc.getImageProperties(jpegDataUrl);
      const imgRatio = imgProps.width / imgProps.height;
      let targetW = photoSize;
      let targetH = photoSize;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > 1) {
        // Landscape
        targetW = photoSize * imgRatio;
        offsetX = (targetW - photoSize) / 2;
      } else if (imgRatio < 1) {
        // Portrait
        targetH = photoSize / imgRatio;
        offsetY = (targetH - photoSize) / 2;
      }

      // IMPORTANT: doc.clip() and saveGraphicsState() are broken in many jsPDF versions and cause text to disappear.
      // Instead we draw the image and then draw four very thick white arcs/corners over the square edges to make it look circular.
      // Easiest faux-clip: just draw a very thick circle over it.
      
      const imgSide = Math.max(targetW, targetH);
      doc.addImage(jpegDataUrl, format, photoX - offsetX, photoY - offsetY, targetW, targetH);
      
      // Faux-clipping: draw a very thick white circular border around the image to cover the square corners
      const coverThickness = imgSide / 2; // Thick enough to cover corners
      doc.setDrawColor("#ffffff");
      doc.setLineWidth(coverThickness);
      doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + (coverThickness / 2), "S");
      
      console.log("[cvGenerator] Photo added successfully with robust border-based faux-clip");

      // Draw circular border on top
      doc.setDrawColor(COLORS.primary);
      doc.setLineWidth(0.5);
      doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, "S");
    } catch (e) {
      console.error("[cvGenerator] Failed to add photo to PDF:", e);
      // Continue without photo
    }
  } else {
    console.log("[cvGenerator] No photo to add. hasPhoto:", hasPhoto, "photoBase64 length:", photoBase64?.length || 0);
  }

  doc.setFontSize(FONTS.heading + 4);
  doc.setTextColor(COLORS.primary);
  doc.text(cv.contact.name, margin, yPosition);
  yPosition += 8;

  // Contact details - Use comma separator for maximum ATS compatibility
  // IMPORTANT: Avoid special characters like • | — that confuse ATS parsers
  doc.setFontSize(FONTS.small);
  doc.setTextColor(COLORS.textLight);
  const contactDetails = [
    cv.contact.email,
    cv.contact.phone,
    cv.contact.location,
    cv.contact.linkedin,
    cv.contact.portfolio,
  ]
    .filter(Boolean)
    .join(", ");

  const contactLines = wrapText(contactDetails, contactTextWidth);
  contactLines.forEach((line) => {
    doc.text(line, margin, yPosition);
    yPosition += 4;
  });

  // If photo is present, ensure yPosition is at least past the photo
  if (hasPhoto) {
    const photoBottom = contactStartY - 2 + photoSize;
    if (yPosition < photoBottom) {
      yPosition = photoBottom;
    }
  }

  yPosition += 5;
  if (highlightSection === "contact") {
    drawHighlightBorder(contactStartY, yPosition);
  }

  // Divider line
  doc.setDrawColor(COLORS.border);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // 2. PROFESSIONAL SUMMARY
  const summaryStartY = yPosition;
  doc.setFont("Roboto", "bold");
  doc.setFontSize(FONTS.subheading);
  doc.setTextColor(COLORS.primary);
  doc.text("Professional Summary", margin, yPosition);
  yPosition += 6;

  doc.setFont("Roboto", "normal");
  doc.setFontSize(FONTS.body);
  doc.setTextColor(COLORS.text);
  const summaryLines = wrapText(cv.summary, contentWidth);
  summaryLines.forEach((line) => {
    checkPageBreak(5);
    doc.text(line, margin, yPosition);
    yPosition += 5;
  });
  yPosition += 5;
  if (highlightSection === "summary") {
    drawHighlightBorder(summaryStartY, yPosition);
  }

  // 3. EXPERIENCE
  const experienceStartY = yPosition;
  doc.setFont("Roboto", "bold");
  doc.setFontSize(FONTS.subheading);
  doc.setTextColor(COLORS.primary);
  doc.text("Professional Experience", margin, yPosition);
  yPosition += 6;

  cv.experience.forEach((exp) => {
    checkPageBreak(20);

    // Job title and company - ATS-friendly format without pipes
    doc.setFontSize(FONTS.body + 1);
    doc.setTextColor(COLORS.text);
    doc.setFont("Roboto", "bold");
    // Reset character spacing to prevent letter spacing issues
    if (typeof doc.setCharSpace === 'function') {
      doc.setCharSpace(0);
    }
    doc.text(`${exp.title} at ${exp.company}`, margin, yPosition);
    yPosition += 5;

    doc.setFont("Roboto", "normal");
    doc.setFontSize(FONTS.body);
    doc.text(
      `${exp.location}, ${exp.startDate} - ${exp.endDate}`,
      margin,
      yPosition
    );
    yPosition += 6;

    // Bullets
    exp.bullets.forEach((bullet) => {
      checkPageBreak(10);
      doc.setFont("Roboto", "normal");
      doc.setFontSize(FONTS.body);
      doc.setTextColor(COLORS.text);

      // Bullet point (using simple dash for better compatibility)
      doc.text("-", margin + 2, yPosition);

      // Wrap bullet text
      const bulletLines = wrapText(bullet, contentWidth - 8);
      bulletLines.forEach((line, lineIndex) => {
        if (lineIndex > 0) {
          checkPageBreak(5);
        }
        doc.text(line, margin + 7, yPosition);
        yPosition += 5;
      });
    });

    yPosition += 3;
  });

  yPosition += 2;
  if (highlightSection === "experience") {
    drawHighlightBorder(experienceStartY, yPosition);
  }

  // 4. EDUCATION
  checkPageBreak(15);
  const educationStartY = yPosition;
  doc.setFont("Roboto", "bold");
  doc.setFontSize(FONTS.subheading);
  doc.setTextColor(COLORS.primary);
  doc.text("Education", margin, yPosition);
  yPosition += 6;

  cv.education.forEach((edu) => {
    checkPageBreak(12);
    doc.setFontSize(FONTS.body + 1);
    doc.setTextColor(COLORS.text);
    doc.setFont("Roboto", "bold");
    doc.text(edu.degree, margin, yPosition);
    yPosition += 5;

    doc.setFont("Roboto", "normal");
    doc.setFontSize(FONTS.body);
    // Build education details - only include values that exist
    const eduDetails = [edu.institution, edu.location, edu.graduationDate]
      .filter(Boolean)
      .join(", ");
    doc.text(eduDetails, margin, yPosition);
    yPosition += 5;

    if (edu.details) {
      doc.setFontSize(FONTS.small);
      doc.setTextColor(COLORS.textLight);
      const detailLines = wrapText(edu.details, contentWidth);
      detailLines.forEach((line) => {
        checkPageBreak(4);
        doc.text(line, margin, yPosition);
        yPosition += 4;
      });
    }

    yPosition += 3;
  });

  yPosition += 2;
  if (highlightSection === "education") {
    drawHighlightBorder(educationStartY, yPosition);
  }

  // 5. SKILLS
  checkPageBreak(15);
  const skillsStartY = yPosition;
  doc.setFont("Roboto", "bold");
  doc.setFontSize(FONTS.subheading);
  doc.setTextColor(COLORS.primary);
  doc.text("Skills", margin, yPosition);
  yPosition += 6;

  // Technical Skills
  doc.setFontSize(FONTS.body);
  doc.setTextColor(COLORS.text);
  doc.setFont("Roboto", "bold");
  doc.text("Technical Skills:", margin, yPosition);
  yPosition += 5;

  doc.setFont("Roboto", "normal");
  const techSkillsText = cv.skills.technical.join(", ");
  const techSkillsLines = wrapText(techSkillsText, contentWidth - 5);
  techSkillsLines.forEach((line) => {
    checkPageBreak(5);
    doc.text(line, margin + 5, yPosition);
    yPosition += 5;
  });

  yPosition += 2;

  // Soft Skills
  doc.setFont("Roboto", "bold");
  doc.text("Soft Skills:", margin, yPosition);
  yPosition += 5;

  doc.setFont("Roboto", "normal");
  const softSkillsText = cv.skills.soft.join(", ");
  const softSkillsLines = wrapText(softSkillsText, contentWidth - 5);
  softSkillsLines.forEach((line) => {
    checkPageBreak(5);
    doc.text(line, margin + 5, yPosition);
    yPosition += 5;
  });

  yPosition += 2;
  if (highlightSection === "skills") {
    drawHighlightBorder(skillsStartY, yPosition);
  }

  // 6. CERTIFICATIONS (if present)
  if (cv.certifications && cv.certifications.length > 0) {
    yPosition += 2;
    checkPageBreak(15);
    const certificationsStartY = yPosition;
    doc.setFont("Roboto", "bold");
    doc.setFontSize(FONTS.subheading);
    doc.setTextColor(COLORS.primary);
    doc.text("Certifications", margin, yPosition);
    yPosition += 6;

    cv.certifications.forEach((cert) => {
      checkPageBreak(8);
      doc.setFontSize(FONTS.body);
      doc.setTextColor(COLORS.text);
      doc.setFont("Roboto", "bold");
      doc.text(cert.name, margin, yPosition);
      yPosition += 5;

      doc.setFont("Roboto", "normal");
      doc.setFontSize(FONTS.small);
      // Build certification details - only include values that exist
      const certDetails = [cert.issuer, cert.date].filter(Boolean).join(", ");
      doc.text(certDetails, margin, yPosition);
      yPosition += 5;
    });
    if (highlightSection === "certifications") {
      drawHighlightBorder(certificationsStartY, yPosition);
    }
  }

  // 7. LANGUAGES (if present)
  if (cv.languages && cv.languages.length > 0) {
    yPosition += 2;
    checkPageBreak(15);
    const languagesStartY = yPosition;
    doc.setFont("Roboto", "bold");
    doc.setFontSize(FONTS.subheading);
    doc.setTextColor(COLORS.primary);
    doc.text("Languages", margin, yPosition);
    yPosition += 6;

    doc.setFont("Roboto", "normal");
    doc.setFontSize(FONTS.body);
    doc.setTextColor(COLORS.text);
    const languagesText = cv.languages
      .map((lang) => `${lang.language} (${lang.proficiency})`)
      .join(", ");
    const languageLines = wrapText(languagesText, contentWidth);
    languageLines.forEach((line) => {
      checkPageBreak(5);
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });
    if (highlightSection === "languages") {
      drawHighlightBorder(languagesStartY, yPosition);
    }
  }

  return doc;
}

/**
 * Convert any image data URL to JPEG format using canvas.
 * jsPDF has unreliable PNG support in some environments,
 * but JPEG always works.
 */
async function convertToJPEG(dataUrl: string): Promise<string> {
  // If already JPEG, return as-is
  if (dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg")) {
    return dataUrl;
  }

  // In browser: use canvas to convert PNG -> JPEG
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback: return original and hope for the best
          resolve(dataUrl);
          return;
        }
        // White background (JPEG has no transparency)
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.onerror = () => reject(new Error("Failed to load image for conversion"));
      img.src = dataUrl;
    });
  }

  // In Node.js: return as-is (server-side PDF generation won't have photos typically)
  return dataUrl;
}
