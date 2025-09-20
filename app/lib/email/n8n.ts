// app/lib/email/n8n.ts

export type EmailPayload = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  filename: string;
  pdfBase64: string; // must be base64
};

const N8N_URL = process.env.N8N_EMAIL_WEBHOOK_URL!;
const N8N_SECRET = process.env.N8N_EMAIL_SECRET!;

/** Sends an email+PDF via your secured n8n webhook. */
export async function sendViaN8N(
  payload: EmailPayload,
  timeoutMs = 15000
): Promise<void> {
  if (!N8N_URL) throw new Error("N8N_EMAIL_WEBHOOK_URL is not set");
  if (!N8N_SECRET) throw new Error("N8N_EMAIL_SECRET is not set");
  if (!payload.to || !payload.subject || !payload.filename || !payload.pdfBase64) {
    throw new Error("Missing required fields (to, subject, filename, pdfBase64)");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const r = await fetch(N8N_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-n8n-secret": N8N_SECRET,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!r.ok) {
      const errTxt = await r.text().catch(() => "");
      throw new Error(`n8n ${r.status} ${errTxt}`.trim());
    }
  } finally {
    clearTimeout(timer);
  }
}
