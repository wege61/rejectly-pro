import { jsPDF } from "jspdf";
import { GeneratedCV } from "@/types/cv";

const COLORS = {
  primary: "#2563eb", // Blue
  text: "#1f2937", // Dark gray
  textLight: "#6b7280", // Light gray
  border: "#e5e7eb", // Very light gray
};

const FONTS = {
  heading: 16,
  subheading: 12,
  body: 10,
  small: 9,
};

export function generateCVPDF(cv: GeneratedCV): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

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

  // 1. CONTACT SECTION
  doc.setFontSize(FONTS.heading + 4);
  doc.setTextColor(COLORS.primary);
  doc.text(cv.contact.name, margin, yPosition);
  yPosition += 8;

  // Contact details
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
    .join(" | ");

  const contactLines = wrapText(contactDetails, contentWidth);
  contactLines.forEach((line) => {
    doc.text(line, margin, yPosition);
    yPosition += 4;
  });

  yPosition += 5;

  // Divider line
  doc.setDrawColor(COLORS.border);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // 2. PROFESSIONAL SUMMARY
  doc.setFontSize(FONTS.subheading);
  doc.setTextColor(COLORS.primary);
  doc.text("PROFESSIONAL SUMMARY", margin, yPosition);
  yPosition += 6;

  doc.setFontSize(FONTS.body);
  doc.setTextColor(COLORS.text);
  const summaryLines = wrapText(cv.summary, contentWidth);
  summaryLines.forEach((line) => {
    checkPageBreak(5);
    doc.text(line, margin, yPosition);
    yPosition += 5;
  });
  yPosition += 5;

  // 3. EXPERIENCE
  doc.setFontSize(FONTS.subheading);
  doc.setTextColor(COLORS.primary);
  doc.text("PROFESSIONAL EXPERIENCE", margin, yPosition);
  yPosition += 6;

  cv.experience.forEach((exp, index) => {
    checkPageBreak(20);

    // Job title and company
    doc.setFontSize(FONTS.body + 1);
    doc.setTextColor(COLORS.text);
    doc.setFont("helvetica", "bold");
    doc.text(exp.title, margin, yPosition);
    yPosition += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONTS.body);
    doc.text(
      `${exp.company} | ${exp.location} | ${exp.startDate} - ${exp.endDate}`,
      margin,
      yPosition
    );
    yPosition += 6;

    // Bullets
    exp.bullets.forEach((bullet) => {
      checkPageBreak(10);
      doc.setFontSize(FONTS.body);
      doc.setTextColor(COLORS.text);

      // Bullet point
      doc.text("•", margin + 2, yPosition);

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

  // 4. EDUCATION
  checkPageBreak(15);
  doc.setFontSize(FONTS.subheading);
  doc.setTextColor(COLORS.primary);
  doc.text("EDUCATION", margin, yPosition);
  yPosition += 6;

  cv.education.forEach((edu) => {
    checkPageBreak(12);
    doc.setFontSize(FONTS.body + 1);
    doc.setTextColor(COLORS.text);
    doc.setFont("helvetica", "bold");
    doc.text(edu.degree, margin, yPosition);
    yPosition += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONTS.body);
    doc.text(
      `${edu.institution} | ${edu.location} | ${edu.graduationDate}`,
      margin,
      yPosition
    );
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

  // 5. SKILLS
  checkPageBreak(15);
  doc.setFontSize(FONTS.subheading);
  doc.setTextColor(COLORS.primary);
  doc.text("SKILLS", margin, yPosition);
  yPosition += 6;

  // Technical Skills
  doc.setFontSize(FONTS.body);
  doc.setTextColor(COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("Technical Skills:", margin, yPosition);
  yPosition += 5;

  doc.setFont("helvetica", "normal");
  const techSkillsText = cv.skills.technical.join(", ");
  const techSkillsLines = wrapText(techSkillsText, contentWidth - 5);
  techSkillsLines.forEach((line) => {
    checkPageBreak(5);
    doc.text(line, margin + 5, yPosition);
    yPosition += 5;
  });

  yPosition += 2;

  // Soft Skills
  doc.setFont("helvetica", "bold");
  doc.text("Soft Skills:", margin, yPosition);
  yPosition += 5;

  doc.setFont("helvetica", "normal");
  const softSkillsText = cv.skills.soft.join(", ");
  const softSkillsLines = wrapText(softSkillsText, contentWidth - 5);
  softSkillsLines.forEach((line) => {
    checkPageBreak(5);
    doc.text(line, margin + 5, yPosition);
    yPosition += 5;
  });

  yPosition += 2;

  // 6. CERTIFICATIONS (if present)
  if (cv.certifications && cv.certifications.length > 0) {
    yPosition += 2;
    checkPageBreak(15);
    doc.setFontSize(FONTS.subheading);
    doc.setTextColor(COLORS.primary);
    doc.text("CERTIFICATIONS", margin, yPosition);
    yPosition += 6;

    cv.certifications.forEach((cert) => {
      checkPageBreak(8);
      doc.setFontSize(FONTS.body);
      doc.setTextColor(COLORS.text);
      doc.setFont("helvetica", "bold");
      doc.text(cert.name, margin, yPosition);
      yPosition += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(FONTS.small);
      doc.text(`${cert.issuer} | ${cert.date}`, margin, yPosition);
      yPosition += 5;
    });
  }

  // 7. LANGUAGES (if present)
  if (cv.languages && cv.languages.length > 0) {
    yPosition += 2;
    checkPageBreak(15);
    doc.setFontSize(FONTS.subheading);
    doc.setTextColor(COLORS.primary);
    doc.text("LANGUAGES", margin, yPosition);
    yPosition += 6;

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
  }

  return doc;
}
