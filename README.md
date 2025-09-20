# Enterprise AI Platform – Next.js Scaffold

This repository contains a production-ready scaffold for an enterprise AI platform built with Next.js 14, TypeScript, Tailwind CSS, and serverless API routes. It is designed to support both individual users and enterprise customers with tools like a readiness diagnostic, ROI simulator, RAG sandbox, blueprint library, and a contact form that posts leads to your CRM.

## Features

- **Home Page** with clear calls to action to try the AI chat, get an AI readiness score, or book an executive briefing.
- **Enterprise Hub** summarising all executive tools: diagnostic, ROI simulator, bring-your-own-docs RAG demo, and a blueprint library.
- **Diagnostic** page with a 10‑question slider form that calculates a score, tier, and roadmap via a serverless route.
- **ROI Simulator** to estimate hours saved, monthly savings, and payback period based on team size and time saved per task.
- **RAG Demo** to upload a PDF and ask questions about it (demo stub returns a placeholder response).
- **Blueprint Library** providing simple recipes for common roles (Sales, HR, Finance, Comms).
- **Contact Form** that POSTs JSON to a configurable CRM webhook.
- **Environment variables** for auth (OIDC via Auth.js), LLM provider keys (Gemini or OpenAI), Resend email API key, and CRM webhook.
- **TailwindCSS** integrated with PostCSS and a minimalist theme.
- **Typed API routes** using Next.js `app/api` convention.
- **Extensible**: easily connect your RAG store (S3/GCS), swap LLM providers, integrate SSO, or add storage for chat history and metrics.

## Getting Started

1. **Install dependencies**:

   ```bash
   pnpm install  # or npm install / yarn
   ```

2. **Create your `.env.local` file**:

   ```bash
   cp .env.example .env.local
   # fill in your API keys and endpoints
   ```

3. **Run the development server**:

   ```bash
   pnpm dev
   ```

   The app will be available at http://localhost:3000.

4. **Deploy to Vercel** (recommended): import this repo, set environment variables, and deploy. You can also deploy to other platforms that support Next.js 14 with Edge runtime.

## Customisation

- **Branding**: modify `app/layout.tsx` and `tailwind.config.ts` to change the colour palette, fonts, and navigation.
- **RAG Storage**: replace the stub in `app/api/rag/upload/route.ts` and `app/api/rag/query/route.ts` with code that uploads files to a storage service and runs queries against your vector store.
- **LLM Providers**: set `LLM_PROVIDER` and corresponding keys in `.env.local`. Update `/api/llm` endpoints if you add new providers.
- **CRM Integration**: set `CRM_WEBHOOK_URL` to a webhook that accepts JSON payloads for new leads.
- **Analytics / Sentry**: configure `NEXT_PUBLIC_ANALYTICS_ID` and `SENTRY_DSN` to monitor usage and errors.

## License

This scaffold is provided as-is without warranty. Adapt and extend it according to your needs.