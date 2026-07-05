const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('Fetching the 3 most recently generated CVs...');
  
  const { data: reports, error } = await supabase
    .from('reports')
    .select('id, created_at, generated_cv')
    .not('generated_cv', 'is', null)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  if (reports.length === 0) {
    console.log('No generated CVs found in the database.');
    return;
  }

  reports.forEach((report, index) => {
    console.log(`\n======================================================`);
    console.log(`CV #${index + 1} - Report ID: ${report.id}`);
    console.log(`Created At: ${new Date(report.created_at).toLocaleString()}`);
    console.log(`======================================================`);
    
    const cv = report.generated_cv;
    if (!cv) {
      console.log('No CV JSON attached.');
      return;
    }
    
    // Extract dates to analyze
    const experienceDates = cv.experience ? cv.experience.map(e => `[${e.title}] ${e.startDate} - ${e.endDate}`) : [];
    const educationDates = cv.education ? cv.education.map(e => `[${e.degree}] Graduated: ${e.graduationDate}`) : [];
    
    console.log(`\nEXPERIENCE DATES:`);
    experienceDates.forEach(d => console.log(`  - ${d}`));
    
    console.log(`\nEDUCATION DATES:`);
    educationDates.forEach(d => console.log(`  - ${d}`));
    
    console.log(`\nSUMMARY PREVIEW:`);
    console.log(`  ${cv.summary?.substring(0, 100)}...`);
  });
}

checkDatabase();
