import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('id, created_at, metric_questions')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching reports:', error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkReports();
