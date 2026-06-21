import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('reports')
    .select('id, generated_cv, created_at')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log(JSON.stringify(data[0].generated_cv, null, 2));
  } else {
    console.log("No reports found.");
  }
}

check();
