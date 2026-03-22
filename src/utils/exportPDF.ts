import { GeneratedCV } from '@/types/cv';

export const generatePDF = async (elementId: string, filename: string, cvData?: GeneratedCV): Promise<void> => {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      resolve();
      return;
    }

    // Create a hidden iframe to isolate the print layout from the rest of the Next.js app
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      resolve();
      return;
    }

    // Gather all stylesheets and style tags from the current page to preserve UI styling (e.g., styled-components)
    const styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
    let stylesHtml = '';
    styleElements.forEach(node => {
      stylesHtml += node.outerHTML;
    });

    // Get the element's actual HTML structure as rendered
    const elementHtml = element.outerHTML;

    // Write isolated structure into iframe
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          ${stylesHtml}
          <style>
            /* Reset everything for perfect A4 scaling */
            @page {
              size: A4 portrait;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: white !important;
            }
            /* Target the CV wrapper explicitly to override UI constraints */
            #cv-preview-paper {
              width: 210mm !important;
              min-height: 297mm !important;
              max-width: none !important;
              margin: 0 !important;
              padding: 13mm !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              position: static !important;
              transform: none !important;
            }
          </style>
        </head>
        <body>
          ${elementHtml}
        </body>
      </html>
    `);
    doc.close();

    // Wait for Google Fonts or external resources to be parsed by the iframe's layout engine
    setTimeout(() => {
      if (!iframe.contentWindow) {
        resolve();
        return;
      }
      
      // Hook into print lifecycle to resolve only AFTER dialog is closed
      iframe.contentWindow.onafterprint = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        resolve();
      };
      
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      // Fallback in case onafterprint is blocked by specific browser engines
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
          resolve();
        }
      }, 5000); 
    }, 1000);
  });
};
