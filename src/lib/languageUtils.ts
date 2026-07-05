export const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const PRESENT_MAP: Record<string, string> = {
  tr: 'Devam Ediyor',
  de: 'Bis heute',
  fr: "Aujourd'hui",
  es: 'Actualidad',
  it: 'Presente',
  pt: 'Presente',
  nl: 'Heden',
  ru: 'По настоящее время',
  hu: 'Jelen',
  sr: 'Trenutno',
  ro: 'Prezent',
};

export const LOCALE_TO_LANGUAGE: Record<string, string> = {
  'en': 'English', 'tr': 'Turkish', 'de': 'German', 'fr': 'French', 'es': 'Spanish',
  'it': 'Italian', 'pt': 'Portuguese', 'nl': 'Dutch', 'ru': 'Russian',
  'hu': 'Hungarian', 'sr': 'Serbian', 'ro': 'Romanian'
};

export const SUPPORTED_LANGUAGES = Object.entries(LOCALE_TO_LANGUAGE).map(([code, name]) => ({ code, name }));

export const CV_HEADINGS: Record<string, Record<string, string>> = {
  en: {
    summary: "Summary",
    experience: "Experience & Projects",
    education: "Education",
    certifications: "Certifications & Courses",
    leadership: "Leadership & Activities",
    skills: "Skills",
    languages: "Languages"
  },
  ru: {
    summary: "Резюме",
    experience: "Опыт работы и проекты",
    education: "Образование",
    certifications: "Сертификаты и курсы",
    leadership: "Лидерство и мероприятия",
    skills: "Навыки",
    languages: "Языки"
  },
  tr: {
    summary: "Özet",
    experience: "Deneyim ve Projeler",
    education: "Eğitim",
    certifications: "Sertifikalar ve Kurslar",
    leadership: "Liderlik ve Etkinlikler",
    skills: "Yetenekler",
    languages: "Diller"
  },
  de: {
    summary: "Zusammenfassung",
    experience: "Berufserfahrung & Projekte",
    education: "Ausbildung",
    certifications: "Zertifizierungen & Kurse",
    leadership: "Führung & Aktivitäten",
    skills: "Fähigkeiten",
    languages: "Sprachen"
  },
  fr: {
    summary: "Résumé",
    experience: "Expérience & Projets",
    education: "Formation",
    certifications: "Certifications & Cours",
    leadership: "Leadership & Activités",
    skills: "Compétences",
    languages: "Langues"
  },
  es: {
    summary: "Resumen",
    experience: "Experiencia y Proyectos",
    education: "Educación",
    certifications: "Certificaciones y Cursos",
    leadership: "Liderazgo y Actividades",
    skills: "Habilidades",
    languages: "Idiomas"
  },
  it: {
    summary: "Riepilogo",
    experience: "Esperienza e Progetti",
    education: "Formazione",
    certifications: "Certificazioni e Corsi",
    leadership: "Leadership e Attività",
    skills: "Competenze",
    languages: "Lingue"
  },
  pt: {
    summary: "Resumo",
    experience: "Experiência e Projetos",
    education: "Formação Acadêmica",
    certifications: "Certificações e Cursos",
    leadership: "Liderança e Atividades",
    skills: "Habilidades",
    languages: "Idiomas"
  },
  nl: {
    summary: "Profiel",
    experience: "Werkervaring & Projecten",
    education: "Opleiding",
    certifications: "Certificaten & Cursussen",
    leadership: "Leiderschap & Activiteiten",
    skills: "Vaardigheden",
    languages: "Talen"
  },

  hu: {
    summary: "Összegzés",
    experience: "Tapasztalat és Projektek",
    education: "Tanulmányok",
    certifications: "Tanúsítványok és Kurzusok",
    leadership: "Vezetés és Tevékenységek",
    skills: "Készségek",
    languages: "Nyelvek"
  },
  sr: {
    summary: "Rezime",
    experience: "Iskustvo i Projekti",
    education: "Obrazovanje",
    certifications: "Sertifikati i Kursevi",
    leadership: "Liderstvo i Aktivnosti",
    skills: "Veštine",
    languages: "Jezici"
  },
  ro: {
    summary: "Rezumat",
    experience: "Experiență și Proiecte",
    education: "Educație",
    certifications: "Certificări și Cursuri",
    leadership: "Leadership și Activități",
    skills: "Abilități",
    languages: "Limbi"
  }
};

