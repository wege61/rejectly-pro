import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PRICING } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import { checkoutRequestSchema, validateRequest } from '@/lib/validations';
import { hasActiveSubscription } from '@/lib/credits';
import { findStripeCustomerId } from '@/lib/subscriptions';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Validate request body
    const body = await req.json();
    const validation = validateRequest(checkoutRequestSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { priceId, successUrl, cancelUrl, mode, quantity } = validation.data;

    // Identify the plan based on priceId
    const plan = Object.values(PRICING).find((p) => p.priceId === priceId);
    
    if (!plan) {
      return new NextResponse('Invalid Price ID', { status: 400 });
    }

    // A second Pro checkout would bill the user twice for the same access.
    if (mode === 'subscription' && (await hasActiveSubscription(user.id))) {
      return NextResponse.json(
        { error: 'You already have an active Pro subscription. Manage it from the billing page.' },
        { status: 409 }
      );
    }

    // Reuse the user's Stripe customer so every purchase shows up in one billing portal.
    const customerId = await findStripeCustomerId(user.id);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: mode as 'subscription' | 'payment',
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...(customerId ? { customer: customerId } : { customer_email: user.email }),
      ...(mode === 'subscription' && { subscription_data: { metadata: { userId: user.id } } }),
      metadata: {
        userId: user.id,
        credits: plan.credits.toString(),
        planType: plan.type,
        planName: plan.name,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}
