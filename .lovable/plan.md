

# BizHive: Full-Stack Feature Build -- Phased Master Plan

## Current State Assessment

The app is a static Indian startup platform with 15+ pages, all using hardcoded mockup data. No backend, no database, no authentication, no real AI. Every page is a static form or informational card that saves to localStorage at best.

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│  Pages / Tools / AI Chat / Dashboards / Community    │
└──────────────────────┬──────────────────────────────┘
                       │
              Supabase Client SDK
                       │
┌──────────────────────┴──────────────────────────────┐
│              LOVABLE CLOUD (Supabase)                │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Auth   │  │  PostgreSQL  │  │ Edge Functions │  │
│  │(email+   │  │  (all user   │  │ (AI gateway,   │  │
│  │ Google)  │  │   data)      │  │  PDF gen, etc) │  │
│  └──────────┘  └──────────────┘  └───────┬───────┘  │
│                                          │           │
│                              Lovable AI Gateway      │
│                          (Gemini 3 Flash Preview)    │
└──────────────────────────────────────────────────────┘
```

---

## Data Flow -- How Tools Connect (The Daisy Chain)

```text
User Profile (industry, stage, location)
       │
       ├──► AI Assistant (context-aware, knows your business)
       │
       ├──► Market Research ──► feeds into ──► Business Plan
       │                                          │
       ├──► SWOT Analysis ──► feeds into ─────────┤
       │                                          │
       ├──► Business Canvas ──► feeds into ───────┤
       │                                          │
       │                                    Business Plan
       │                                          │
       ├──► Financial Calculator ◄── pulls from ──┤
       │         │                                │
       │         ▼                                │
       ├──► Startup Calculator ──► feeds into ──► Funding Matcher
       │                                          │
       ├──► Legal Compliance Tracker ◄── based on business type
       │         │
       │         ▼
       ├──► Launch Checklist (auto-generated from all above)
       │         │
       │         ▼
       └──► Dashboard (unified view of everything)
