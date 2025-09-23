import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../../../lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo', {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_demo';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  console.log(`Checkout completed for user ${userId}`);

  // Subscription will be handled by subscription.created event
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = await getUserIdFromCustomer(subscription.customer as string);
  if (!userId) return;

  const priceId = subscription.items.data[0]?.price.id;
  const tierId = mapPriceToTier(priceId);

  await supabaseAdmin
    .from('user_subscriptions')
    .upsert({
      userId,
      tierId,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
    });

  console.log(`Subscription created for user ${userId}: ${tierId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = await getUserIdFromCustomer(subscription.customer as string);
  if (!userId) return;

  const priceId = subscription.items.data[0]?.price.id;
  const tierId = mapPriceToTier(priceId);

  await supabaseAdmin
    .from('user_subscriptions')
    .update({
      tierId,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripeSubscriptionId', subscription.id);

  console.log(`Subscription updated for user ${userId}: ${tierId} (${subscription.status})`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'cancelled',
      tierId: 'free'
    })
    .eq('stripeSubscriptionId', subscription.id);

  console.log(`Subscription cancelled: ${subscription.id}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Reset usage for new billing period if this is a recurring payment
  if (invoice.billing_reason === 'subscription_cycle') {
    const userId = await getUserIdFromCustomer(invoice.customer as string);
    if (userId) {
      await supabaseAdmin.rpc('reset_user_usage', { user_id: userId });
      console.log(`Usage reset for user ${userId} - new billing period`);
    }
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const userId = await getUserIdFromCustomer(invoice.customer as string);
  if (!userId) return;

  await supabaseAdmin
    .from('user_subscriptions')
    .update({ status: 'past_due' })
    .eq('stripeCustomerId', invoice.customer as string)
    .eq('status', 'active');

  console.log(`Payment failed for user ${userId}`);
}

async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if ('metadata' in customer && customer.metadata?.userId) {
      return customer.metadata.userId;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving customer:', error);
    return null;
  }
}

function mapPriceToTier(priceId: string | undefined): string {
  // Map your Stripe price IDs to tier names
  switch (priceId) {
    case process.env.STRIPE_PRICE_BASIC:
      return 'basic';
    case process.env.STRIPE_PRICE_PLUS:
      return 'plus';
    case process.env.STRIPE_PRICE_PRO:
      return 'pro';
    default:
      return 'free';
  }
}