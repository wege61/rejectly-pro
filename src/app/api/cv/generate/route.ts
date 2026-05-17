import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { openai, AI_MODEL } from "@/lib/ai/client";
import { generateOptimizedCVPrompt, generateCareerRecommendationsPrompt, generateInterviewPrepPrompt } from "@/lib/ai/prompts";
import { generateCVPDF } from "@/lib/pdf/cvGenerator";
import { postProcessCVForATS, GeneratedCVData } from "@/lib/ats/utils";

export async function POST(request: NextRequest) {
  console.log('\n\n🔴🔴🔴 CV GENERATE ENDPOINT CALLED 🔴🔴🔴\n\n');

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
    const { reportId, additionalTools = [], forceRegenerate = false, photoUrl, colorTemplate, userProvidedMetrics, academicDetails } = await request.json();

    console.log('🔍 CV Generation Request:', {
      reportId,
      additionalTools: additionalTools.length > 0 ? additionalTools : 'none',
      forceRegenerate
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

    // Check if CV already generated with same settings
    // Always regenerate if additionalTools are provided (user selected new tools)
    // Always regenerate if forceRegenerate is true
    const hasAdditionalTools = additionalTools && additionalTools.length > 0;

    if (report.generated_cv && !hasAdditionalTools && !forceRegenerate) {
      console.log('✅ CV already generated with same settings, returning cached version');
      return NextResponse.json({
        success: true,
        message: "CV already generated",
        cv: report.generated_cv,
      });
    }

    if (forceRegenerate) {
      console.log('🔄 Force regenerating CV due to forceRegenerate flag');
    }

    // Log regeneration reason
    if (report.generated_cv) {
      if (hasAdditionalTools) {
        console.log('🔧 Regenerating CV with additional tools:', additionalTools);
      }
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


    // Extract achievements and metrics from original CV
    const cvText = report.cv.text;
    console.log('📝 Original CV text length:', cvText?.length || 0);
    console.log('📝 Original CV contains ACHIEVEMENTS?:', cvText?.includes('ACHIEVEMENT') || false);
    console.log('📝 Original CV contains "2,500" or "2500"?:', cvText?.includes('2,500') || cvText?.includes('2500') || false);

    const extractedMetrics: string[] = [];

    // Look for common metric patterns
    const metricPatterns = [
      /\d{1,3}(?:,\d{3})*\+?\s*(?:vehicles?|users?|customers?|clients?)/gi,
      /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\+?(?:\s*(?:K|M|B|revenue|savings?))?/gi,
      /#\d+\s*(?:rank|position|in\s+\w+)/gi,
      /\d{1,3}(?:\.\d+)?%\s*(?:CSAT|NPS|satisfaction|retention|increase|decrease|improvement)/gi,
      /within\s+\d+\s*(?:months?|weeks?|days?)/gi,
      /\d+\s*consecutive\s*months?/gi,
      /\d+\s*(?:in\s+)?(?:one\s+)?week/gi,
      /EMEA\s*(?:#?\d+|region|rank)/gi,
    ];

    metricPatterns.forEach(pattern => {
      const matches = cvText.match(pattern);
      if (matches) {
        extractedMetrics.push(...matches);
      }
    });

    // Look for ACHIEVEMENTS section
    const achievementMatch = cvText.match(/ACHIEVEMENTS?([\s\S]*?)(?=EDUCATION|SKILLS|CERTIFICATIONS|LANGUAGES|$)/i);
    const achievementsSection = achievementMatch ? achievementMatch[1].trim() : '';

    console.log('📊 Extracted metrics from CV:', extractedMetrics);
    console.log('🏆 Achievements section found:', achievementsSection ? 'YES' : 'NO');

    // Detect output language from job posting text
    const jobTextsCombined = jobDocs.map((job: { text: string }) => job.text).join(' ');
    const detectedLocale = detectLocale(jobTextsCombined);
    const LOCALE_TO_LANGUAGE: Record<string, string> = {
      'en': 'English', 'tr': 'Turkish', 'de': 'German', 'fr': 'French', 'es': 'Spanish',
    };
    const outputLanguage = LOCALE_TO_LANGUAGE[detectedLocale] || 'English';
    console.log('🌍 Detected job posting language:', outputLanguage, `(locale: ${detectedLocale})`);
    
    // Map user answers to their original questions/bullets for richer AI context
    let enrichedMetrics: Record<string, string> | undefined = undefined;
    if (userProvidedMetrics && Object.keys(userProvidedMetrics).length > 0) {
      enrichedMetrics = {};
      const originalQuestions = report.metric_questions || [];
      
      for (const [id, answer] of Object.entries(userProvidedMetrics)) {
        const matchingQuestion = originalQuestions.find((q: any) => q.id === id);
        if (matchingQuestion) {
          enrichedMetrics[id] = `Original Bullet: "${matchingQuestion.original_bullet}" -> User's Metric Added: "${answer}"`;
        } else {
          enrichedMetrics[id] = answer as string;
        }
      }
    }
    
    console.log('💡 Enriched Metrics for AI:', enrichedMetrics || 'None');

    // Generate optimized CV using AI
    const prompt = generateOptimizedCVPrompt(
      report.cv.text,
      jobDocs.map((job: { text: string }) => job.text),
      analysisResults,
      false, // fakeItMode is retired
      additionalTools,
      extractedMetrics,
      achievementsSection,
      outputLanguage,
      enrichedMetrics,
      academicDetails
    );

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert CV writer. You MUST write the entire CV in ${outputLanguage}. Every text value — summary, bullets, skills, dates — must be in ${outputLanguage}. JSON keys stay in English.`
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.85,
      max_tokens: 8000,
      response_format: { type: "json_object" },
    });

    const rawGeneratedCV = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    // Post-process CV for ATS compliance (expand abbreviations, normalize dates, clean special chars)
    const generatedCV = postProcessCVForATS(rawGeneratedCV as GeneratedCVData);

    // Localize dates based on job posting language
    const jobTextsForLocale = jobDocs.map((j: { text: string }) => j.text).join(' ');
    localizeCVDates(generatedCV, jobTextsForLocale);

    // Add customization options to generated CV
    if (photoUrl) {
      (generatedCV as unknown as Record<string, unknown>).photoUrl = photoUrl;
    }
    if (colorTemplate) {
      (generatedCV as unknown as Record<string, unknown>).colorTemplate = colorTemplate;
    }

    // Log generated CV for debugging
    console.log('📄 Generated CV Experience:', JSON.stringify(generatedCV.experience?.map((e: { title: string; bullets: string[] }) => ({
      title: e.title,
      bullets: e.bullets
    })), null, 2));

    // Save generated CV to database (always succeeds)
    const updateData: { generated_cv: any } = {
      generated_cv: generatedCV,
    };

    console.log('💾 Saving to database:', {
      reportId,
      updateData: {
        hasGeneratedCV: !!updateData.generated_cv,
      }
    });

    const { data: updatedReport, error: updateError } = await supabase
      .from("reports")
      .update(updateData)
      .eq("id", reportId)
      .select('id, generated_cv')
      .single();

    if (updateError) {
      console.error('❌ Database update error:', updateError);
      throw new Error(`Failed to save generated CV: ${updateError.message}`);
    }

    console.log('✅ Successfully saved to database:', {
      reportId: updatedReport.id,
      hasGeneratedCV: !!updatedReport.generated_cv
    });


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

    // Generate career recommendations in background (non-blocking)
    const careerRecommendationsPromise = (async () => {
      try {
        const careerPrompt = generateCareerRecommendationsPrompt(
          report.cv.text,
          jobDocs.map((job: { text: string }) => job.text)
        );

        const careerCompletion = await openai.chat.completions.create({
          model: AI_MODEL,
          messages: [{ role: "user", content: careerPrompt }],
          temperature: 0.6,
          max_tokens: 3000,
          response_format: { type: "json_object" },
        });

        const careerResult = JSON.parse(careerCompletion.choices[0].message.content || "{}");

        if (careerResult && careerResult.recommendations) {
          await supabase
            .from("reports")
            .update({ career_recommendations: careerResult.recommendations })
            .eq("id", reportId);
          console.log('✅ Career recommendations generated and saved');
          return careerResult.recommendations;
        }
      } catch (careerError) {
        console.log('⚠️ Career recommendations generation failed (non-blocking):', careerError);
      }
    })();

    // Generate interview prep in background (non-blocking)
    const interviewPrepPromise = (async () => {
      try {
        // Build weak categories from score breakdown
        const weakCategories: string[] = [];
        if (report.score_breakdown?.components) {
          const components = report.score_breakdown.components as Record<string, { earnedPoints?: number; maxPoints?: number }>;
          for (const [key, comp] of Object.entries(components)) {
            if (comp && comp.maxPoints && comp.earnedPoints !== undefined) {
              const pct = (comp.earnedPoints / comp.maxPoints) * 100;
              if (pct < 60) {
                weakCategories.push(key);
              }
            }
          }
        }

        const missingKeywords = (report.keywords as { missing?: string[] })?.missing || [];

        const interviewPrompt = generateInterviewPrepPrompt(
          report.cv.text,
          jobDocs.map((job: { text: string }) => job.text),
          missingKeywords,
          {
            fitScore: report.fit_score,
            weakCategories,
          }
        );

        const interviewCompletion = await openai.chat.completions.create({
          model: AI_MODEL,
          messages: [{ role: "user", content: interviewPrompt }],
          temperature: 0.4,
          max_tokens: 4000,
          response_format: { type: "json_object" },
        });

        const interviewResult = JSON.parse(interviewCompletion.choices[0].message.content || "{}");

        if (interviewResult.behavioral && interviewResult.technical) {
          await supabase
            .from("reports")
            .update({ interview_prep: interviewResult })
            .eq("id", reportId);
          console.log('✅ Interview prep generated and saved');
          return interviewResult;
        }
      } catch (interviewError) {
        console.log('⚠️ Interview prep generation failed (non-blocking):', interviewError);
      }
    })();

    // Generate PDF and save to optimized_cvs table for My CVs page
    try {
      let backendPhotoBase64: string | undefined = undefined;
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      if (photoUrl) {
        try {
          let downloadUrl = photoUrl;
          if (!photoUrl.startsWith('http')) {
            const { data: signData } = await supabaseAdmin.storage.from('cv-files').createSignedUrl(photoUrl, 60);
            if (signData?.signedUrl) {
              downloadUrl = signData.signedUrl;
            }
          }

          const res = await fetch(downloadUrl);
          if (res.ok) {
            const buffer = Buffer.from(await res.arrayBuffer());
            const ext = photoUrl.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
            backendPhotoBase64 = `data:image/${ext};base64,${buffer.toString('base64')}`;
          }
        } catch (fetchErr) {
          console.error('Failed to fetch photoUrl during CV backend generation:', fetchErr);
        }
      }

      const pdf = await generateCVPDF(generatedCV, undefined, {
        colorTemplate: colorTemplate || undefined,
        photoBase64: backendPhotoBase64,
      });
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
      const timestamp = new Date().getTime();
      const fileName = `${user.id}/${reportId}/${timestamp}/${sanitizedName}.pdf`;

      // Upload to Supabase storage bypassing RLS using admin client
      const { error: uploadError } = await supabaseAdmin.storage
        .from('cv-files')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadError) {
        console.log('PDF upload error:', uploadError);
      } else {
        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
          .from('cv-files')
          .getPublicUrl(fileName);

        const pdfUrl = urlData.publicUrl;

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
            file_url: pdfUrl,
            text: JSON.stringify(generatedCV),
            lang: report.cv?.lang || 'en',
            source: 'reports',
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

    // Wait for interview prep and career recommendations to finish before responding
    const [interviewPrep, careerRecommendations] = await Promise.all([interviewPrepPromise, careerRecommendationsPromise]);

    return NextResponse.json({
      success: true,
      message: "CV generated successfully",
      cv: generatedCV,
      interview_prep: interviewPrep,
      career_recommendations: careerRecommendations
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

// ---------------------------------------------------------------------------
// Locale-aware date post-processor
// Uses Intl.DateTimeFormat so it works for ANY language, not just Turkish.
// ---------------------------------------------------------------------------
const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const PRESENT_MAP: Record<string, string> = {
  tr: 'Devam Ediyor',
  de: 'Bis heute',
  fr: "Aujourd'hui",
  es: 'Actualidad',
  it: 'Presente',
  pt: 'Presente',
  nl: 'Heden',
  ru: 'По настоящее время',
  ar: 'حتى الآن',
};

/** Detect locale from CV text content. Returns BCP-47 locale string. */
function detectLocale(text: string): string {
  // Turkish
  if (/[şçğıöüŞÇĞİÖÜ]/.test(text) || /\b(ve|ile|için|olan|olarak|müşteri|sağla)\b/i.test(text)) return 'tr';
  // German
  if (/[äöüßÄÖÜ]/.test(text) || /\b(und|mit|für|bei|das|ein|sind)\b/i.test(text)) return 'de';
  // French
  if (/[àâéèêëïîôùûüÿçœæ]/i.test(text) || /\b(et|avec|pour|dans|les|des|une)\b/i.test(text)) return 'fr';
  // Spanish
  if (/[ñ¿¡áéíóú]/i.test(text) || /\b(y|con|para|por|los|las|una)\b/i.test(text)) return 'es';
  // Default
  return 'en';
}

/** Build a map of English month name → localized month name for the given locale. */
function buildMonthMap(locale: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (let m = 0; m < 12; m++) {
    const date = new Date(2024, m, 1);
    const localized = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
    // Capitalize first letter
    const capitalized = localized.charAt(0).toUpperCase() + localized.slice(1);
    map[EN_MONTHS[m]] = capitalized;
  }
  return map;
}

/** Replace English dates in a single string with localized dates. */
function localizeDateString(str: string, monthMap: Record<string, string>, presentText: string): string {
  let result = str;
  // Only match English month names followed by a space+year (e.g. "May 2025")
  // This prevents matching "May" inside already-localized "Mayıs"
  for (const [en, localized] of Object.entries(monthMap)) {
    result = result.replace(new RegExp(`${en}(\\s+\\d{4})`, 'g'), `${localized}$1`);
    // Also handle month at end of string (rare, but possible)
    result = result.replace(new RegExp(`${en}$`, 'g'), localized);
  }
  // "Present" → localized (whole word only)
  result = result.replace(/\bPresent\b/g, presentText);
  return result;
}

/** Post-process all date fields in a generated CV to use locale-appropriate month names. */
function localizeCVDates(cv: GeneratedCVData, jobPostingText: string): void {
  const locale = detectLocale(jobPostingText);
  if (locale === 'en') return; // No conversion needed

  const monthMap = buildMonthMap(locale);
  const presentText = PRESENT_MAP[locale] || 'Present';

  // Localize experience dates
  if (cv.experience) {
    for (const exp of cv.experience) {
      if (exp.startDate) exp.startDate = localizeDateString(exp.startDate, monthMap, presentText);
      if (exp.endDate) exp.endDate = localizeDateString(exp.endDate, monthMap, presentText);
    }
  }

  // Localize education dates
  if (cv.education) {
    for (const edu of cv.education) {
      if (edu.graduationDate) edu.graduationDate = localizeDateString(edu.graduationDate, monthMap, presentText);
    }
  }

  // Localize certification dates
  if (cv.certifications) {
    for (const cert of cv.certifications) {
      if (cert.date) cert.date = localizeDateString(cert.date, monthMap, presentText);
    }
  }

  // Sort experience in reverse chronological order (most recent first)
  if (cv.experience && cv.experience.length > 1) {
    const monthOrder = EN_MONTHS.reduce((acc, m, i) => { acc[m.toLowerCase()] = i; return acc; }, {} as Record<string, number>);
    // Also add localized month names to the order map
    for (const [en, loc] of Object.entries(monthMap)) {
      monthOrder[loc.toLowerCase()] = monthOrder[en.toLowerCase()];
    }

    const parseDate = (dateStr: string): number => {
      if (!dateStr) return 0;
      // "Present" or localized equivalent = far future
      if (dateStr === 'Present' || dateStr === presentText) return 99999999;
      // Try to parse "Month YYYY" in any language
      const parts = dateStr.trim().split(/\s+/);
      if (parts.length >= 2) {
        const monthIdx = monthOrder[parts[0].toLowerCase()] ?? -1;
        const year = parseInt(parts[parts.length - 1], 10) || 0;
        return year * 100 + monthIdx;
      }
      return 0;
    };

    cv.experience.sort((a, b) => {
      const endA = parseDate(a.endDate || '');
      const endB = parseDate(b.endDate || '');
      if (endA !== endB) return endB - endA; // Most recent end date first
      return parseDate(b.startDate || '') - parseDate(a.startDate || ''); // Tie-break by start date
    });
  }
}
