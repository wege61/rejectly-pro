import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  
  // Use Service Role Key to bypass RLS and update user data
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (event.type === 'checkout.session.completed') {
    const userId = session.metadata?.userId;
    const creditsAdded = parseInt(session.metadata?.credits || '0');
    const planType = session.metadata?.planType;

    if (userId) {
      console.log(`Processing payment for user: ${userId}, Plan: ${planType}, Credits: ${creditsAdded}`);
      
      try {
        // 1. Get current profile to update credits safely (or use RPC if available)
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('credits, subscription_status')
          .eq('id', userId)
          .single();

        if (fetchError) {
          console.error('Error fetching profile:', fetchError);
          return new NextResponse('Error fetching profile', { status: 500 });
        }

        const currentCredits = profile?.credits || 0;
        const newCredits = planType === 'subscription' ? -1 : currentCredits + creditsAdded;
        const newStatus = planType === 'subscription' ? 'active' : profile?.subscription_status;

        // 2. Update profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            credits: newCredits,
            subscription_status: newStatus,
            plan: planType === 'subscription' ? 'pro' : undefined 
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          return new NextResponse('Error updating profile', { status: 500 });
        }
        
        console.log(`Successfully updated user ${userId}: credits=${newCredits}, status=${newStatus}`);

      } catch (err) {
        console.error('Unexpected error updating profile:', err);
        return new NextResponse('Internal Server Error', { status: 500 });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
