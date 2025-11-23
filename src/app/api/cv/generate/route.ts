import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, AI_MODEL } from "@/lib/ai/client";
import { generateOptimizedCVPrompt, generateFakeSkillsRecommendationsPrompt } from "@/lib/ai/prompts";
import { generateCVPDF } from "@/lib/pdf/cvGenerator";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const { reportId, fakeItMode = false } = await request.json();

    console.log('🔍 CV Generation Request:', {
      reportId,
      fakeItMode,
      fakeItModeType: typeof fakeItMode,
      fakeItModeValue: fakeItMode === true ? 'TRUE' : 'FALSE'
    });

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID required" },
        { status: 400 }
      );
    }

    // Fetch report with all related data
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*, cv:documents!cv_id(*)")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single();

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Check if CV already generated
    if (report.generated_cv) {
      return NextResponse.json({
        success: true,
        message: "CV already generated",
        cv: report.generated_cv,
      });
    }

    // Check if report is Pro (required for CV generation)
    if (!report.pro) {
      return NextResponse.json(
        { error: "Pro analysis required for CV generation" },
        { status: 403 }
      );
    }

    // Fetch job documents
    const jobIds = report.job_ids as string[];
    const { data: jobDocs, error: jobError } = await supabase
      .from("documents")
      .select("*")
      .in("id", jobIds)
      .eq("user_id", user.id)
      .eq("type", "job");

    if (jobError || !jobDocs || jobDocs.length === 0) {
      return NextResponse.json({ error: "Jobs not found" }, { status: 404 });
    }

    // Prepare analysis results
    const analysisResults = {
      fitScore: report.fit_score || 0,
      summary: report.summary_free || "",
      missingKeywords: (report.keywords as { missing?: string[] })?.missing || [],
      rewrittenBullets: report.summary_pro?.rewrittenBullets || [],
      roleRecommendations: report.role_fit || [],
      atsFlags: report.ats_flags || [],
    };

    // Generate fake skills recommendations if fake it mode is enabled
    let fakeSkillsRecommendations = null;
    if (fakeItMode && analysisResults.missingKeywords.length > 0) {
      const recommendationsPrompt = generateFakeSkillsRecommendationsPrompt(
        analysisResults.missingKeywords,
        jobDocs.map((job) => job.text)
      );

      const recommendationsCompletion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [{ role: "user", content: recommendationsPrompt }],
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: "json_object" },
      });

      const recommendationsResult = JSON.parse(
        recommendationsCompletion.choices[0].message.content || "{}"
      );

      fakeSkillsRecommendations = recommendationsResult.recommendations || [];
    }

    // Generate optimized CV using AI
    const prompt = generateOptimizedCVPrompt(
      report.cv.text,
      jobDocs.map((job) => job.text),
      analysisResults,
      fakeItMode
    );

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const generatedCV = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    // Save generated CV to database (always succeeds)
    const updateData: { generated_cv: any; fake_it_mode?: boolean } = {
      generated_cv: generatedCV,
    };

    // Try to save fake_it_mode flag (optional - may fail if column doesn't exist)
    try {
      updateData.fake_it_mode = fakeItMode;
    } catch {
      // Column doesn't exist yet - ignore
    }

    const { error: updateError } = await supabase
      .from("reports")
      .update(updateData)
      .eq("id", reportId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to save generated CV: ${updateError.message}`);
    }

    // Try to save fake skills recommendations (optional - may fail if column doesn't exist)
    if (fakeSkillsRecommendations && fakeSkillsRecommendations.length > 0) {
      try {
        await supabase
          .from("reports")
          .update({
            fake_skills_recommendations: fakeSkillsRecommendations,
          })
          .eq("id", reportId);
        console.log('✅ Fake skills recommendations saved successfully');
      } catch (fakeSkillsError) {
        // Column doesn't exist yet - that's okay, user needs to run migration
        console.log('⚠️ Could not save fake skills recommendations (migration not run yet):', fakeSkillsError);
        // Don't fail the request - CV generation still succeeded
      }
    }

    // Try to clear analysis cache (optional - may not exist in older DB schemas)
    try {
      await supabase
        .from("reports")
        .update({
          optimized_score: null,
          improvement_breakdown: null,
        })
        .eq("id", reportId);
    } catch (cacheError) {
      // Ignore if columns don't exist yet - cache clearing is optional
      console.log("Cache clearing skipped (columns may not exist yet):", cacheError);
    }

    // Generate PDF and save to optimized_cvs table for My CVs page
    try {
      const pdf = await generateCVPDF(generatedCV);
      const pdfArrayBuffer = pdf.output('arraybuffer');
      const pdfBuffer = Buffer.from(pdfArrayBuffer);

      // Create filename using user's name from generated CV
      const userName = generatedCV.contact?.name;
      console.log('📝 Generated CV contact name:', userName);

      if (!userName) {
        console.log('⚠️ No contact name in generated CV, using fallback');
      }

      const displayName = userName || 'Optimized CV';
      const sanitizedName = displayName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
      const fileName = `${user.id}/${reportId}/${sanitizedName}.pdf`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('cv-files')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadError) {
        console.log('PDF upload error:', uploadError);
      } else {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('cv-files')
          .getPublicUrl(fileName);

        // Save to optimized_cvs table - use just the name as title
        const cvTitle = userName ? `${userName} - Optimized CV` : 'Optimized CV';
        console.log('📝 Saving to optimized_cvs with title:', cvTitle);

        // First try to delete existing entry, then insert new one
        await supabase
          .from('optimized_cvs')
          .delete()
          .eq('report_id', reportId);

        const { error: insertError } = await supabase
          .from('optimized_cvs')
          .insert({
            user_id: user.id,
            report_id: reportId,
            original_cv_id: report.cv_id,
            title: cvTitle,
            file_url: urlData.publicUrl,
            text: JSON.stringify(generatedCV),
            lang: report.cv?.lang || 'en',
          });

        if (insertError) {
          console.log('optimized_cvs insert error:', insertError);
        } else {
          console.log('✅ Optimized CV saved to My CVs with title:', cvTitle);
        }
      }
    } catch (pdfError) {
      // PDF generation is optional - don't fail the request
      console.log('PDF generation for My CVs failed:', pdfError);
    }

    return NextResponse.json({
      success: true,
      message: "CV generated successfully",
      cv: generatedCV,
    });
  } catch (error) {
    console.error("CV generation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to generate CV: ${errorMessage}` },
      { status: 500 }
    );
  }
}
