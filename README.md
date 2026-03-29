# BizHive

BizHive is a React + Vite application for Indian business planning, launch, compliance, document workflows, community features, and the Bee AI assistant.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Vercel

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file from the example:

```bash
cp .env.example .env
```

3. Start the app:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Environment Variables

The frontend requires these variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Use the active Supabase project for this deployment:

- Supabase project URL: `https://enpwztzdqkhzgzlhlimt.supabase.co`
- Production site: `https://biz-hive-six.vercel.app`

## Supabase

This repository already contains the Supabase project structure under [`supabase`](./supabase).

Useful commands:

```bash
supabase login
supabase link --project-ref enpwztzdqkhzgzlhlimt
supabase db push
supabase functions deploy chat --no-verify-jwt
supabase functions deploy ai-tool-assist --no-verify-jwt
```

## Auth Requirements

Google OAuth and email/password signup are handled by Supabase Auth.

Required auth configuration:

- Site URL: `https://biz-hive-six.vercel.app`
- Allowed redirects should include local development and production routes used by login, signup verification, dashboard, and password reset
- Google provider must be enabled in Supabase Auth

## Bee AI

Bee AI runs through the Supabase Edge Function at [`supabase/functions/chat`](./supabase/functions/chat).

To make Bee AI answer requests, set this Supabase secret:

```bash
supabase secrets set GOOGLE_API_KEY=your_gemini_api_key
```

Without `GOOGLE_API_KEY`, the Bee AI function will deploy but return an error at runtime.

## Deployment

The frontend is designed to deploy on Vercel.

Set the same frontend environment variables in Vercel Project Settings:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Ownership

This project is fully operable from GitHub, Supabase, Vercel, and a local IDE. No Lovable subscription or Lovable-managed workflow is required to develop, deploy, or maintain BizHive.
