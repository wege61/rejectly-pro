import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import mammoth from 'mammoth';
import PDFParser from 'pdf2json';

// Sanitize text to remove problematic Unicode escape sequences
function sanitizeText(text: string): string {
  try {
    let cleaned = text;

    // Remove literal \uXXXX escape sequences that are in the string as text
    cleaned = cleaned.replace(/\\u[0-9a-fA-F]{4}/g, '');

    // Remove literal \xXX escape sequences
    cleaned = cleaned.replace(/\\x[0-9a-fA-F]{2}/g, '');

    // Remove null bytes and control characters
    cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    // Replace invalid Unicode surrogates
    cleaned = cleaned.replace(/[\uD800-\uDFFF]/g, '');

    // Remove zero-width characters
    cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');

    // Normalize Unicode to NFC form
    cleaned = cleaned.normalize('NFC');

    // Replace multiple spaces/newlines with single space
    cleaned = cleaned.replace(/\s+/g, ' ');

    // Remove any remaining backslash-escaped characters
    cleaned = cleaned.replace(/\\[^\\]/g, '');

    return cleaned.trim();
  } catch (error) {
    console.warn('Text sanitization error:', error);
    // Aggressive fallback: keep only safe ASCII and basic Latin characters
    return text
      .replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

async function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataError', (errData: any) => {
      console.error('PDF parse error:', errData);
      reject(new Error(`Failed to parse PDF: ${errData.parserError || 'Unknown error'}`));
    });

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        // Extract text from all pages
        let fullText = '';

        if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
          pdfData.Pages.forEach((page: any) => {
            if (page.Texts && Array.isArray(page.Texts)) {
              page.Texts.forEach((text: any) => {
                if (text.R && Array.isArray(text.R)) {
                  text.R.forEach((r: any) => {
                    if (r.T) {
                      try {
                        // Decode URI component with error handling
                        const decoded = decodeURIComponent(r.T);
                        fullText += sanitizeText(decoded) + ' ';
                      } catch (e) {
                        // If decoding fails, use the raw text
                        console.warn('Failed to decode text, using raw:', r.T);
                        fullText += r.T + ' ';
                      }
                    }
                  });
                }
              });
            }
            fullText += '\n';
          });
        }

        const cleanText = sanitizeText(fullText);

        if (!cleanText) {
          reject(new Error('No text content found in PDF'));
          return;
        }

        console.log('✅ PDF parsed successfully:', {
          pages: pdfData.Pages?.length || 0,
          textLength: cleanText.length,
        });

        resolve(cleanText);
      } catch (error: any) {
        reject(new Error(`Error processing PDF data: ${error.message}`));
      }
    });

    // Parse the buffer
    pdfParser.parseBuffer(buffer);
  });
}

async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });

    if (!result || !result.value) {
      throw new Error('No text content found in DOCX');
    }

    return sanitizeText(result.value);
  } catch (error: any) {
    console.error('DOCX parsing error:', error);
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('📄 File received:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF and DOCX files are allowed' },
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('✅ Buffer created, size:', buffer.length);

    // Parse document based on type
    let text: string;
    const parseStartTime = Date.now();
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📖 Parsing PDF...');
        text = await parsePDF(buffer);
        console.log(`✅ PDF parsed in ${Date.now() - parseStartTime}ms, text length: ${text.length}`);
      } else {
        console.log('📖 Parsing DOCX...');
        text = await parseDOCX(buffer);
        console.log(`✅ DOCX parsed in ${Date.now() - parseStartTime}ms, text length: ${text.length}`);
      }
    } catch (parseError: any) {
      console.error('❌ Parse error:', parseError);
      return NextResponse.json(
        { error: parseError.message || 'Failed to parse document' },
        { status: 400 }
      );
    }

    // Validate extracted text
    if (!text || text.length < 100) {
      console.log('⚠️ Text too short:', text.length);
      return NextResponse.json(
        { 
          error: `Document appears to be empty or too short. Extracted ${text?.length || 0} characters (minimum 100 required).`
        },
        { status: 400 }
      );
    }

    console.log('📤 Uploading to Supabase Storage...');

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cv-files')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      );
    }

    console.log('✅ File uploaded to storage');

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('cv-files')
      .getPublicUrl(uploadData.path);

    console.log('💾 Saving to database...');

    // Final sanitization before database insert
    const sanitizedText = sanitizeText(text);

    // Save to database
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        type: 'cv',
        title: file.name,
        text: sanitizedText,
        file_url: publicUrl,
        lang: 'en',
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Document saved successfully, ID:', document.id);

    return NextResponse.json({
      success: true,
      document,
    });

  } catch (error: any) {
    console.error('❌ Upload CV error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}