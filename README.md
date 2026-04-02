# BizHive

BizHive is a React + Vite application for Indian business planning, launch, compliance, community features, and the Bee AI assistant. The codebase is standardized around a single Supabase project and a single frontend service entry point at `src/services/supabase/client.ts`.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Vercel

## Project Structure

- `src/components`: UI and feature components
- `src/contexts`: auth and theme providers
- `src/hooks`: reusable client hooks
- `src/pages`: route-level screens
- `src/services`: shared backend and AI service helpers
- `supabase`: migrations, config, and edge functions

## Environment

Use a single `.env` shape for local and Vercel configuration:

```env
VITE_SUPABASE_URL=https://enpwztzdqkhzgzlhlimt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ie5MFCXfBEX4p83PhsFsTg_t6u07ukI
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is intentionally left blank in tracked config and should only be set in secure local or deployment environments when needed for admin or server-side workflows.

## Local Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Supabase

The active Supabase project is `enpwztzdqkhzgzlhlimt`.

Useful commands:

```bash
supabase login
supabase link --project-ref enpwztzdqkhzgzlhlimt
supabase db push
supabase functions deploy admin-access --no-verify-jwt
supabase functions deploy ai-tool-assist --no-verify-jwt
supabase functions deploy chat --no-verify-jwt
```

Required edge function secrets are managed in Supabase, not in this repo:

- `GOOGLE_API_KEY`
- `GEMINI_MODEL` (optional, defaults to `gemini-2.5-flash-lite`)
- `ADMIN_ACCESS_PASSWORD`

## Auth

Google OAuth and email/password auth are handled by Supabase Auth.

Configure these in the Supabase dashboard:

- Google provider enabled
- Site URL set to the deployed Vercel domain
- Redirect URLs for local development, `/dashboard`, `/email-verification`, and `/reset-password`

## Deployment

Deploy the frontend to Vercel and set the same `.env` values in the Vercel project settings. The app is configured as a single-page app, so `vercel.json` rewrites all routes to `index.html`.