```

Every tool's output is saved to the database and becomes input context for downstream tools and the AI assistant. The AI assistant can read all your saved data to give contextual advice.

---

## PHASE 1: Foundation (Backend + Auth + Core Data)

**Goal**: Set up Lovable Cloud, auth, and the core database schema that everything else depends on.

### 1a. Enable Lovable Cloud + Database Schema
- Enable Lovable Cloud for the project
- Create tables:
  - `profiles` (extends auth.users -- name, phone, avatar, business_stage, industry, state)
  - `user_roles` (role enum: user/premium/admin)
  - `businesses` (user's business details -- name, type, structure, industry, description, stage)
  - `saved_tools` (polymorphic store for all tool outputs -- tool_type enum, data JSONB, user_id, business_id)
  - `documents` (template library -- title, description, category, file_url, is_premium, download_count)
  - `user_documents` (user's saved/generated documents)
- RLS policies on all tables (users can only access their own data)

### 1b. Authentication System
- Replace mock Login/Register page with real Supabase Auth (email + password)
- Add Google OAuth
- Create onboarding flow: after signup, collect business_stage, industry, state
- Protected routes: tools that save data require login
- Auth context provider with session management
- Profile page for managing account details

### 1c. User Dashboard
- New `/dashboard` page (post-login home)
- Shows: business profile summary, recent tool activity, progress tracker, quick actions
- Replaces the generic homepage hero for logged-in users

**Error handling**: Auth errors surface via toast notifications. Network failures retry 3x with exponential backoff via React Query. All form submissions validate with Zod before hitting the API.

---

## PHASE 2: AI Integration (The Brain)

**Goal**: Make the AI Assistant real and embed AI capabilities across all tools.

### 2a. Core AI Edge Function
- Create `supabase/functions/chat/index.ts` using Lovable AI Gateway
- System prompt: "You are BizHive AI, an expert on Indian business startup, legal compliance, taxation, funding, and growth. You have access to the user's business context."
- Streaming SSE responses with token-by-token rendering
- Handle 429/402 errors with user-friendly messages
- Install `react-markdown` for rendering AI responses

### 2b. Upgrade AI Assistant Page
- Replace mock chat with real streaming AI chat
- Send user's business profile + saved tool data as context with each message
- Conversation history persisted in `chat_messages` table
- Quick actions actually trigger AI workflows:
  - "Business Ideas" → AI generates ideas based on user's industry/location
  - "Market Analysis" → AI analyzes market based on saved market research
  - "Business Plans" → AI drafts sections using saved canvas/SWOT data
  - "Financial Planning" → AI reviews saved financial data and suggests improvements

### 2c. AI-Powered Tool Enhancements (Edge Functions per use case)
- `supabase/functions/ai-market-research/index.ts` -- Given industry + location, generates competitor analysis, market size estimates, trend data
- `supabase/functions/ai-business-plan/index.ts` -- Given all saved tool data, generates complete business plan sections
- `supabase/functions/ai-legal-advisor/index.ts` -- Given business type + state, generates compliance checklist, required licenses
- `supabase/functions/ai-financial-advisor/index.ts` -- Given financial data, generates projections, identifies risks, suggests optimizations

**Fail-proofing**: Each edge function validates input with Zod, returns structured errors. Frontend shows loading skeletons during AI calls. If AI fails, cached/manual data is still usable. Rate limit errors show "Try again in X seconds" with countdown.

---

## PHASE 3: Smart Tools (Replace All Mockups)

**Goal**: Every tool saves to DB, loads saved data, and has AI-assist buttons.

### 3a. Business Model Canvas
- Save/load from `saved_tools` table instead of localStorage
- "AI Suggest" button on each of the 9 sections (sends business profile context to AI, gets suggestions)
- Auto-save with debounce (2s after last keystroke)
- Version history (save snapshots, compare changes)
- Export as PDF (edge function generates styled PDF)
- Data feeds into Business Plan generator

### 3b. SWOT Analysis
- Same save/load pattern as Canvas
- "AI Analyze" button: AI generates SWOT based on industry + competitors from market research
- Strategic Action Items section becomes AI-generated (SO/WO/ST/WT strategies)
- Visual quadrant chart using Recharts
- Data feeds into Business Plan and AI context

### 3c. Market Research
- "AI Research" button on each tab:
  - Target Market → AI estimates market size, demographics for given industry + location
  - Competitors → AI finds and analyzes competitors (using web search context in prompt)
  - Market Demand → AI assesses demand trends
  - Economic Viability → AI calculates projections from inputs
- Save all research data to DB
- Data feeds into Business Plan, Financial Calculator, and AI context

### 3d. Financial Calculator + Startup Calculator
- Save/load from DB
- "AI Optimize" button: AI reviews expenses and suggests cuts, reviews revenue and suggests growth strategies
- Interactive charts (Recharts) for revenue vs expenses over time, break-even visualization
- Data feeds into Business Plan financial section and Funding Matcher

### 3e. Business Plan Generator
- "AI Generate" button on each section that pulls from all saved tool data:
  - Executive Summary ← business profile + canvas
  - Market Analysis ← market research data
  - Financial Plan ← calculator data
  - Marketing Strategy ← AI generates based on industry + budget
- "Generate Full Plan" button: AI writes complete plan from all available data
- Export as professional PDF
- Save versions, track completeness percentage

---

## PHASE 4: Legal & Taxation Intelligence

**Goal**: Replace static legal/tax content with dynamic, personalized guidance.

### 4a. Smart Legal Compliance Engine
- Database table `compliance_requirements` seeded with Indian business compliance data (business type → required registrations, licenses, permits)
- Given user's business type + state + industry, auto-generate personalized compliance checklist
- Each item: name, description, deadline, authority, cost estimate, apply link
- Track completion status per user in `user_compliance` table
- "AI Legal Advisor" button: ask questions about specific compliance items
- Deadline reminders (shown on dashboard)

### 4b. Smart Taxation Module
- Tax calculators work with real formulas (already partially done)
- Add New Tax Regime vs Old Tax Regime comparison
- AI tax advisor: "Based on your business structure and projected revenue, here's your optimal tax strategy"
- GST rate finder: user describes product/service, AI returns applicable GST rate with HSN/SAC code
- Compliance calendar: auto-populated deadlines based on business type

### 4c. Document Library
- Seed `documents` table with real template metadata
- Documents stored in Supabase Storage
- Search, filter, download tracking all from DB
- "AI Fill" feature: AI pre-fills document templates using saved business data
- Premium documents gated behind user role check

---

## PHASE 5: Incubators, Funding & Launch

**Goal**: Replace hardcoded incubator/funding data with a searchable database and AI-powered matching.

### 5a. Incubator & Funding Database
- Tables: `incubators` (name, location, focus, funding_range, application_url, deadline, etc.), `government_schemes` (name, eligibility, benefits, application_process)
- Seed with real Indian incubator and government scheme data
- Search + filter by location, industry, funding stage, business type
- "AI Match" button: AI recommends best incubators/schemes based on user's business profile

### 5b. Pitch Deck Builder (New Tool)
- Guided step-by-step pitch deck creation
- AI generates slide content from saved business plan data
- Sections: Problem, Solution, Market, Business Model, Traction, Team, Financials, Ask
- Export as structured data (PDF generation via edge function)

### 5c. Launch Checklist Engine
- Auto-generate personalized launch checklist from:
  - Business type → required legal steps
  - Financial data → funding status
  - Business plan → marketing readiness
  - Compliance tracker → legal readiness
- Interactive checklist with progress tracking saved to DB
- AI suggests missing steps based on business profile

---

## PHASE 6: Community & Engagement

**Goal**: Add real community features and engagement mechanics.

### 6a. Blog with Real Content
- `blog_posts` table (title, content, author, category, tags, published_at)
- Admin can create/edit posts (admin role check)
- Blog detail page with markdown rendering
- AI-assisted blog writing for admin

### 6b. Community Features
- Discussion forums: `forum_posts`, `forum_comments` tables
- Categorized by topic (legal, funding, marketing, etc.)
- Upvote/downvote system
- "Find Co-founders" → user profiles with skills, looking-for fields, matchmaking

### 6c. Notifications & Progress
- `notifications` table for deadline reminders, new scheme alerts, community replies
- In-app notification bell in navbar
- Progress tracking: "Your business readiness score" based on completed tools/steps
- Email notifications via edge function (optional, future)

---

## PHASE 7: Polish & Production Readiness

**Goal**: Performance, error handling, and production-grade UX.

### 7a. Global Error & Loading States
- Error boundaries on all route components
- Skeleton loading states on all data-fetching pages
- Offline detection with "You're offline" banner
- React Query retry logic with exponential backoff on all queries
- Toast notifications for all user actions (save, delete, error)

### 7b. Performance
- Lazy-load all route components with React.lazy + Suspense
- Image optimization
- Database indexes on frequently queried columns

### 7c. Mobile Optimization
- Review all pages for mobile responsiveness
- Touch-friendly interactions
- Mobile-optimized AI chat interface

### 7d. Analytics & Monitoring
- Track tool usage, popular features, user journeys
- Error logging to console (Supabase edge function logs)

---

## Implementation Order & Dependencies

```text
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4
                                       │
                                       ▼
                              Phase 5 ──► Phase 6 ──► Phase 7
```

Phase 1 is the absolute prerequisite. Phase 2 (AI) should come before Phase 3 because the AI-assist buttons are what make the tools special. Phases 4-5 can partially parallelize. Phase 6-7 are polish.

---

## Key Design Decisions

1. **Single AI gateway model**: All AI calls go through Lovable AI Gateway (Gemini 3 Flash Preview) via edge functions. No direct client-side AI calls.
2. **JSONB for tool data**: `saved_tools` table uses JSONB column so each tool type can store different shapes without schema changes.
3. **Context propagation**: Every AI call includes the user's business profile + relevant saved tool data as system context. This is the "daisy chain" -- your market research informs your business plan which informs your pitch deck.
4. **Graceful degradation**: Every feature works without AI (manual input). AI is an accelerator, not a requirement.
5. **No external APIs beyond Lovable AI**: All intelligence comes through the Lovable AI Gateway. No Stripe, no external search APIs. Keeps it simple and cost-effective.

---

## Shall we begin with Phase 1?

This is a large undertaking. Each phase will take multiple implementation messages. I recommend we start with Phase 1a (enable Lovable Cloud + create database schema), then 1b (auth), then 1c (dashboard), completing the foundation before moving to AI.

