import { jsPDF } from "jspdf";
import { GeneratedCV, CVExperience, CVEducation, CVCertification, CVLeadership } from "@/types/cv";
import { loadFontsToDocument } from "./fontLoader";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const color = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
  return [(color >> 16) & 255, (color >> 8) & 255, color & 255];
}

function detectCVLanguage(cv: GeneratedCV): 'tr' | 'en' {
  const text = [cv.summary, ...(cv.experience?.[0]?.bullets || [])].join(' ').toLowerCase();
  const turkishChars = /[şçğıöüŞÇĞİÖÜ]/;
  const turkishWords = /\b(ve|ile|için|olan|bir|bu|da|de|olarak|süreç|yönet|müşteri|sağla|artır)\b/i;
  if (turkishChars.test(text) || turkishWords.test(text)) return 'tr';
  return 'en';
}

const LABELS = {
  en: {
    professionalSummary: 'SUMMARY',
    professionalExperience: 'EXPERIENCE & PROJECTS',
    education: 'EDUCATION',
    skills: 'SKILLS',
    certifications: 'CERTIFICATIONS & COURSES',
    languages: 'LANGUAGES',
    leadership: 'LEADERSHIP & ACTIVITIES',
  },
  tr: {
    professionalSummary: 'ÖZET',
    professionalExperience: 'İŞ DENEYİMİ',
    education: 'EĞİTİM',
    skills: 'YETENEKLER',
    certifications: 'SERTİFİKALAR VE KURSLAR',
    languages: 'DİLLER',
    leadership: 'LİDERLİK VE AKTİVİTELER',
  },
};

export interface CVPDFOptions {
  colorTemplate?: string;
  photoBase64?: string;
}

const parseDateForSort = (dateStr?: string | null) => {
  if (!dateStr || dateStr.trim() === '') return 0;
  const lower = dateStr.toLowerCase();
  if (lower.includes('present') || lower.includes('devam') || lower.includes('cerrent')) {
    return Infinity;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.getTime();
  }
  const match = dateStr.match(/\d{4}/);
  if (match) {
    return parseInt(match[0]) * 31556952000; 
  }
  return 0; 
};

const getColorTemplateHex = (templateName?: string): string | null => {
  const templates: Record<string, string> = {
    'modern-blue': '#2563eb', 
    'classic-navy': '#1e3a8a',
    'emerald-green': '#059669',
    'royal-purple': '#7c3aed',
    'crimson-red': '#dc2626',
    'slate-grey': '#475569',
  };
  return templateName ? templates[templateName] || null : null;
};

