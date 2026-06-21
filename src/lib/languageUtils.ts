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

  // Turkish
  scores.tr += (text.match(/[şğşıŞĞ]/g) || []).length * 2;
  scores.tr += (text.match(/\b(ve|ile|için|olan|olarak|bir|bu|iletişim|geliştirme)\b/gi) || []).length;
  
  // German
  scores.de += (text.match(/[ßäÄ]/g) || []).length * 2;
  scores.de += (text.match(/\b(und|mit|für|bei|das|ein|sind|der|die|ist|werden|oder)\b/gi) || []).length;
  
  // French
  scores.fr += (text.match(/[œæàâêîôùû]/g) || []).length * 2;
  scores.fr += (text.match(/\b(et|avec|pour|dans|les|des|une|est|sur|qui|que)\b/gi) || []).length;
  
  // Spanish
  scores.es += (text.match(/[ñ¿¡]/g) || []).length * 4;
  scores.es += (text.match(/\b(y|con|para|por|los|las|una|el|del|como|más|la|que|en|de)\b/gi) || []).length;

  // Italian
  scores.it += (text.match(/\b(e|con|per|in|il|la|di|che|un|una|essere|sono|del)\b/gi) || []).length;
  
  // Portuguese
  scores.pt += (text.match(/[ãõçÃÕÇ]/g) || []).length * 4;
  scores.pt += (text.match(/\b(e|com|para|em|os|as|um|uma|do|da|que|não)\b/gi) || []).length;

  // Dutch
  scores.nl += (text.match(/\b(en|met|voor|in|de|het|een|is|van|op|te|zijn|wij|ik)\b/gi) || []).length;

  // Russian (Cyrillic characters)
  scores.ru += (text.match(/[а-яА-Я]/g) || []).length * 3;


  // Hungarian
  scores.hu += (text.match(/[őűŐŰ]/g) || []).length * 3;
  scores.hu += (text.match(/\b(és|hogy|nem|egy|van|az|meg)\b/gi) || []).length;

  // Serbian (Cyrillic + Latin specifics)
  scores.sr += (text.match(/[đžćčšĐŽĆČŠђјљњћџЂЈЉЊЋЏ]/g) || []).length * 2;
  scores.sr += (text.match(/\b(za|od|do|kao|ili|ako)\b/gi) || []).length;

  // Romanian
  scores.ro += (text.match(/[ăâîșțĂÂÎȘȚ]/g) || []).length * 3;
  scores.ro += (text.match(/\b(și|în|din|la|un|cu|pe|să|pentru|este)\b/gi) || []).length;
  
  // English
  scores.en += (text.match(/\b(and|with|for|the|that|this|are|is|to|of|in|a)\b/gi) || []).length;

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
