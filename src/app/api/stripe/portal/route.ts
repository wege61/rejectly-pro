import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { findStripeCustomerId } from '@/lib/subscriptions';

/*
 * Opens the Stripe Customer Portal, where subscribers cancel, update their card
 * and download invoices. Cancellation and plan rules are set in the Stripe Dashboard.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // The email fallback finds subscribers from before we stored customer ids; only trust a verified address.
    const customerId = await findStripeCustomerId(user.id, user.email_confirmed_at ? user.email : null);
    if (!customerId) {
      return NextResponse.json({ error: 'No billing account found for this user.' }, { status: 404 });
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/billing`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    return NextResponse.json(
      { error: 'Could not open subscription settings. Please try again.' },
      { status: 500 }
    );
  }
}
