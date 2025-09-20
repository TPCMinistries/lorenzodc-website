import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '../../../lib/supabase/client';
import { STRIPE_CONFIG, STRIPE_WEBHOOK_EVENTS } from '../../../lib/stripe/config';

const stripe = new Stripe(STRIPE_CONFIG.secretKey, {
  apiVersion: '2024-06-20',
});

// Handle Stripe webhook events
export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_CONFIG.webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED:
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_CREATED:
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED:
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED:
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_SUCCEEDED:
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED:
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const priceId = session.metadata?.price_id;

  if (!userId) {
    console.error('No user ID in session metadata');
    return;
  }

  // Get price details to determine product type
  const price = await stripe.prices.retrieve(priceId!);
  const product = await stripe.products.retrieve(price.product as string);

  if (price.type === 'recurring') {
    // Handle subscription
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await createOrUpdateSubscription(userId, subscription, session.customer as string);
  } else {
    // Handle one-time payment
    await recordOneTimePayment(userId, session, product);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer as string);

  if ('metadata' in customer && customer.metadata?.supabase_user_id) {
    await createOrUpdateSubscription(
      customer.metadata.supabase_user_id,
      subscription,
      subscription.customer as string
    );
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer as string);

  if ('metadata' in customer && customer.metadata?.supabase_user_id) {
    await createOrUpdateSubscription(
      customer.metadata.supabase_user_id,
      subscription,
      subscription.customer as string
    );
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer as string);

  if ('metadata' in customer && customer.metadata?.supabase_user_id) {
    await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('userId', customer.metadata.supabase_user_id)
      .eq('stripeSubscriptionId', subscription.id);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Update subscription status if needed
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const customer = await stripe.customers.retrieve(subscription.customer as string);

    if ('metadata' in customer && customer.metadata?.supabase_user_id) {
      await supabase
        .from('user_subscriptions')
        .update({
          status: 'active',
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('userId', customer.metadata.supabase_user_id)
        .eq('stripeSubscriptionId', subscription.id);
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // Handle failed payment - could send email notification, update subscription status, etc.
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const customer = await stripe.customers.retrieve(subscription.customer as string);

    if ('metadata' in customer && customer.metadata?.supabase_user_id) {
      await supabase
        .from('user_subscriptions')
        .update({
          status: 'past_due',
        })
        .eq('userId', customer.metadata.supabase_user_id)
        .eq('stripeSubscriptionId', subscription.id);
    }
  }
}

async function createOrUpdateSubscription(
  userId: string,
  subscription: Stripe.Subscription,
  customerId: string
) {
  const priceId = subscription.items.data[0]?.price.id;

  // Determine tier based on price ID
  let tierId = 'catalyst_basic';
  if (priceId?.includes('plus')) tierId = 'catalyst_plus';
  if (priceId?.includes('enterprise')) tierId = 'enterprise';

  await supabase
    .from('user_subscriptions')
    .upsert({
      userId: userId,
      tierId: tierId,
      status: subscription.status,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

  // Reset usage for new subscription
  await supabase.rpc('reset_user_usage', {
    user_id: userId
  });
}

async function recordOneTimePayment(
  userId: string,
  session: Stripe.Checkout.Session,
  product: Stripe.Product
) {
  // Record one-time payment in database
  await supabase
    .from('one_time_purchases')
    .insert({
      user_id: userId,
      product_name: product.name,
      amount: session.amount_total! / 100, // Convert from cents
      currency: session.currency,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      status: 'completed',
      purchased_at: new Date().toISOString(),
    });
}