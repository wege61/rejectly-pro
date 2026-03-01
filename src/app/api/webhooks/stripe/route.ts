import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function POST(req: Request) {
  console.log('--- STRIPE WEBHOOK RECEIVED ---');
  let body: string;
  try {
    body = await req.text();
    console.log(`Webhook Body parsed, length: ${body.length}`);
  } catch (err: any) {
    console.error('Failed to parse webhook body:', err.message);
    return new NextResponse(`Body Parse Error: ${err.message}`, { status: 400 });
  }

  const signature = (await headers()).get('Stripe-Signature') as string;
  console.log(`Stripe-Signature header present: ${!!signature}`);

  if (!signature) {
    console.error('Missing Stripe-Signature header');
    return new NextResponse('Missing signature', { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable. Please configure it in .env.local');
    return new NextResponse('Server configuration error: Webhook secret missing', { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log(`Webhook event constructed successfully. Type: ${event.type}`);
  } catch (error: any) {
    console.error('Stripe Webhook signature verification failed:', error.message);
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
        if (planType === 'subscription') {
          // Handle Pro Subscription
          // 1. Check if a subscription record already exists
          const { data: existingSub, error: subFetchError } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', userId)
            .single();

          if (subFetchError && subFetchError.code !== 'PGRST116') { // PGRST116 is not found
            console.error('Error fetching subscription:', subFetchError);
            return new NextResponse('Error fetching subscription', { status: 500 });
          }

          // We'll give them 1 month of access from now for simplify, 
          // Stripe handles recurrent webhook but this is just checkout.session.completed
          // For real, we should read period_end from Stripe or handle 'customer.subscription.created'
          // We will use 1 month as fallback if Stripe's period isn't immediately available here 
          // but better is reading from the session or stripe customer
          
          const currentPeriodStart = new Date();
          const currentPeriodEnd = new Date();
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

          if (existingSub) {
            // Update existing subscription
            const { error: updateError } = await supabase
              .from('subscriptions')
              .update({
                status: 'active',
                plan: 'pro',
                current_period_start: currentPeriodStart.toISOString(),
                current_period_end: currentPeriodEnd.toISOString(),
              })
              .eq('user_id', userId);

            if (updateError) {
              console.error('Error updating subscription:', updateError);
              return new NextResponse('Error updating subscription', { status: 500 });
            }
          } else {
            // Create new subscription
            const { error: insertError } = await supabase
              .from('subscriptions')
              .insert({
                user_id: userId,
                status: 'active',
                plan: 'pro',
                current_period_start: currentPeriodStart.toISOString(),
                current_period_end: currentPeriodEnd.toISOString(),
              });

            if (insertError) {
              console.error('Error creating subscription:', insertError);
              return new NextResponse('Error creating subscription', { status: 500 });
            }
          }
          console.log(`Successfully activated subscription for user ${userId}`);

        } else if (creditsAdded > 0) {
          // Handle One-Time Credits Purchase
          // Check if user has credits record
          const { data: existingCredits, error: creditsFetchError } = await supabase
            .from('user_credits')
            .select('credits')
            .eq('user_id', userId)
            .single();

          if (creditsFetchError && creditsFetchError.code !== 'PGRST116') {
            console.error('Error fetching credits:', creditsFetchError);
            return new NextResponse('Error fetching credits', { status: 500 });
          }

          if (existingCredits) {
            // Update existing credits
            const { error: updateError } = await supabase
              .from('user_credits')
              .update({ credits: existingCredits.credits + creditsAdded })
              .eq('user_id', userId);

            if (updateError) {
              console.error('Error updating credits:', updateError);
              return new NextResponse('Error updating credits', { status: 500 });
            }
          } else {
            // Create new credits record
            const { error: insertError } = await supabase
              .from('user_credits')
              .insert({
                user_id: userId,
                credits: creditsAdded
              });

            if (insertError) {
              console.error('Error creating credits record:', insertError);
              return new NextResponse('Error creating credits record', { status: 500 });
            }
          }
          console.log(`Successfully added ${creditsAdded} credits for user ${userId}`);
        }

        // Also update payments table for the record
        const amountTotal = session.amount_total || 0;
        const currency = session.currency || 'usd';
        
        await supabase
          .from('payments')
          .insert({
            user_id: userId,
            stripe_session_id: session.id,
            amount_cents: amountTotal,
            currency: currency,
            status: 'success'
          });

      } catch (err) {
        console.error('Unexpected error processing webhook:', err);
        return new NextResponse('Internal Server Error', { status: 500 });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
