export interface ColorTemplateColors {
  primary: string;
  text: string;
  textLight: string;
  border: string;
  highlight: string;
  highlightBg: string;
}

export interface ColorTemplate {
  key: string;
  name: string;
  description: string;
  colors: ColorTemplateColors;
}

export interface CVCustomizationOptions {
  photoUrl?: string | null;
  photoBase64?: string | null;
  colorTemplateKey?: string;
  userProvidedMetrics?: Record<string, string>;
}
