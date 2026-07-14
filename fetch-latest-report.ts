import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: reports, error } = await supabase
    .from('reports')
    .select('*, cv_doc:documents!reports_cv_id_fkey(text)')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching reports:', error);
    return;
  }

  console.log(`Found ${reports.length} recent reports.`);
  
  if (reports.length > 0) {
    const report = reports[0];
    console.log('Latest Report ID:', report.id);
    console.log('Created At:', report.created_at);
    console.log('Fit Score:', report.fit_score);
    console.log('\n--- Score Breakdown Components ---');
    console.log(JSON.stringify(report.score_breakdown?.components, null, 2));
    
    const cvText = report.cv_doc?.text || report.cv_doc?.[0]?.text;
    console.log('\n--- CV Snippet ---');
    console.log(cvText?.substring(0, 500));
  }
}

main().catch(console.error);
