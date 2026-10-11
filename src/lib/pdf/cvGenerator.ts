import { jsPDF } from "jspdf";
import { GeneratedCV } from "@/types/cv";
import { loadFontsToDocument } from "./fontLoader";
import { COLOR_TEMPLATES } from "./colorTemplates";
import { detectLocale, CV_HEADINGS, PRESENT_MAP } from "@/lib/languageUtils";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const color = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
  return [(color >> 16) & 255, (color >> 8) & 255, color & 255];
}

export interface CVPDFOptions {
  colorTemplate?: string;
  photoBase64?: string;
}

const PRESENT_WORDS = ['present', 'devam', 'halen', 'günümüz', ...Object.values(PRESENT_MAP).map(p => p.toLowerCase())];

const parseDateForSort = (dateStr?: string | null) => {
  if (!dateStr || dateStr.trim() === '') return 0;
  const lower = dateStr.toLowerCase();
  if (PRESENT_WORDS.some(word => lower.includes(word))) {
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

/** "Start — End", or whichever side exists. A missing end date is shown as missing, never as "Present". */
const formatDateRange = (start?: string | null, end?: string | null) => {
  const s = start?.trim();
  const e = end?.trim();
  if (s && e) return s === e ? s : `${s} — ${e}`;
  return s || e || '';
};

const getColorTemplateHex = (templateName?: string): string | null => {
  if (!templateName) return null;
  const template = COLOR_TEMPLATES.find(t => t.key === templateName);
  return template ? template.colors.primary : null;
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
  const marginY = 16;
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

  const SPACING = {
    line: 4.4,       // between wrapped lines of the same paragraph/bullet
    bullet: 5.2,     // from one bullet to the next
    entryGap: 3.5,   // after each job/project/degree
    row: 4.8,        // after a title row or subtitle row
  };

  const COLORS = {
    theme: themeColor,
    main: '#1a1a1a',
    secondary: '#444444',
    light: '#666666',
    bullet: '#333333',
    contact: '#555555'
  };

  const experience = cv.experience || [];
  const allText = [
    cv.summary,
    ...experience.map(e => `${e.title} ${(e.bullets || []).join(" ")}`)
  ].join(" ");
  // Older CVs don't record their language, so fall back to detecting it.
  const lang = cv.language && CV_HEADINGS[cv.language] ? cv.language : detectLocale(allText);
  const L = { ...CV_HEADINGS['en'], ...(CV_HEADINGS[lang] || {}) };

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
    yPosition += 8;
    doc.text(cv.contact.name, marginX, yPosition);
    yPosition += 7;
  }

  doc.setFont("Roboto", "normal");
  doc.setFontSize(FONTS.date);
  doc.setTextColor(COLORS.contact);
  const contactItems = [
    cv.contact.email,
    cv.contact.phone,
    cv.contact.location,
    cv.contact.linkedin?.replace(/^https?:\/\//, ''),
    cv.contact.portfolio?.replace(/^https?:\/\//, ''),
  ].filter(Boolean) as string[];

  const contactLines = getLines(contactItems.join("  •  "), textMaxWidth);
  contactLines.forEach(line => {
    doc.text(line, marginX, yPosition);
    yPosition += 5;
  });

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
  yPosition += 3;
  doc.setDrawColor(COLORS.theme);
  doc.setLineWidth(0.5);
  doc.line(marginX, yPosition, pageWidth - marginX, yPosition);
  yPosition += 4;

  /**
   * `firstBlockMM` is the height of whatever must sit directly under the title
   * (the first entry, or the whole section if it's short), so a title never
   * ends up alone at the bottom of a page.
   */
  const drawSectionTitle = (title: string, firstBlockMM: number) => {
    checkPageBreak(13 + firstBlockMM);
    doc.setFont("Roboto", "bold");
    doc.setFontSize(FONTS.section);
    doc.setTextColor(COLORS.theme);

    // Visual letter-spacing via the PDF char-space operator. Inserting spacer
    // characters instead makes ATS parsers read headings as "S U M M A R Y".
    yPosition += 5;
    doc.setCharSpace(0.35);
    doc.text(title.toLocaleUpperCase(lang), marginX, yPosition);
    doc.setCharSpace(0);
    yPosition += 2.5;

    const [r, g, b] = hexToRgb(COLORS.theme);
    doc.setDrawColor(
      Math.round(r * 0.25 + 255 * 0.75),
      Math.round(g * 0.25 + 255 * 0.75),
      Math.round(b * 0.25 + 255 * 0.75)
    );
    doc.setLineWidth(0.2);
    doc.line(marginX, yPosition, pageWidth - marginX, yPosition);

    yPosition += 5;
  };

  const drawSplitRow = (left: string, right: string | undefined, isBoldLeft: boolean, colorL: string, colorR: string, sizeL: number, sizeR: number) => {
    doc.setFont("Roboto", "normal");
    doc.setFontSize(sizeR);
    const rightWidth = right ? doc.getTextWidth(right) : 0;

    doc.setFont("Roboto", isBoldLeft ? "bold" : "normal");
    doc.setFontSize(sizeL);
    doc.setTextColor(colorL);
    // Keep long titles clear of the right-aligned date.
    const leftMax = contentWidth - (rightWidth ? rightWidth + 4 : 0);
    const leftLines = getLines(left, leftMax);
    leftLines.forEach((line, i) => {
      if (i > 0) yPosition += SPACING.line;
      doc.text(line, marginX, yPosition);
    });

    if (right) {
      doc.setFont("Roboto", "normal");
      doc.setFontSize(sizeR);
      doc.setTextColor(colorR);
      doc.text(right, pageWidth - marginX - rightWidth, yPosition - (leftLines.length - 1) * SPACING.line);
    }
  };

  const bodyLines = (text: string, width: number) => {
    doc.setFont("Roboto", "normal");
    doc.setFontSize(FONTS.body);
    return getLines(text, width);
  };

  const bulletHeight = (bullet: string) =>
    (bodyLines(bullet.trim(), contentWidth - 8).length - 1) * SPACING.line + SPACING.bullet;

  const drawBullets = (bullets: string[] | undefined) => {
    if (!bullets?.length) return;
    doc.setFont("Roboto", "normal");
    doc.setFontSize(FONTS.body);
    doc.setTextColor(COLORS.bullet);

    bullets.forEach((bullet) => {
      // Keep each bullet on one page.
      checkPageBreak(bulletHeight(bullet));
      doc.text("•", marginX + 3, yPosition);
      getLines(bullet.trim(), contentWidth - 8).forEach((line, lineIndex) => {
        if (lineIndex > 0) yPosition += SPACING.line;
        doc.text(line, marginX + 8, yPosition);
      });
      yPosition += SPACING.bullet;
    });
  };

  /** Title row + subtitle row + first bullet: the minimum to keep together. */
  const entryHeadHeight = (bullets?: string[]) =>
    SPACING.row * 2 + (bullets?.length ? bulletHeight(bullets[0]) : 0);

  // A one-line paragraph (skills, languages) never needs more than a few lines.
  const paragraphHeight = (text: string) => bodyLines(text, contentWidth).length * 5;

  // ==========================================
  // 2. SUMMARY
  // ==========================================
  if (cv.summary) {
    const startY = yPosition;
    // Line breaks depend on the font size, so measure with the body font.
    doc.setFont("Roboto", "normal");
    doc.setFontSize(FONTS.body);
    const summaryLines = getLines(cv.summary, contentWidth);
    drawSectionTitle(L.summary, Math.min(summaryLines.length, 3) * 5);

    doc.setFont("Roboto", "normal");
    doc.setFontSize(FONTS.body);
    doc.setTextColor(COLORS.bullet);

    summaryLines.forEach((line) => {
      checkPageBreak(5);
      doc.text(line, marginX, yPosition);
      yPosition += 5;
    });

    yPosition += 1;
    if (highlightSection === "summary") drawHighlightBorder(startY, yPosition);
  }

  // ==========================================
  // 3. EXPERIENCE & PROJECTS
  // ==========================================
  const validExperience = experience.filter(e => e.title?.trim() || e.company?.trim());
  const validProjects = (cv.projects || []).filter(p => p.name?.trim());
  // Experienced candidates' projects are listed under the experience heading;
  // for entry-level candidates projects get their own section.
  const projectsUnderExperience = !cv.isEntryLevel && validExperience.length > 0 && validProjects.length > 0;

  const renderExperienceSection = () => {
    const sortedExperience = [...validExperience].sort((a, b) => {
      const dateA = a.endDate ? a.endDate : a.startDate;
      const dateB = b.endDate ? b.endDate : b.startDate;
      return parseDateForSort(dateB) - parseDateForSort(dateA);
    });

    if (sortedExperience.length === 0) return;

    const startY = yPosition;
    drawSectionTitle(projectsUnderExperience ? L.experience : L.experience_only, entryHeadHeight(sortedExperience[0].bullets));

    sortedExperience.forEach((exp) => {
      checkPageBreak(entryHeadHeight(exp.bullets));

      drawSplitRow(exp.title, formatDateRange(exp.startDate, exp.endDate), true, '#000000', COLORS.light, FONTS.title, FONTS.date);
      yPosition += SPACING.row;

      const companyLoc = [exp.company, exp.location].filter(Boolean).join(" • ");
      if (companyLoc) {
        doc.setFont("Roboto", "bold");
        doc.setFontSize(FONTS.subtitle);
        doc.setTextColor(COLORS.secondary);
        doc.text(companyLoc, marginX, yPosition);
        yPosition += SPACING.row;
      }

      drawBullets(exp.bullets);
      yPosition += SPACING.entryGap;
    });

    if (highlightSection === "experience") drawHighlightBorder(startY, yPosition);
  };

  const renderProjectsSection = () => {
    if (validProjects.length === 0) return;

    const startY = yPosition;
    if (!projectsUnderExperience) {
      drawSectionTitle(L.projects, entryHeadHeight(validProjects[0].bullets));
    }

    validProjects.forEach((proj) => {
      checkPageBreak(entryHeadHeight(proj.bullets));

      drawSplitRow(proj.name, formatDateRange(proj.startDate, proj.endDate), true, '#000000', COLORS.light, FONTS.title, FONTS.date);
      yPosition += SPACING.row;

      const roleLoc = [proj.role, proj.url].filter(Boolean).join(" • ");
      if (roleLoc) {
        doc.setFont("Roboto", "bold");
        doc.setFontSize(FONTS.subtitle);
        doc.setTextColor(COLORS.secondary);
        doc.text(roleLoc, marginX, yPosition);
        yPosition += SPACING.row;
      }

      drawBullets(proj.bullets);
      yPosition += SPACING.entryGap;
    });

    if (highlightSection === "experience" && validExperience.length === 0) {
      drawHighlightBorder(startY, yPosition);
    }
  };

  // ==========================================
  // 4. EDUCATION
  // ==========================================
  const renderEducationSection = () => {
    const validEducation = (cv.education || []).filter(e => e.institution?.trim() || e.degree?.trim());
    const sortedEducation = [...validEducation].sort((a, b) => {
      return parseDateForSort(b.graduationDate) - parseDateForSort(a.graduationDate);
    });
    if (sortedEducation.length === 0) return;

    const startY = yPosition;
    drawSectionTitle(L.education, SPACING.row * 2);

    sortedEducation.forEach((edu) => {
      checkPageBreak(SPACING.row * 2 + (edu.details ? SPACING.line : 0));
      const degreeLine = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ");

      drawSplitRow(degreeLine, edu.graduationDate || undefined, true, '#000000', COLORS.light, FONTS.title, FONTS.date);
      yPosition += SPACING.row;

      const institutionLine = [edu.institution, edu.location].filter(Boolean).join(', ');
      if (institutionLine) {
        drawSplitRow(institutionLine, undefined, false, COLORS.secondary, COLORS.light, FONTS.subtitle, FONTS.date);
        yPosition += SPACING.row;
      }

      if (edu.details) {
        doc.setFont('Roboto', 'normal');
        doc.setFontSize(FONTS.body - 0.5);
        doc.setTextColor(COLORS.secondary);
        getLines(edu.details, contentWidth).forEach(line => {
          checkPageBreak(SPACING.line);
          doc.text(line, marginX, yPosition);
          yPosition += SPACING.line;
        });
      }
      yPosition += SPACING.entryGap - 1;
    });

    if (highlightSection === "education") drawHighlightBorder(startY, yPosition);
  };

  // ==========================================
  // 5. CERTIFICATIONS
  // ==========================================
  const renderCertificationsSection = () => {
    const validCerts = (cv.certifications || []).filter(c => c.name?.trim());
    if (validCerts.length === 0) return;

    const startY = yPosition;
    drawSectionTitle(L.certifications, 9);

    validCerts.forEach((cert) => {
      checkPageBreak(9);
      drawSplitRow(cert.name, cert.date || undefined, true, '#000000', COLORS.light, FONTS.title, FONTS.date);
      yPosition += 4;

      const issuerLine = [cert.issuer, cert.credentialId ? `ID: ${cert.credentialId}` : ''].filter(Boolean).join(' • ');
      if (issuerLine) {
        doc.setFont("Roboto", "normal");
        doc.setFontSize(FONTS.subtitle);
        doc.setTextColor(COLORS.secondary);
        doc.text(issuerLine, marginX, yPosition);
        yPosition += 4;
      }
      yPosition += 2;
    });

    if (highlightSection === "certifications") drawHighlightBorder(startY, yPosition);
  };

  // ==========================================
  // 6. LEADERSHIP & ACTIVITIES
  // ==========================================
  const renderLeadershipSection = () => {
    const validLeadership = (cv.leadership || []).filter(l => l.title?.trim() || l.organization?.trim());
    const sortedLeadership = [...validLeadership].sort((a, b) => {
      const dateA = a.endDate ? a.endDate : a.startDate;
      const dateB = b.endDate ? b.endDate : b.startDate;
      return parseDateForSort(dateB) - parseDateForSort(dateA);
    });
    if (sortedLeadership.length === 0) return;

    const startY = yPosition;
    drawSectionTitle(L.leadership, entryHeadHeight(sortedLeadership[0].bullets));

    sortedLeadership.forEach((role) => {
      checkPageBreak(entryHeadHeight(role.bullets));

      drawSplitRow(role.title, formatDateRange(role.startDate, role.endDate), true, '#000000', COLORS.light, FONTS.title, FONTS.date);
      yPosition += SPACING.row;

      const orgLoc = [role.organization, role.location].filter(Boolean).join(' • ');
      if (orgLoc) {
        doc.setFont('Roboto', 'bold');
        doc.setFontSize(FONTS.subtitle);
        doc.setTextColor(COLORS.secondary);
        doc.text(orgLoc, marginX, yPosition);
        yPosition += SPACING.row;
      }

      drawBullets(role.bullets);
      yPosition += SPACING.entryGap;
    });

    if (highlightSection === 'leadership') drawHighlightBorder(startY, yPosition);
  };

  // ==========================================
  // 7. SKILLS & LANGUAGES
  // ==========================================
  const drawParagraph = (text: string) => {
    doc.setFont("Roboto", "normal");
    doc.setFontSize(FONTS.body);
    doc.setTextColor(COLORS.bullet);
    getLines(text, contentWidth).forEach((line) => {
      checkPageBreak(5);
      doc.text(line, marginX, yPosition);
      yPosition += 5;
    });
  };

  const renderSkillsSection = () => {
    const skills = cv.skills?.technical || [];
    if (skills.length === 0) return;
    const startY = yPosition;
    const skillsText = skills.join('  •  ');
    drawSectionTitle(L.skills, paragraphHeight(skillsText));
    drawParagraph(skillsText);
    if (highlightSection === "skills") drawHighlightBorder(startY, yPosition);
  };

  const renderLanguagesSection = () => {
    const validLanguages = (cv.languages || []).filter(l => l.language?.trim());
    if (validLanguages.length === 0) return;
    const startY = yPosition;
    const langText = validLanguages
      .map(l => l.proficiency ? `${l.language} (${l.proficiency})` : l.language)
      .join('  •  ');
    drawSectionTitle(L.languages, paragraphHeight(langText));
    drawParagraph(langText);
    if (highlightSection === 'languages') drawHighlightBorder(startY, yPosition);
  };

  // Entry-level candidates lead with education and projects; experienced
  // candidates lead with their work history.
  const sections = cv.isEntryLevel
    ? [renderEducationSection, renderProjectsSection, renderExperienceSection, renderLeadershipSection, renderCertificationsSection, renderSkillsSection, renderLanguagesSection]
    : [renderExperienceSection, renderProjectsSection, renderEducationSection, renderCertificationsSection, renderLeadershipSection, renderSkillsSection, renderLanguagesSection];
  sections.forEach(render => render());

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
