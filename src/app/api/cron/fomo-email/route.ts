import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendFreeReportFOMOEmail } from '@/lib/email';

// Vercel Cron — runs every hour
// Finds free reports created 2-3 hours ago where user hasn't upgraded to Pro
// and sends a FOMO upsell email

export const dynamic = 'force-dynamic';

// Verify the request is from Vercel Cron (production) or allow in dev
function isAuthorized(request: Request): boolean {
  // In development, allow all requests
  if (process.env.NODE_ENV === 'development') return true;
  
  // In production, verify Vercel Cron secret
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Find free reports created 2-3 hours ago (1-hour window to avoid re-sending)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();

    // Get free reports in the 2-3 hour window
    const { data: freeReports, error: reportsError } = await supabase
      .from('reports')
      .select('id, user_id, fit_score, keywords, created_at')
      .eq('pro', false)
      .gte('created_at', threeHoursAgo)
      .lte('created_at', twoHoursAgo);

    if (reportsError || !freeReports || freeReports.length === 0) {
      return NextResponse.json({ 
        message: 'No eligible reports found', 
        checked: 0, 
        sent: 0 
      });
    }

    let sent = 0;

    for (const report of freeReports) {
      // Check if user already has a Pro report (any pro report = don't send)
      const { data: proReports } = await supabase
        .from('reports')
        .select('id')
        .eq('user_id', report.user_id)
        .eq('pro', true)
        .limit(1);

      // Skip if user already has any Pro report
      if (proReports && proReports.length > 0) {
        continue;
      }

      // Get user email
      const { data: userData } = await supabase.auth.admin.getUserById(report.user_id);
      
      if (!userData?.user?.email) continue;

      // Extract missing keywords
      const missingKeywords: string[] = report.keywords?.missing || [];

      // Send the FOMO email
      try {
        await sendFreeReportFOMOEmail(
          userData.user.email,
          userData.user.user_metadata?.name || userData.user.email.split('@')[0] || 'there',
          report.fit_score || 0,
          report.id,
          missingKeywords
        );
        sent++;
      } catch (emailErr) {
        console.error(`Failed to send FOMO email for report ${report.id}:`, emailErr);
      }
    }

    return NextResponse.json({
      message: `Processed ${freeReports.length} reports, sent ${sent} FOMO emails`,
      checked: freeReports.length,
      sent,
    });

  } catch (error) {
    console.error('FOMO cron error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
