import { GeneratedCVData } from "@/lib/ats/utils";
import { EN_MONTHS, PRESENT_MAP } from "@/lib/languageUtils";

// ---------------------------------------------------------------------------
// Locale-aware date post-processor
// Uses Intl.DateTimeFormat so it works for ANY language, not just Turkish.
// ---------------------------------------------------------------------------


/** Build a map of English month name → localized month name for the given locale. */
function buildMonthMap(locale: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (let m = 0; m < 12; m++) {
    const date = new Date(2024, m, 1);
    const localized = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
    // Capitalize first letter
    const capitalized = localized.charAt(0).toUpperCase() + localized.slice(1);
    map[EN_MONTHS[m]] = capitalized;
  }
  return map;
}

/** Replace English dates in a single string with localized dates. */
function localizeDateString(str: string, monthMap: Record<string, string>, presentText: string): string {
  let result = str;
  // Only match English month names followed by a space+year (e.g. "May 2025")
  // This prevents matching "May" inside already-localized "Mayıs"
  for (const [en, localized] of Object.entries(monthMap)) {
    result = result.replace(new RegExp(`${en}(\\s+\\d{4})`, 'g'), `${localized}$1`);
    // Also handle month at end of string (rare, but possible)
    result = result.replace(new RegExp(`${en}$`, 'g'), localized);
  }
  // "Present" → localized (whole word only)
  result = result.replace(/\bPresent\b/g, presentText);
  return result;
}

/** Post-process all date fields in a generated CV to use locale-appropriate month names. */
export function localizeCVDates(cv: GeneratedCVData, locale: string): void {
  if (locale === 'en') return; // No conversion needed

  const monthMap = buildMonthMap(locale);
  const presentText = PRESENT_MAP[locale] || 'Present';

  // Localize experience dates
  if (cv.experience) {
    for (const exp of cv.experience) {
      if (exp.startDate) exp.startDate = localizeDateString(exp.startDate, monthMap, presentText);
      if (exp.endDate) exp.endDate = localizeDateString(exp.endDate, monthMap, presentText);
    }
  }

  // Localize education dates
  if (cv.education) {
    for (const edu of cv.education) {
      if (edu.graduationDate) edu.graduationDate = localizeDateString(edu.graduationDate, monthMap, presentText);
    }
  }

  // Localize certification dates
  if (cv.certifications) {
    for (const cert of cv.certifications) {
      if (cert.date) cert.date = localizeDateString(cert.date, monthMap, presentText);
    }
  }

  // Sort experience in reverse chronological order (most recent first)
  if (cv.experience && cv.experience.length > 1) {
    const monthOrder = EN_MONTHS.reduce((acc, m, i) => { acc[m.toLowerCase()] = i; return acc; }, {} as Record<string, number>);
    // Also add localized month names to the order map
    for (const [en, loc] of Object.entries(monthMap)) {
      monthOrder[loc.toLowerCase()] = monthOrder[en.toLowerCase()];
    }

    const parseDate = (dateStr: string): number => {
      if (!dateStr) return 0;
      // "Present" or localized equivalent = far future
      if (dateStr === 'Present' || dateStr === presentText) return 99999999;
      // Try to parse "Month YYYY" in any language
      const parts = dateStr.trim().split(/\s+/);
      if (parts.length >= 2) {
        const monthIdx = monthOrder[parts[0].toLowerCase()] ?? -1;
        const year = parseInt(parts[parts.length - 1], 10) || 0;
        return year * 100 + monthIdx;
      }
      return 0;
    };

    cv.experience.sort((a, b) => {
      const endA = parseDate(a.endDate || '');
      const endB = parseDate(b.endDate || '');
      if (endA !== endB) return endB - endA; // Most recent end date first
      return parseDate(b.startDate || '') - parseDate(a.startDate || ''); // Tie-break by start date
    });
  }
}
