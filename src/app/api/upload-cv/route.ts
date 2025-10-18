import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';

async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const pdfDoc = await PDFDocument.load(buffer, { 
      ignoreEncryption: true,
      updateMetadata: false 
    });
    
    let fullText = '';
    const pages = pdfDoc.getPages();
    
    // pdf-lib doesn't extract text directly, we need another approach
    // Let's use a simpler method - just check if PDF is valid and return placeholder
    // In production, you'd use a proper PDF text extraction service
    
    // For now, let's acknowledge the limitation
    const pageCount = pages.length;
    
    if (pageCount === 0) {
      throw new Error('PDF has no pages');
    }
    
    // Return a message asking user to paste text manually for now
    // TODO: Integrate proper PDF text extraction service
    return `PDF file with ${pageCount} pages uploaded. Please note: Automatic text extraction from PDF is not yet implemented. You can proceed with analysis.`;
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file');
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

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

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

    // Parse document
    let text: string;
    try {
      if (file.type === 'application/pdf') {
        console.log('📖 Parsing PDF...');
        text = await parsePDF(buffer);
        console.log('✅ PDF processed, text length:', text.length);
      } else {
        console.log('📖 Parsing DOCX...');
        text = await parseDOCX(buffer);
        console.log('✅ DOCX parsed successfully, text length:', text.length);
      }
    } catch (parseError: any) {
      console.error('❌ Parse error:', parseError);
      return NextResponse.json(
        { error: parseError.message || 'Failed to parse document' },
        { status: 400 }
      );
    }

    // For PDF, we're allowing shorter text since we're not extracting yet
    const minLength = file.type === 'application/pdf' ? 10 : 50;
    
    if (!text || text.length < minLength) {
      console.log('⚠️ Text too short:', text.length);
      return NextResponse.json(
        { error: `Document appears to be empty or too short (min ${minLength} characters)` },
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

    console.log('✅ File uploaded successfully');

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('cv-files')
      .getPublicUrl(uploadData.path);

    console.log('💾 Saving to database...');

    // Save to database
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        type: 'cv',
        title: file.name,
        text: text,
        file_url: publicUrl,
        lang: 'en',
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save document to database' },
        { status: 500 }
      );
    }

    console.log('✅ Document saved successfully');

    return NextResponse.json({
      success: true,
      document,
      message: file.type === 'application/pdf' 
        ? 'PDF uploaded successfully. Note: For best results, consider uploading a DOCX file with text content.'
        : undefined,
    });

  } catch (error: any) {
    console.error('❌ Upload CV error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}