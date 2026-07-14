import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { generateSystematicScoringPrompt } from './src/lib/ai/prompts/scoring';
import { openai, AI_MODEL } from './src/lib/ai/client';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data } = await supabase.from('reports').select('*, cv_doc:documents!reports_cv_id_fkey(text)').eq('id', '09198795-dd8c-4172-8891-fef09e999ff2').single();
  const cvText = data.cv_doc?.text || data.cv_doc?.[0]?.text;
  
  const jobIds = data.job_ids;
  const { data: jobs } = await supabase.from('documents').select('text').in('id', jobIds);
  const jobText = jobs[0]?.text;

  console.log("Generating prompt...");
  const prompt = generateSystematicScoringPrompt(cvText, [jobText]);

  console.log("Calling OpenAI API...");
  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const responseJson = JSON.parse(completion.choices[0].message.content || "{}");
  
  console.log('\n--- Industry & Domain JSON ---');
  console.log(JSON.stringify(responseJson.components?.industryDomain || responseJson.components?.industryRelevance, null, 2));

  console.log('\n--- Experience JSON ---');
  console.log(JSON.stringify(responseJson.components?.experienceLevel, null, 2));
}

main().catch(console.error);
