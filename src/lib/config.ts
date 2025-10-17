// Site Configuration
export const config = {
    site: {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      name: process.env.NEXT_PUBLIC_APP_NAME || 'Rejectly.pro',
    },
    
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    },
    
    openai: {
      apiKey: process.env.OPENAI_API_KEY!,
    },
    
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      secretKey: process.env.STRIPE_SECRET_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    },
    
    email: {
      resendApiKey: process.env.RESEND_API_KEY,
    },
    
    // Feature Flags
    features: {
      enableAnalytics: process.env.NODE_ENV === 'production',
      enableEmail: !!process.env.RESEND_API_KEY,
    },
  } as const;
  
  // Validation helper
  export function validateEnv() {
    const required = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'OPENAI_API_KEY',
      'STRIPE_SECRET_KEY',
    ];
  
    const missing = required.filter((key) => !process.env[key]);
  
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables:\n${missing.join('\n')}`
      );
    }
  }