import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PRICING } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { priceId, successUrl, cancelUrl, mode = 'subscription', quantity = 1 } = await req.json();

    if (!priceId || !successUrl || !cancelUrl) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    if (priceId.includes('price_1Q...') || priceId.startsWith('price_1Q')) {
      return new NextResponse('Invalid Price ID. Please configure Stripe Price IDs in .env.local', { status: 400 });
    }

    // Identify the plan based on priceId
    const plan = Object.values(PRICING).find((p) => p.priceId === priceId);
    
    if (!plan) {
      return new NextResponse('Invalid Price ID', { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: mode as 'subscription' | 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        credits: plan.credits.toString(),
        planType: plan.type,
        planName: plan.name,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
