import { loadStripe, Stripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from './config';

let stripePromise: Promise<Stripe | null>;

// Initialize Stripe
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

// Create a checkout session for subscriptions
export async function createCheckoutSession(priceId: string, customerId?: string) {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Create a billing portal session for existing customers
export async function createBillingPortalSession(customerId: string) {
  try {
    const response = await fetch('/api/stripe/create-billing-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create billing portal session');
    }

    const { url } = await response.json();

    // Redirect to Stripe billing portal
    window.location.href = url;
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    throw error;
  }
}

// Get customer subscription status
export async function getCustomerSubscription(customerId: string) {
  try {
    const response = await fetch(`/api/stripe/customer-subscription?customerId=${customerId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching customer subscription:', error);
    return null;
  }
}

// Cancel subscription at period end
export async function cancelSubscription(subscriptionId: string) {
  try {
    const response = await fetch('/api/stripe/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
}

// Resume subscription (remove cancel_at_period_end)
export async function resumeSubscription(subscriptionId: string) {
  try {
    const response = await fetch('/api/stripe/resume-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to resume subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error resuming subscription:', error);
    throw error;
  }
}