import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
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
  const supabase = await createClient(); // We need a service role client here ideally, but for now assuming user metadata handles linking 

  // In a real app, you should use the SERVICE_ROLE_KEY to bypass RLS and update user tables.
  // For now, let's just log the events to confirm it works.
  
  if (event.type === 'checkout.session.completed') {
    const userId = session.metadata?.userId;
    console.log(`Payment successful for user: ${userId}`);
    // TODO: Update user subscription status in Supabase
    // await supabase.from('profiles').update({ is_pro: true }).eq('id', userId);
  }

  return new NextResponse(null, { status: 200 });
}
