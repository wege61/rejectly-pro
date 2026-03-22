import { generateCVPDF } from './src/lib/pdf/cvGenerator';
import fs from 'fs';
import { GeneratedCV } from './src/types/cv';

async function test() {
  const dummyCV: GeneratedCV = {
    contact: {
      name: 'Oğuzan Zarı',
      email: 'zardao@gmail.xom',
      phone: '+905399402767',
      location: 'Istanbul, Türkiye',
      linkedin: 'linkedin.com/in/oz',
    },
    summary: "Driven recent graduate with a Bachelor's in Business Administration, passionate about transforming retail experiences through innovative merchandising strategies.",
    experience: [
      {
        title: 'Retail Merchandiser',
        company: 'Pull&Bear',
        location: 'Bakırköy, Istanbul',
        startDate: 'May 2023',
        endDate: 'Jun 2023',
        bullets: ['Ensured the organized display of apparel on shelves to enhance visual merchandising and customer engagement.'],
      }
    ],
    education: [
      {
        institution: 'Istanbul Aydin University',
        degree: "Bachelor's",
        fieldOfStudy: 'Business Administration',
        location: 'Istanbul',
        graduationDate: 'Jun 2025'
      }
    ],
    skills: {
      technical: ['Financial Analysis', 'Store Layout Optimization', 'Product Promotion'],
      soft: []
    },
    certifications: [],
    languages: []
  };

  const photoBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";

  const doc = await generateCVPDF(dummyCV, undefined, {
    colorTemplate: 'modern-blue',
    photoBase64: photoBase64
  });
  
  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync('test_output.pdf', buffer);
  console.log('PDF saved to test_output.pdf');
}

test().catch(console.error);
