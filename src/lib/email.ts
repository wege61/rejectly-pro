import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is missing. Emails will not be sent.');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (email: string, name: string) => {
  if (!process.env.RESEND_API_KEY) return;
  
  try {
    await resend.emails.send({
      from: 'Rejectly Pro <onboarding@rejectly.pro>',
      to: email,
      subject: 'Welcome to Rejectly Pro! 🚀',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to Rejectly Pro, ${name}!</h1>
          <p>We're excited to help you land your dream job.</p>
          <p>You can now start optimizing your resume and beating ATS systems.</p>
          <a href="https://rejectly.pro/dashboard" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
};
