/**
 * Command Center Webhook Integration
 *
 * Sends events from Perpetual Core to LDC Command Center
 * for lead tracking and pipeline management.
 */

import crypto from 'crypto'

const COMMAND_CENTER_WEBHOOK_URL = process.env.COMMAND_CENTER_WEBHOOK_URL || 'https://your-command-center.vercel.app/api/webhooks/perpetual-core'
const WEBHOOK_SECRET = process.env.COMMAND_CENTER_WEBHOOK_SECRET || 'pc_webhook_secret_change_me'

interface AssessmentData {
  user_id?: string
  email: string
  name?: string
  score: number
  tier: 'foundations' | 'pilot_ready' | 'scale_path' | 'acceleration'
  gaps: string[]
  dimensions: Record<string, number>
  completed_at: string
}

interface SubscriptionData {
  user_id?: string
  email: string
  name?: string
  plan: 'assessment' | 'core' | 'enterprise'
  amount: number
  stripe_customer_id?: string
  stripe_subscription_id?: string
  created_at: string
}

interface BookingData {
  user_id?: string
  email: string
  name?: string
  booking_type: string
  scheduled_at: string
  notes?: string
}

type WebhookEvent =
  | { event: 'assessment.completed'; data: AssessmentData }
  | { event: 'subscription.created'; data: SubscriptionData }
  | { event: 'subscription.upgraded'; data: SubscriptionData }
  | { event: 'subscription.cancelled'; data: SubscriptionData }
  | { event: 'booking.created'; data: BookingData }

function generateSignature(payload: string): string {
  return crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')
}

async function sendWebhook(event: WebhookEvent): Promise<{ success: boolean; error?: string }> {
  // Skip in development if no URL configured
  if (!COMMAND_CENTER_WEBHOOK_URL || COMMAND_CENTER_WEBHOOK_URL.includes('your-command-center')) {
    console.log('[Command Center Webhook] Skipping - URL not configured')
    console.log('[Command Center Webhook] Event:', event.event, event.data)
    return { success: true }
  }

  try {
    const payload = JSON.stringify(event)
    const signature = generateSignature(payload)

    const response = await fetch(COMMAND_CENTER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-perpetual-signature': signature,
      },
      body: payload,
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[Command Center Webhook] Error:', error)
      return { success: false, error }
    }

    const result = await response.json()
    console.log('[Command Center Webhook] Success:', result)
    return { success: true }
  } catch (error) {
    console.error('[Command Center Webhook] Failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Send assessment completion event to Command Center
 */
export async function notifyAssessmentCompleted(data: AssessmentData) {
  return sendWebhook({
    event: 'assessment.completed',
    data,
  })
}

/**
 * Send subscription created event to Command Center
 */
export async function notifySubscriptionCreated(data: SubscriptionData) {
  return sendWebhook({
    event: 'subscription.created',
    data,
  })
}

/**
 * Send subscription upgraded event to Command Center
 */
export async function notifySubscriptionUpgraded(data: SubscriptionData) {
  return sendWebhook({
    event: 'subscription.upgraded',
    data,
  })
}

/**
 * Send subscription cancelled event to Command Center
 */
export async function notifySubscriptionCancelled(data: SubscriptionData) {
  return sendWebhook({
    event: 'subscription.cancelled',
    data,
  })
}

/**
 * Send booking created event to Command Center
 */
export async function notifyBookingCreated(data: BookingData) {
  return sendWebhook({
    event: 'booking.created',
    data,
  })
}

/**
 * Helper to determine assessment tier from score
 */
export function getAssessmentTier(score: number): 'foundations' | 'pilot_ready' | 'scale_path' | 'acceleration' {
  if (score <= 15) return 'foundations'
  if (score <= 30) return 'pilot_ready'
  if (score <= 40) return 'scale_path'
  return 'acceleration'
}

/**
 * Helper to identify top gaps from dimension scores
 */
export function getTopGaps(dimensions: Record<string, number>, count = 3): string[] {
  return Object.entries(dimensions)
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([dimension]) => dimension)
}