/** Detect locale from CV text content. Returns BCP-47 locale string. */
export function detectLocale(text: string): string {
  const scores: Record<string, number> = { tr: 0, de: 0, fr: 0, es: 0, it: 0, pt: 0, nl: 0, ru: 0, hu: 0, sr: 0, ro: 0, en: 0 };
  
  if (!text) return 'en';

  // Turkish — require Turkish-specific characters (ş, ğ, ı, İ) for strong signal
  scores.tr += (text.match(/[şğıŞĞİ]/g) || []).length * 3;
  scores.tr += (text.match(/\b(ve|ile|için|olan|olarak|iletişim|geliştirme|deneyim|yıl|proje)\b/gi) || []).length * 2;
  
  // German — ß, ä, ö, ü are strong signals, plus distinctive German words
  scores.de += (text.match(/[ßäöüÄÖÜ]/g) || []).length * 3;
  scores.de += (text.match(/\b(und|mit|für|bei|das|ein|sind|der|die|ist|werden|oder|auch|nicht|über|nach|kann|diese|haben|einer|einem|eines|sehr|mehr|durch|unter|muss|soll|alle|wenn|aber|noch)\b/gi) || []).length * 2;
  
  // French — é, è, ê, ç, à are very common in French text
  scores.fr += (text.match(/[éèêëçàùûœæ]/gi) || []).length * 3;
  scores.fr += (text.match(/\b(et|avec|pour|dans|les|des|une|est|sur|qui|que|nous|vous|sont|ont|pas|plus|cette|ces|aux|par|ses|leur|comme|être|avoir|tout|faire|aussi|bien|très|mais|chez)\b/gi) || []).length * 2;
  
  // Spanish — ñ, ¿, ¡ are unique, plus common Spanish words
  scores.es += (text.match(/[ñ¿¡áéíóú]/gi) || []).length * 3;
  scores.es += (text.match(/\b(y|con|para|por|los|las|una|del|como|más|que|también|sobre|está|tiene|este|esta|todo|puede|desde|hasta|entre|cada|muy|pero|sin|según|otro|otra|otros)\b/gi) || []).length * 2;

  // Italian — è, à, ò, ù, ì are common Italian accents, plus distinctive words
  scores.it += (text.match(/[èàòùì]/gi) || []).length * 3;
  scores.it += (text.match(/\b(il|la|di|che|un|una|sono|del|della|delle|dei|degli|nel|nella|nelle|nei|negli|anche|come|più|questo|questa|con|per|essere|hanno|tutto|alla|allo|agli|alle|molto|ogni|stato|può|dalle|sulla|sulle)\b/gi) || []).length * 2;
  
  // Portuguese — ã, õ, ç are distinctive Portuguese characters
  scores.pt += (text.match(/[ãõçÃÕÇ]/g) || []).length * 4;
  scores.pt += (text.match(/\b(e|com|para|em|os|as|um|uma|do|da|que|não|também|mais|como|está|este|esta|pode|desde|muito|pelo|pela|pelos|pelas|seu|sua|seus|suas|nos|nas|dos|das)\b/gi) || []).length * 2;

  // Dutch — ij, aa, oo, ee digraphs + distinctive Dutch words not shared with English
  scores.nl += (text.match(/\b(en|met|voor|het|een|van|zijn|wij|zij|ook|niet|maar|dan|naar|deze|die|dat|meer|wordt|worden|heeft|hebben|moet|moeten|over|alle|veel|door|bij|nog|wel|kan|kunnen|tot|uit|hun|onze)\b/gi) || []).length * 2;
  // Dutch-specific digraphs and word patterns
  scores.nl += (text.match(/\b\w*ij\w*\b/gi) || []).length;
  scores.nl += (text.match(/\b(beschikken|ervaring|vaardigheden|ontwikkeling|verantwoordelijk|communicatie|samenwerking)\b/gi) || []).length * 3;

  // Russian (Cyrillic characters)
  scores.ru += (text.match(/[а-яА-Я]/g) || []).length * 3;

  // Hungarian — ő, ű are unique to Hungarian, é, á, ö, ü are common
  scores.hu += (text.match(/[őűŐŰ]/g) || []).length * 5;
  scores.hu += (text.match(/[áéíóöúü]/gi) || []).length;
  scores.hu += (text.match(/\b(és|hogy|nem|egy|van|az|meg|ezt|azt|vagy|mint|csak|már|még|kell|lehet|amely|ami|aki|lesz|volt|lett|között|szerint|után|alatt|felett|mellett|tapasztalat|készség|fejlesztés|kommunikáció)\b/gi) || []).length * 3;

  // Serbian (Cyrillic + Latin specifics)
  scores.sr += (text.match(/[đžćčšĐŽĆČŠђјљњћџЂЈЉЊЋЏ]/g) || []).length * 3;
  scores.sr += (text.match(/\b(za|od|do|kao|ili|ako|ima|koji|koja|koje|nije|biti|sve|ovo|ovaj|može|treba|iskustvo|razvoj|komunikacija)\b/gi) || []).length * 2;

  // Romanian — ă, â, î, ș, ț are unique Romanian characters
  scores.ro += (text.match(/[ăâîșțĂÂÎȘȚ]/g) || []).length * 3;
  scores.ro += (text.match(/\b(și|în|din|la|un|cu|pe|să|pentru|este|sunt|care|mai|dar|sau|acest|această|poate|trebui|experiență|dezvoltare|comunicare|abilități)\b/gi) || []).length * 2;
  
  // English — use distinctive English words that are unlikely in other languages
  scores.en += (text.match(/\b(the|and|with|for|that|this|are|is|to|of|in|have|has|will|you|your|our|team|work|experience|skills|role|about|company|requirements|responsible|management|development|position|should|would|could|been|being|their|they|which|were|what|when|where|while)\b/gi) || []).length;

  // English gets a small base advantage — it's the default language and should only be
  // overridden when there's clear evidence of another language
  scores.en += 3;

  let maxScore = 0;
  let detected = 'en'; // default
  
  for (const [lang, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detected = lang;
    }
  }
  
  return maxScore > 0 ? detected : 'en';
}
