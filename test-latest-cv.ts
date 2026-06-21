import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { detectLocale } from './src/lib/languageUtils';

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
    const cv = data[0].generated_cv;
    const allText = [
      cv.summary,
      ...cv.experience.map((e: any) => `${e.title} ${e.bullets.join(" ")}`)
    ].join(" ");
    
    console.log('Language detected:', detectLocale(allText));
    console.log('Text preview:', allText.substring(0, 500));
  } else {
    console.log("No reports found.");
  }
}

check();
