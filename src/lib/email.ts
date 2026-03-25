import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is missing. Emails will not be sent.');
}

export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

// ─── Base Email Layout ─────────────────────────────────────────
function emailLayout(content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Rejectly.pro</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #f3f4f8; -webkit-font-smoothing: antialiased;">
  
  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090b;">
    <tr>
      <td align="center" style="padding: 48px 24px;">
        
        <!-- Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #111113; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden;">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 40px 40px 0 40px; text-align: center;">
              <img src="https://rejectly.pro/logo.png" alt="Rejectly" width="56" height="56" style="display: block; margin: 0 auto; border-radius: 14px;" />
              <p style="margin: 16px 0 0 0; font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase;">Rejectly.pro</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px 40px 40px 40px;">
              ${content}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: rgba(255,255,255,0.06);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255,255,255,0.3);">
                © ${new Date().getFullYear()} Rejectly.pro — Land your dream job.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="https://rejectly.pro/privacy" style="color: rgba(255,255,255,0.25); font-size: 12px; text-decoration: none;">Privacy</a>
                  </td>
                  <td style="color: rgba(255,255,255,0.15); font-size: 12px;">·</td>
                  <td style="padding: 0 8px;">
                    <a href="https://rejectly.pro/terms" style="color: rgba(255,255,255,0.25); font-size: 12px; text-decoration: none;">Terms</a>
                  </td>
                  <td style="color: rgba(255,255,255,0.15); font-size: 12px;">·</td>
                  <td style="padding: 0 8px;">
                    <a href="https://rejectly.pro/contact" style="color: rgba(255,255,255,0.25); font-size: 12px; text-decoration: none;">Contact</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── CTA Button Helper ─────────────────────────────────────────
function ctaButton(text: string, url: string) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 32px auto 0 auto;">
    <tr>
      <td style="background: linear-gradient(135deg, #35A29F 0%, #0B666A 100%); border-radius: 9999px; text-align: center;">
        <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 36px; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; letter-spacing: 0.01em;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

// ─── Feature Row Helper ────────────────────────────────────────
function featureRow(icon: string, title: string, desc: string) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
    <tr>
      <td style="width: 44px; vertical-align: top; padding-top: 2px;">
        <div style="width: 36px; height: 36px; background: rgba(53,162,159,0.1); border: 1px solid rgba(53,162,159,0.2); border-radius: 10px; text-align: center; line-height: 36px; font-size: 16px;">
          ${icon}
        </div>
      </td>
      <td style="vertical-align: top; padding-left: 12px;">
        <p style="margin: 0 0 2px 0; font-size: 14px; font-weight: 600; color: #fff;">${title}</p>
        <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.5;">${desc}</p>
      </td>
    </tr>
  </table>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EMAIL TEMPLATES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── Welcome Email ──────────────────────────────────────────────
