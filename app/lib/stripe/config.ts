// Stripe configuration and pricing IDs
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
};

// Subscription Product IDs (these would be created in Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  // Monthly Subscriptions
  catalyst_basic_monthly: process.env.NEXT_PUBLIC_STRIPE_CATALYST_BASIC_MONTHLY || 'price_catalyst_basic_monthly',
  catalyst_plus_monthly: process.env.NEXT_PUBLIC_STRIPE_CATALYST_PLUS_MONTHLY || 'price_catalyst_plus_monthly',
  enterprise_monthly: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',

  // Annual Subscriptions (with discount)
  catalyst_basic_annual: process.env.NEXT_PUBLIC_STRIPE_CATALYST_BASIC_ANNUAL || 'price_catalyst_basic_annual',
  catalyst_plus_annual: process.env.NEXT_PUBLIC_STRIPE_CATALYST_PLUS_ANNUAL || 'price_catalyst_plus_annual',
  enterprise_annual: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_ANNUAL || 'price_enterprise_annual',

  // One-Time Products
  personal_strategy_session: process.env.NEXT_PUBLIC_STRIPE_PERSONAL_STRATEGY || 'price_personal_strategy_session',
  enterprise_strategy_intensive: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_STRATEGY || 'price_enterprise_strategy_intensive',
  implementation_workshop: process.env.NEXT_PUBLIC_STRIPE_IMPLEMENTATION_WORKSHOP || 'price_implementation_workshop',
};

// Product definitions for the frontend
export const PRICING_PLANS = {
  catalyst_basic: {
    id: 'catalyst_basic',
    name: 'Catalyst Basic',
    description: 'Perfect for getting started with AI coaching',
    monthlyPrice: 19,
    annualPrice: 190, // 17% discount
    monthlyPriceId: STRIPE_PRICE_IDS.catalyst_basic_monthly,
    annualPriceId: STRIPE_PRICE_IDS.catalyst_basic_annual,
    features: [
      '150 coaching conversations per month',
      'Full memory & coaching personality',
      'Personal goal tracking & accountability',
      'Progress dashboards & analytics',
      'Assessment-driven insights',
      'Email support'
    ],
    limits: {
      monthlyMessages: 150,
      goals: 10,
      assessments: 'unlimited'
    }
  },
  catalyst_plus: {
    id: 'catalyst_plus',
    name: 'Catalyst Plus',
    description: 'For power users who want unlimited coaching',
    monthlyPrice: 39,
    annualPrice: 390, // 17% discount
    monthlyPriceId: STRIPE_PRICE_IDS.catalyst_plus_monthly,
    annualPriceId: STRIPE_PRICE_IDS.catalyst_plus_annual,
    features: [
      'Unlimited coaching conversations',
      'Everything in Basic',
      'Priority support',
      'Advanced analytics & insights',
      'Custom coaching styles',
      'Early access to new features'
    ],
    limits: {
      monthlyMessages: 'unlimited',
      goals: 'unlimited',
      assessments: 'unlimited'
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and organizations',
    monthlyPrice: 297,
    annualPrice: 2970, // 17% discount
    monthlyPriceId: STRIPE_PRICE_IDS.enterprise_monthly,
    annualPriceId: STRIPE_PRICE_IDS.enterprise_annual,
    features: [
      'Everything in Plus',
      'Team collaboration features',
      'ROI tools & implementation roadmaps',
      'Monthly strategy calls',
      'Custom integrations',
      'Dedicated account manager'
    ],
    limits: {
      monthlyMessages: 'unlimited',
      goals: 'unlimited',
      assessments: 'unlimited',
      teamMembers: 'unlimited'
    }
  }
};

// One-time products
export const ONE_TIME_PRODUCTS = {
  personal_strategy: {
    id: 'personal_strategy',
    name: 'Personal Strategy Session',
    description: 'Deep-dive assessment with personalized roadmap',
    price: 197,
    priceId: STRIPE_PRICE_IDS.personal_strategy_session,
    features: [
      '1-hour strategy call with AI expert',
      'Custom 90-day action plan',
      'Personalized tool recommendations',
      'Written strategic assessment report'
    ]
  },
  enterprise_strategy: {
    id: 'enterprise_strategy',
    name: 'Enterprise Strategy Intensive',
    description: 'Comprehensive organizational AI assessment',
    price: 1997,
    priceId: STRIPE_PRICE_IDS.enterprise_strategy_intensive,
    features: [
      'Complete organizational AI audit',
      'Custom 90-day implementation roadmap',
      'ROI projections & financial modeling',
      'Tool recommendations & vendor evaluation',
      'Executive presentation materials'
    ]
  },
  implementation_workshop: {
    id: 'implementation_workshop',
    name: 'Implementation Workshop',
    description: '3-day intensive with your team',
    price: 4997,
    priceId: STRIPE_PRICE_IDS.implementation_workshop,
    features: [
      'Everything in Strategy Intensive',
      '3-day on-site implementation workshop',
      'Team training & change management',
      'Hands-on tool setup & integration',
      '30-day follow-up support included'
    ]
  }
};

// Success and cancel URLs
export const STRIPE_URLS = {
  success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing`,
};

// Webhook event types we handle
export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
} as const;