import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    const { cvData, filename, id } = await request.json();

    if (!cvData) {
      return NextResponse.json(
        { error: 'CV Data is required' },
        { status: 400 }
      );
    }

    // Save to database
    const stringifiedData = JSON.stringify(cvData);
    
    let dbResult;

    if (id) {
      // Update existing document
      dbResult = await supabase
        .from('documents')
        .update({
          title: filename || 'AI Generated CV',
          text: stringifiedData,
          file_url: 'builder://local',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      // If the row was magically deleted on the dashboard but local storage still remembers it,
      // the update will affect 0 rows. In that case, seamlessly fallback to an insert to save their work!
      if (!dbResult.error && dbResult.data && dbResult.data.length === 0) {
        dbResult = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            type: 'cv', 
            title: filename || 'AI Generated CV',
            text: stringifiedData,
            file_url: 'builder://local',
            lang: 'en',
          })
          .select();
      }
    } else {
      // Insert new document
      dbResult = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          type: 'cv', // Must be 'cv' to pass documents_type_check constraint
          title: filename || 'AI Generated CV',
          text: stringifiedData,
          file_url: 'builder://local', // Use file_url signature to differentiate created resumes
          lang: 'en',
        })
        .select();
    }

    let document = null;
    let dbError: any = dbResult.error;

    if (!dbError && dbResult.data && dbResult.data.length > 0) {
      document = dbResult.data[0];
    } else if (!dbError && (!dbResult.data || dbResult.data.length === 0)) {
      dbError = new Error("Failed to return the generated document");
    }

    if (dbError) {
      console.error('❌ Database error saving built CV:', dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      document,
    });

  } catch (error: any) {
    console.error('❌ CV Save error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