export async function generateCVPDF(
  cv: GeneratedCV,
  highlightSection?: string,
  options?: CVPDFOptions
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  const themeColorHex = options?.colorTemplate ? getColorTemplateHex(options.colorTemplate) : null;
  const themeColor = themeColorHex || cv.themeColor || '#2563eb';
  const photoBase64 = options?.photoBase64 || cv.photoUrl;

  await loadFontsToDocument(doc);
  
  const marginX = 18;
  const marginY = 18;
  const contentWidth = pageWidth - 2 * marginX;
  let yPosition = marginY;

  const FONTS = {
    name: 22,
    section: 10.5,
    title: 10.5,
    subtitle: 9.5,
    date: 9,
    body: 9.5,
  };

  const COLORS = {
    theme: themeColor,
    main: '#1a1a1a',
    secondary: '#444444',
    light: '#666666',
    bullet: '#333333',
    contact: '#555555'
  };

  const checkPageBreak = (requiredMM: number) => {
    if (yPosition + requiredMM > pageHeight - marginY) {
      doc.addPage();
      yPosition = marginY;
      return true;
    }
    return false;
  };

  const getLines = (text: string, maxWMM: number): string[] => {
    return doc.splitTextToSize(text, maxWMM);
  };

  const drawHighlightBorder = (startY: number, endY: number) => {
    const padding = 2;
    const boxX = marginX - padding;
    const boxY = startY - padding;
    const boxH = endY - startY + padding * 2;
    const accentColor = "#0A84FF"; 

    doc.saveGraphicsState();
    // @ts-ignore
    doc.setGState(new doc.GState({ opacity: 0.05 }));
    doc.setFillColor(accentColor);
    doc.rect(boxX, boxY, contentWidth + padding * 2, boxH, "F");
    doc.restoreGraphicsState();

    doc.setFillColor(accentColor);
    doc.rect(boxX, boxY, 1, boxH, "F");
  };

  // ==========================================
  // 1. HEADER SECTION
  // ==========================================
  const headerStartY = yPosition;
  const hasPhoto = !!photoBase64 && photoBase64.length > 50;
  
  const photoW = 22;               
  const photoH = 27.5;           
  const textMaxWidth = hasPhoto ? contentWidth - photoW - 6 : contentWidth; 

  doc.setFont("Roboto", "bold");
  doc.setFontSize(FONTS.name);
  doc.setTextColor(COLORS.theme);
  
  if (cv.contact.name) {
    yPosition += 10; // Extra room above name
    doc.text(cv.contact.name, marginX, yPosition);
    yPosition += 10; // Giant cushion below the name
  }

  doc.setFont("Roboto", "normal");
  doc.setFontSize(FONTS.date);
  doc.setTextColor(COLORS.contact);
  const contactItems = [
    cv.contact.email,
    cv.contact.phone && `• ${cv.contact.phone}`,
    cv.contact.location && `• ${cv.contact.location}`,
    cv.contact.linkedin && `• ${cv.contact.linkedin.replace('https://', '')}`,
    cv.contact.portfolio && `• ${cv.contact.portfolio.replace('https://', '')}`
  ].filter(Boolean) as string[];

  const contactText = contactItems.join(" ");
  const contactLines = getLines(contactText, textMaxWidth);
  
  if (contactLines.length > 0) {
    yPosition += 1; 
    contactLines.forEach(line => {
      doc.text(line, marginX, yPosition);
      yPosition += 5.5;
    });
  }

  if (hasPhoto) {
    try {
      const photoX = pageWidth - marginX - photoW;
      const photoY = headerStartY;

      const jpegDataUrl = await convertToJPEG(photoBase64);
      const format = jpegDataUrl.includes("image/png") ? "PNG" : "JPEG";
      const imgProps = doc.getImageProperties(jpegDataUrl);
      const imgRatio = imgProps.width / imgProps.height;
      
      let targetW = photoW;
      let targetH = photoH;
      let offsetX = 0;
      let offsetY = 0;

      const targetRatio = photoW / photoH;
      if (imgRatio > targetRatio) {
        targetW = photoH * imgRatio;
        offsetX = (targetW - photoW) / 2;
      } else if (imgRatio < targetRatio) {
        targetH = photoW / imgRatio;
        offsetY = (targetH - photoH) / 2;
      }

      const bRad = 1.5;

      // Draw the image first (it may overflow its box)
      await doc.addImage(jpegDataUrl, format, photoX - offsetX, photoY - offsetY, targetW, targetH);
      
      // Faux-clip: Draw white rectangles EXACTLY over the overhanging regions to hide them
      doc.setFillColor("#ffffff");
      // Top overhang
      if (offsetY > 0) doc.rect(photoX - offsetX, photoY - offsetY - 1, targetW + 2, offsetY + 1, "F");
      // Bottom overhang
      if (offsetY > 0) doc.rect(photoX - offsetX, photoY + photoH, targetW + 2, offsetY + 2, "F");
      // Left overhang
      if (offsetX > 0) doc.rect(photoX - offsetX - 1, photoY - offsetY, offsetX + 1, targetH + 2, "F");
      // Right overhang
      if (offsetX > 0) doc.rect(photoX + photoW, photoY - offsetY, offsetX + 2, targetH + 2, "F");
      
      // Sleek Border drawn exactly on the bounding box
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.4);
      doc.roundedRect(photoX, photoY, photoW, photoH, bRad, bRad, "S");

    } catch (e) {
      console.error("[cvGenerator] Failed to add photo:", e);
    }
  }

  const photoBottom = headerStartY + (hasPhoto ? photoH : 0);
  if (hasPhoto && yPosition < photoBottom) {
    yPosition = photoBottom;
  }

  if (highlightSection === "contact") drawHighlightBorder(headerStartY, yPosition);

  // Header Divider
  yPosition += 6; // Deep space after photo
  doc.setDrawColor(COLORS.theme);
  doc.setLineWidth(0.5);
  doc.line(marginX, yPosition, pageWidth - marginX, yPosition);
  yPosition += 8; // Deep space before first section

  const lang = detectCVLanguage(cv);
  const L = LABELS[lang];

  const drawSectionTitle = (title: string) => {
    checkPageBreak(12);
    doc.setFont("Roboto", "bold");
    doc.setFontSize(FONTS.section);
    doc.setTextColor(COLORS.theme);
    
    const letterSpacedTitle = title.split('').join(String.fromCharCode(8202));
    
    yPosition += 6;
    doc.text(letterSpacedTitle, marginX, yPosition);
    yPosition += 3.5;
    
    const [r, g, b] = hexToRgb(COLORS.theme);
    doc.setDrawColor(
      Math.round(r * 0.25 + 255 * 0.75), 
      Math.round(g * 0.25 + 255 * 0.75), 
      Math.round(b * 0.25 + 255 * 0.75)
    );
    doc.setLineWidth(0.2);
    doc.line(marginX, yPosition, pageWidth - marginX, yPosition);
    
    yPosition += 6.5;
  };

  const drawSplitRow = (left: string, right: string | undefined, isBoldLeft: boolean, colorL: string, colorR: string, sizeL: number, sizeR: number) => {
    if (isBoldLeft) doc.setFont("Roboto", "bold");
    else doc.setFont("Roboto", "normal");
    
    doc.setFontSize(sizeL);
    doc.setTextColor(colorL);
    
    doc.text(left, marginX, yPosition);
    
    if (right) {
      doc.setFont("Roboto", "normal");
      doc.setFontSize(sizeR);
      doc.setTextColor(colorR);
      const rightWidth = doc.getTextWidth(right);
      doc.text(right, pageWidth - marginX - rightWidth, yPosition);
    }
  };

  // ==========================================
  // 2. SUMMARY
  // ==========================================
  if (cv.summary) {
    const startY = yPosition;
    drawSectionTitle(L.professionalSummary);
    
    doc.setFont("Roboto", "normal");
    doc.setFontSize(FONTS.body);
    doc.setTextColor(COLORS.bullet);
    
    const summaryLines = getLines(cv.summary, contentWidth);
    summaryLines.forEach((line) => {
      checkPageBreak(5.5);
      doc.text(line, marginX, yPosition);
      yPosition += 5.5; 
    });
    
    yPosition += 6;
    if (highlightSection === "summary") drawHighlightBorder(startY, yPosition);
  }

  // ==========================================
  // 3. EXPERIENCE
  // ==========================================
  const validExperience = cv.experience.filter(e => e.title?.trim() !== "" || e.company?.trim() !== "");
  const sortedExperience = [...validExperience].sort((a, b) => {
    const dateA = a.endDate ? a.endDate : a.startDate;
    const dateB = b.endDate ? b.endDate : b.startDate;
    return parseDateForSort(dateB) - parseDateForSort(dateA);
  });

  if (sortedExperience.length > 0) {
    const startY = yPosition;
    drawSectionTitle(L.professionalExperience);

    sortedExperience.forEach((exp) => {
      checkPageBreak(12);
      
      // Don't duplicate date if start and end are the same month
      const dateText = exp.startDate === exp.endDate
        ? exp.startDate
        : [exp.startDate, exp.endDate || (exp.startDate ? 'Present' : '')].filter(Boolean).join(' — ');
      drawSplitRow(exp.title, dateText, true, '#000000', COLORS.light, FONTS.title, FONTS.date);
      yPosition += 5.5;
      
      let companyLoc = exp.company || "";
      if (exp.location) companyLoc += ` • ${exp.location}`;
      doc.setFont("Roboto", "bold"); 
      doc.setFontSize(FONTS.subtitle);
      doc.setTextColor(COLORS.secondary);
      doc.text(companyLoc, marginX, yPosition);
      yPosition += 6.5;

      doc.setFont("Roboto", "normal");
      doc.setFontSize(FONTS.body);
      doc.setTextColor(COLORS.bullet);

      exp.bullets.forEach((bullet) => {
        checkPageBreak(7);
        doc.text("•", marginX + 3, yPosition);

        const bulletLines = getLines(bullet.trim(), contentWidth - 8);
        bulletLines.forEach((line, lineIndex) => {
          if (lineIndex > 0) {
            checkPageBreak(5);
            yPosition += 5;
          }
          doc.text(line, marginX + 8, yPosition);
        });
        yPosition += 6;
      });
      
      yPosition += 8;
    });
    
    if (highlightSection === "experience") drawHighlightBorder(startY, yPosition);
  }

  // ==========================================
  // 4. EDUCATION
  // ==========================================
  const validEducation = cv.education.filter(e => e.institution?.trim() !== "");
  const sortedEducation = [...validEducation].sort((a, b) => {
    return parseDateForSort(b.graduationDate) - parseDateForSort(a.graduationDate);
  });

  if (sortedEducation.length > 0) {
    const startY = yPosition;
    drawSectionTitle(L.education);

    sortedEducation.forEach((edu) => {
      checkPageBreak(10);
      let degreeLine = edu.degree || "";
      if (edu.fieldOfStudy) degreeLine += ` in ${edu.fieldOfStudy}`;

      drawSplitRow(degreeLine, edu.graduationDate || undefined, true, '#000000', COLORS.light, FONTS.title, FONTS.date);
      yPosition += 5.5;

      const institutionLine = [edu.institution, edu.location].filter(Boolean).join(', ');
      drawSplitRow(institutionLine, undefined, false, COLORS.secondary, COLORS.light, FONTS.subtitle, FONTS.date);
      yPosition += 8;
    });
    
    if (highlightSection === "education") drawHighlightBorder(startY, yPosition);
  }

  // ==========================================
  // 5. CERTIFICATIONS
  // ==========================================
  const validCerts = (cv.certifications || []).filter(c => c.name?.trim() !== "");
  if (validCerts.length > 0) {
    const startY = yPosition;
    drawSectionTitle(L.certifications);

    validCerts.forEach((cert) => {
      checkPageBreak(10);
      drawSplitRow(cert.name, cert.date || undefined, true, '#000000', COLORS.light, FONTS.title, FONTS.date);
      yPosition += 5.5;
      
      const issuerLine = [cert.issuer, cert.credentialId ? `ID: ${cert.credentialId}` : ''].filter(Boolean).join(' • ');
      if (issuerLine) {
        doc.setFont("Roboto", "normal");
        doc.setFontSize(FONTS.subtitle);
        doc.setTextColor(COLORS.secondary);
        doc.text(issuerLine, marginX, yPosition);
        yPosition += 5.5;
      } else {
        yPosition += 2;
      }
      yPosition += 6;
    });
    
    if (highlightSection === "certifications") drawHighlightBorder(startY, yPosition);
  }

  // ==========================================
  // 5b. LEADERSHIP & ACTIVITIES
  // ==========================================
  const validLeadership = (cv.leadership || []).filter(l => l.title?.trim() !== '' || l.organization?.trim() !== '');
  const sortedLeadership = [...validLeadership].sort((a, b) => {
    const dateA = a.endDate ? a.endDate : a.startDate;
    const dateB = b.endDate ? b.endDate : b.startDate;
    return parseDateForSort(dateB) - parseDateForSort(dateA);
  });

  if (sortedLeadership.length > 0) {
    const startY = yPosition;
    drawSectionTitle(L.leadership);

    sortedLeadership.forEach((role) => {
      checkPageBreak(12);

      const dateText = role.startDate === role.endDate
        ? role.startDate
        : [role.startDate, role.endDate || (role.startDate ? 'Present' : '')].filter(Boolean).join(' — ');
      drawSplitRow(role.title, dateText, true, '#000000', COLORS.light, FONTS.title, FONTS.date);
      yPosition += 5.5;

      let orgLoc = role.organization || '';
      if (role.location) orgLoc += ` • ${role.location}`;
      doc.setFont('Roboto', 'bold');
      doc.setFontSize(FONTS.subtitle);
      doc.setTextColor(COLORS.secondary);
      doc.text(orgLoc, marginX, yPosition);
      yPosition += 6.5;

      if (role.bullets && role.bullets.length > 0) {
        doc.setFont('Roboto', 'normal');
        doc.setFontSize(FONTS.body);
        doc.setTextColor(COLORS.bullet);

        role.bullets.forEach((bullet) => {
          checkPageBreak(7);
          doc.text('•', marginX + 3, yPosition);
          const bulletLines = getLines(bullet.trim(), contentWidth - 8);
          bulletLines.forEach((line, lineIndex) => {
            if (lineIndex > 0) { checkPageBreak(5); yPosition += 5; }
            doc.text(line, marginX + 8, yPosition);
          });
          yPosition += 6;
        });
      }

      yPosition += 8;
    });

    if (highlightSection === 'leadership') drawHighlightBorder(startY, yPosition);
  }

  // ==========================================
  // 6. SKILLS
  // ==========================================
  if (cv.skills.technical.length > 0) {
    const startY = yPosition;
    drawSectionTitle(L.skills);

    doc.setFont("Roboto", "normal");
    doc.setFontSize(FONTS.body);
    doc.setTextColor(COLORS.bullet);

    const skillsText = cv.skills.technical.join(' • ');
    const skillsLines = getLines(skillsText, contentWidth);
    skillsLines.forEach((line) => {
      checkPageBreak(5.5);
      doc.text(line, marginX, yPosition);
      yPosition += 5.5;
    });
    
    if (highlightSection === "skills") drawHighlightBorder(startY, yPosition);
  }

  // ==========================================
  // 7. LANGUAGES
  // ==========================================
  const validLanguages = (cv.languages || []).filter(l => l.language?.trim() !== '');
  if (validLanguages.length > 0) {
    const startY = yPosition;
    drawSectionTitle(L.languages);

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(FONTS.body);
    doc.setTextColor(COLORS.bullet);

    const langText = validLanguages
      .map(l => l.proficiency ? `${l.language} (${l.proficiency})` : l.language)
      .join(' • ');
    const langLines = getLines(langText, contentWidth);
    langLines.forEach((line) => {
      checkPageBreak(5.5);
      doc.text(line, marginX, yPosition);
      yPosition += 5.5;
    });

    if (highlightSection === 'languages') drawHighlightBorder(startY, yPosition);
  }

  return doc;
}

async function convertToJPEG(dataUrl: string): Promise<string> {
  if (dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg")) {
    return dataUrl;
  }

  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(dataUrl);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };
      img.onerror = () => reject(new Error("Failed to load image for conversion"));
      img.src = dataUrl;
    });
  }
  return dataUrl;
}
