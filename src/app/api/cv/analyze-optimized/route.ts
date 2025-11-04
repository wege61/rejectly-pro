import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, AI_MODEL } from "@/lib/ai/client";
import { generateFreeSummaryPrompt, generateImprovementBreakdownPrompt } from "@/lib/ai/prompts";
import { GeneratedCV } from "@/types/cv";

// Helper function to convert GeneratedCV to text format
function convertCVToText(cv: GeneratedCV): string {
  const sections: string[] = [];

  // Contact Information
  sections.push(`${cv.contact.name}`);
  if (cv.contact.email) sections.push(`Email: ${cv.contact.email}`);
  if (cv.contact.phone) sections.push(`Phone: ${cv.contact.phone}`);
  if (cv.contact.location) sections.push(`Location: ${cv.contact.location}`);
  if (cv.contact.linkedin) sections.push(`LinkedIn: ${cv.contact.linkedin}`);
  if (cv.contact.portfolio) sections.push(`Portfolio: ${cv.contact.portfolio}`);
  sections.push("");

  // Professional Summary
  if (cv.summary) {
    sections.push("PROFESSIONAL SUMMARY");
    sections.push(cv.summary);
    sections.push("");
  }

  // Experience
  if (cv.experience && cv.experience.length > 0) {
    sections.push("WORK EXPERIENCE");
    cv.experience.forEach((exp) => {
      sections.push(`${exp.title} at ${exp.company}`);
      if (exp.location) sections.push(`Location: ${exp.location}`);
      if (exp.startDate || exp.endDate) {
        sections.push(`${exp.startDate || ""} - ${exp.endDate || ""}`);
      }
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach((bullet) => {
          sections.push(`• ${bullet}`);
        });
      }
      sections.push("");
    });
  }

  // Education
  if (cv.education && cv.education.length > 0) {
    sections.push("EDUCATION");
    cv.education.forEach((edu) => {
      sections.push(`${edu.degree} - ${edu.institution}`);
      if (edu.location) sections.push(`Location: ${edu.location}`);
      if (edu.graduationDate) sections.push(`Graduated: ${edu.graduationDate}`);
      if (edu.details) sections.push(edu.details);
      sections.push("");
    });
  }

  // Skills
  if (cv.skills) {
    sections.push("SKILLS");
    if (cv.skills.technical && cv.skills.technical.length > 0) {
      sections.push(`Technical Skills: ${cv.skills.technical.join(", ")}`);
    }
    if (cv.skills.soft && cv.skills.soft.length > 0) {
      sections.push(`Soft Skills: ${cv.skills.soft.join(", ")}`);
    }
    sections.push("");
  }

  // Certifications
  if (cv.certifications && cv.certifications.length > 0) {
    sections.push("CERTIFICATIONS");
    cv.certifications.forEach((cert) => {
      sections.push(`${cert.name} - ${cert.issuer} (${cert.date})`);
    });
    sections.push("");
  }

  // Languages
  if (cv.languages && cv.languages.length > 0) {
    sections.push("LANGUAGES");
    cv.languages.forEach((lang) => {
      sections.push(`${lang.language}: ${lang.proficiency}`);
    });
    sections.push("");
  }

  return sections.join("\n");
}

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
    const { reportId } = await request.json();

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID required" },
        { status: 400 }
      );
    }

    // Fetch report with generated CV
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single();

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Check if CV is generated
    if (!report.generated_cv) {
      return NextResponse.json(
        { error: "No optimized CV found for this report" },
        { status: 404 }
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

    // Convert generated CV to text
    const optimizedCVText = convertCVToText(report.generated_cv as GeneratedCV);

    // Generate AI analysis for optimized CV
    const prompt = generateFreeSummaryPrompt(
      optimizedCVText,
      jobDocs.map((job) => job.text)
    );

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    // Fetch original CV for breakdown comparison
    const { data: cvDoc, error: cvError } = await supabase
      .from("documents")
      .select("text")
      .eq("id", report.cv_id)
      .eq("user_id", user.id)
      .eq("type", "cv")
      .single();

    let improvementBreakdown = null;

    if (!cvError && cvDoc) {
      // Generate improvement breakdown
      const breakdownPrompt = generateImprovementBreakdownPrompt(
        cvDoc.text,
        optimizedCVText,
        jobDocs.map((job) => job.text),
        (report.keywords as { missing?: string[] })?.missing || []
      );

      const breakdownCompletion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [{ role: "user", content: breakdownPrompt }],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      });

      const breakdownResult = JSON.parse(
        breakdownCompletion.choices[0].message.content || "{}"
      );

      improvementBreakdown = breakdownResult.improvements || [];
    }

    return NextResponse.json({
      success: true,
      fitScore: result.fitScore || 0,
      summary: result.summary || "",
      missingKeywords: result.missingKeywords || [],
      improvementBreakdown,
    });
  } catch (error) {
    console.error("Optimized CV analysis error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to analyze optimized CV: ${errorMessage}` },
      { status: 500 }
    );
  }
}
