import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, AI_MODEL } from "@/lib/ai/client";
import { generateCoverLetterPrompt } from "@/lib/ai/prompts";

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
    const {
      cvId,
      jobId,
      tone = 'professional',
      length = 'medium',
      language = 'en',
      template = 'standard',
      customizationFields
    } = await request.json();

    if (!cvId || !jobId) {
      return NextResponse.json(
        { error: "CV ID and Job ID are required" },
        { status: 400 }
      );
    }

    // Fetch CV document
    const { data: cvDoc, error: cvError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", cvId)
      .eq("user_id", user.id)
      .eq("type", "cv")
      .single();

    if (cvError || !cvDoc) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Fetch job document
    const { data: jobDoc, error: jobError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .eq("type", "job")
      .single();

    if (jobError || !jobDoc) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Extract candidate name from CV text (simple heuristic)
    let candidateName = "Candidate";
    const nameMatch = cvDoc.text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
    if (nameMatch) {
      candidateName = nameMatch[1];
    }

    // Extract company name from job posting
    let companyName = "Company";
    const companyMatch = jobDoc.text.match(/Company:\s*([^\n]+)/i) ||
                        jobDoc.text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+is\s+(?:looking|seeking|hiring)/);
    if (companyMatch) {
      companyName = companyMatch[1].trim();
    }

    // Generate cover letter using AI
    const prompt = generateCoverLetterPrompt(
      cvDoc.text,
      jobDoc.text,
      candidateName,
      companyName,
      jobDoc.title,
      tone as 'professional' | 'friendly' | 'formal',
      length as 'short' | 'medium' | 'long',
      language as 'en' | 'tr',
      template as 'standard' | 'story_driven' | 'technical_focus' | 'results_oriented' | 'career_change' | 'short_intro',
      customizationFields
    );

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 3000, // Increased for structured response
      response_format: { type: "json_object" },
    });

    let result;
    try {
      const content = completion.choices[0].message.content || "{}";
      result = JSON.parse(content);

      // Validate required fields
      if (!result.content || !result.wordCount) {
        throw new Error("Invalid AI response: missing required fields");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw AI response:", completion.choices[0].message.content);

      // Fallback: try to extract at least the content
      const content = completion.choices[0].message.content || "";
      result = {
        content: content,
        wordCount: content.split(/\s+/).length,
        keyHighlights: [],
        paragraphs: null
      };
    }

    // Save cover letter to database
    const { data: coverLetter, error: saveError } = await supabase
      .from("cover_letters")
      .insert({
        user_id: user.id,
        report_id: null,
        job_id: jobId,
        content: result.content,
        tone,
        length,
        language,
        template,
        structured_content: result.paragraphs ? {
          paragraphs: result.paragraphs,
          keyHighlights: result.keyHighlights,
          wordCount: result.wordCount
        } : null,
        customization_fields: customizationFields || null,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving cover letter:", saveError);
      // Continue even if save fails - return the generated content
    }

    return NextResponse.json({
      success: true,
      coverLetter: {
        id: coverLetter?.id,
        content: result.content,
        wordCount: result.wordCount,
        keyHighlights: result.keyHighlights,
        paragraphs: result.paragraphs,
        tone,
        length,
        language,
        template,
      },
    });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to generate cover letter: ${errorMessage}` },
      { status: 500 }
    );
  }
}