export const sendWelcomeEmail = async (email: string, name: string) => {
  if (!resend) {
    console.warn('RESEND_API_KEY is missing. Emails will not be sent.');
    return;
  }

  const firstName = name.split(' ')[0];

  const content = `
    <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #fff; letter-spacing: -0.02em; text-align: center;">
      Welcome aboard, ${firstName}! 🎉
    </h1>
    <p style="margin: 0 0 32px 0; font-size: 15px; color: rgba(255,255,255,0.5); line-height: 1.6; text-align: center;">
      You've just unlocked powerful tools to optimize your job search and land more interviews.
    </p>

    <!-- Features -->
    ${featureRow('📊', 'Resume Analysis', 'Upload your resume and get a detailed match score against any job posting.')}
    ${featureRow('⚡', 'ATS Optimizer', 'Check ATS compatibility and get an optimized version that beats hiring filters.')}
    ${featureRow('📄', 'CV Builder', 'Build a professional, ATS-friendly CV from scratch with smart suggestions.')}
    ${featureRow('✉️', 'Cover Letters', 'Generate tailored cover letters in seconds based on your profile.')}

    <!-- CTA -->
    ${ctaButton('Go to Your Dashboard →', 'https://rejectly.pro/dashboard')}

    <p style="margin: 28px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.3); text-align: center; line-height: 1.6;">
      Need help? Reply to this email — we read every message.
    </p>
  `;

  try {
    await resend.emails.send({
      from: 'Rejectly Pro <onboarding@rejectly.pro>',
      to: email,
      subject: `Welcome to Rejectly, ${firstName}! Your career upgrade starts now 🚀`,
      html: emailLayout(content),
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
};

// ─── Report Ready Email ─────────────────────────────────────────
export const sendReportReadyEmail = async (email: string, name: string, reportId: string, matchScore: number) => {
  if (!resend) return;

  const firstName = name.split(' ')[0];
  const scoreColor = matchScore >= 80 ? '#6EE7B7' : matchScore >= 60 ? '#FCD34D' : '#F87171';

  const content = `
    <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #fff; letter-spacing: -0.02em; text-align: center;">
      Your Report is Ready 📋
    </h1>
    <p style="margin: 0 0 32px 0; font-size: 15px; color: rgba(255,255,255,0.5); line-height: 1.6; text-align: center;">
      Hey ${firstName}, we've finished analyzing your resume. Here's your match score:
    </p>

    <!-- Score Badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 32px auto;">
      <tr>
        <td style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px 48px; text-align: center;">
          <p style="margin: 0 0 4px 0; font-size: 48px; font-weight: 800; color: ${scoreColor}; letter-spacing: -0.02em;">${matchScore}%</p>
          <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px;">Match Score</p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 0 0; font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.6; text-align: center;">
      View your full report to see detailed insights, keyword analysis, and actionable recommendations to improve your application.
    </p>

    ${ctaButton('View Full Report →', 'https://rejectly.pro/reports/' + reportId)}
  `;

  try {
    await resend.emails.send({
      from: 'Rejectly Pro <reports@rejectly.pro>',
      to: email,
      subject: `Your resume scored ${matchScore}% — see the full breakdown`,
      html: emailLayout(content),
    });
  } catch (error) {
    console.error('Failed to send report ready email:', error);
  }
};

// ─── Credits Purchased Email ────────────────────────────────────
export const sendCreditsPurchasedEmail = async (email: string, name: string, credits: number, plan: string) => {
  if (!resend) return;

  const firstName = name.split(' ')[0];

  const content = `
    <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #fff; letter-spacing: -0.02em; text-align: center;">
      Payment Confirmed ✅
    </h1>
    <p style="margin: 0 0 28px 0; font-size: 15px; color: rgba(255,255,255,0.5); line-height: 1.6; text-align: center;">
      Thanks ${firstName}! Your ${plan} plan has been activated.
    </p>

    <!-- Credits Badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 28px auto;">
      <tr>
        <td style="background: linear-gradient(135deg, rgba(53,162,159,0.15) 0%, rgba(11,102,106,0.15) 100%); border: 1px solid rgba(53,162,159,0.25); border-radius: 16px; padding: 20px 40px; text-align: center;">
          <p style="margin: 0 0 4px 0; font-size: 40px; font-weight: 800; color: #35A29F; letter-spacing: -0.02em;">+${credits}</p>
          <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px;">Credits Added</p>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.6; text-align: center;">
      You're all set. Use your credits to generate pro-level reports, optimize your resume, and create cover letters.
    </p>

    ${ctaButton('Start Using Credits →', 'https://rejectly.pro/dashboard')}
  `;

  try {
    await resend.emails.send({
      from: 'Rejectly Pro <billing@rejectly.pro>',
      to: email,
      subject: `🎉 ${credits} credits added to your account — ${plan} plan`,
      html: emailLayout(content),
    });
  } catch (error) {
    console.error('Failed to send credits purchased email:', error);
  }
};

// ─── Free Report FOMO Upsell Email ─────────────────────────────
export const sendFreeReportFOMOEmail = async (
  email: string, 
  name: string, 
  score: number, 
  reportId: string,
  missingKeywords: string[]
) => {
  if (!resend) return;

  const firstName = name.split(' ')[0];
  const scoreColor = score >= 80 ? '#6EE7B7' : score >= 60 ? '#FCD34D' : '#F87171';

  // Dynamic messaging based on score tiers
  let headline: string;
  let subtext: string;
  let urgencyMessage: string;

  if (score < 50) {
    headline = `Your resume scored ${score}% — here's why that's costing you interviews`;
    subtext = `Most ATS systems auto-reject resumes below 60%. Right now, your resume is likely being filtered out before a human ever sees it.`;
    urgencyMessage = `Every day with a ${score}% resume is another day of missed opportunities. Companies are hiring right now — but not seeing your application.`;
  } else if (score < 70) {
    headline = `You scored ${score}% — you're close, but "close" doesn't get callbacks`;
    subtext = `Your resume is in the danger zone: good enough to feel confident, but not strong enough to consistently beat other candidates.`;
    urgencyMessage = `The average successful candidate scores 80+. Closing that ${80 - score}-point gap could be the difference between silence and an interview.`;
  } else if (score < 85) {
    headline = `${score}% is solid — but your competition is scoring higher`;
    subtext = `You're ahead of most applicants, but top candidates are optimizing every detail. A few targeted improvements could push you to the top of the pile.`;
    urgencyMessage = `You're ${100 - score} points away from a near-perfect score. At this level, small optimizations make the biggest impact.`;
  } else {
    headline = `${score}% — impressive! Lock in your advantage`;
    subtext = `You're in the top tier of applicants. A Pro report will give you the exact edge to make your application undeniable.`;
    urgencyMessage = `Don't leave anything on the table. See exactly what hiring managers will focus on and fine-tune your application to perfection.`;
  }

  // Build missing keywords section
  const keywordsSection = missingKeywords.length > 0 ? `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="background: rgba(248,113,113,0.06); border: 1px solid rgba(248,113,113,0.15); border-radius: 12px; padding: 16px 20px;">
          <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #F87171; text-transform: uppercase; letter-spacing: 1px;">Missing Keywords Detected</p>
          <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6;">
            ${missingKeywords.slice(0, 6).join(' · ')}${missingKeywords.length > 6 ? ` · +${missingKeywords.length - 6} more` : ''}
          </p>
        </td>
      </tr>
    </table>
  ` : '';

  const content = `
    <!-- Score Badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px auto;">
      <tr>
        <td style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px 40px; text-align: center;">
          <p style="margin: 0 0 4px 0; font-size: 48px; font-weight: 800; color: ${scoreColor}; letter-spacing: -0.02em;">${score}%</p>
          <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px;">Your Match Score</p>
        </td>
      </tr>
    </table>

    <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em; text-align: center; line-height: 1.3;">
      ${headline}
    </h1>
    <p style="margin: 0 0 0 0; font-size: 15px; color: rgba(255,255,255,0.5); line-height: 1.6; text-align: center;">
      ${subtext}
    </p>

    ${keywordsSection}

    <!-- What Pro Unlocks -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="background: rgba(53,162,159,0.06); border: 1px solid rgba(53,162,159,0.15); border-radius: 12px; padding: 20px;">
          <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #35A29F; text-transform: uppercase; letter-spacing: 1px;">What Pro Unlocks</p>
          ${featureRow('🎯', 'AI-Optimized Resume', 'Get a rewritten, keyword-optimized version tailored to the exact job posting.')}
          ${featureRow('✉️', 'Tailored Cover Letter', 'Auto-generated cover letter that perfectly complements your resume.')}
          ${featureRow('💬', 'Outreach Message', 'Ready-to-send LinkedIn message to the hiring manager.')}
          ${featureRow('📊', 'Deep Analysis', 'Section-by-section breakdown with exact improvement suggestions.')}
        </td>
      </tr>
    </table>

    <!-- Urgency -->
    <p style="margin: 0 0 0 0; font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.6; text-align: center; font-style: italic;">
      "${urgencyMessage}"
    </p>

    ${ctaButton('Upgrade to Pro Report →', 'https://rejectly.pro/reports/' + reportId)}

    <p style="margin: 20px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.3); text-align: center;">
      Starting at just $2.99 per report · One-time payment · No subscription
    </p>
  `;

  try {
    await resend.emails.send({
      from: 'Rejectly Pro <reports@rejectly.pro>',
      to: email,
      subject: headline,
      html: emailLayout(content),
    });
  } catch (error) {
    console.error('Failed to send FOMO upsell email:', error);
  }
};
