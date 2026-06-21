import { detectLocale } from './src/lib/languageUtils.ts';

const text = "Especialista en preparación de servicios con experiencia, centrado en proporcionar un servicio VIP de alta calidad. Optimicé los procesos de servicio para minimizar los tiempos de espera y garantizar una experiencia del cliente fluida.";

console.log('Language detected:', detectLocale(text));
