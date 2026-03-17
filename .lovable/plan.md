# BizHive Major Update Plan

This addresses all your requests across multiple areas. Here's the consolidated plan:

---

## 1. Fix Admin Login Credentials

**Problem**: The `handle_new_user` trigger assigns `'user'` role to everyone. The admin email never gets the `'admin'` role.

**Fix**: Run a migration that:

- Checks if a user with `kaleidis.official@gmail.com` exists in `auth.users`
- If yes, inserts `('admin')` into `user_roles` for that user
- Creates a trigger so that when this specific email registers, they automatically get the admin role
- This ensures the credentials work on first login after registration

---

## 2. Fix Google Login

**Problem**: The `lovable.auth.signInWithOAuth("google", ...)` call uses `redirect_uri: window.location.origin` but on Vercel custom domains the OAuth callback may not match.

**Fix**: Update `Login.tsx` to use `redirect_uri: window.location.origin` consistently and ensure the callback works. The Lovable Cloud managed Google OAuth should work — we need to verify the redirect is correct and add error handling.

---

## 3. Redesign Logo

Replace the current `BeeIcon` (bee SVG) with a cleaner, more professional hexagonal hive + bee mark. Update it in:

- `BeeIcon.tsx` — new SVG design
- `Navigation.tsx` — logo area
- `Footer.tsx` — footer logo
- Favicon

---

## 4. AI Assistant — Full Page + Panel Modes

**New architecture:**

- Add `/ai-assistant` route back with a full-page chat view showing chat history (sessions from `chat_messages` table)
- Add "Bee AI" link in the Navigation bar
- **Desktop**: BeePanel stays as right-side panel on same layer (not overlay — integrate into layout using flex)
- **Mobile**: BeePanel opens as bottom 1/3 sheet instead of full-width side sheet
- Use `useIsMobile()` hook to switch behavior

**Changes:**

- `Layout.tsx` — on desktop, render BeePanel inline (flex layout with main content)
- `BeePanel.tsx` — mobile: bottom sheet (1/3 height); desktop: right column
- `AIAssistant.tsx` — full page with chat history list + active chat
- `App.tsx` — re-add `/ai-assistant` route

---

## 5. Text Selection Tooltip — Restrict to Relevant Content

**Fix**: Only activate `TextSelectionTooltip` when text is selected inside `<main>` content area, excluding nav, footer, forms, inputs, and buttons. Add a check:

```typescript
const isRelevantContent = range?.commonAncestorContainer?.closest?.("main article, .page-content");
```

---

## 6. Admin Panel — Full CMS Features

Expand `AdminPanel.tsx` with additional tabs:

- **Blogs**: Create/edit/delete blog posts (new `blog_posts` table)
- **Community**: Post announcements, manage forum topics (new `community_posts` table)  
- **Documents**: Upload and manage documents (connect to `documents` table + storage bucket)
- **Users**: View registered users and their roles
- Keep existing: Messages, Subscribers, AI Training

**Database changes:**

- New table: `blog_posts` (title, slug, content, category, author_id, cover_image, published, created_at, updated_at)
- New table: `community_posts` (title, content, category, author_id, pinned, created_at)
- Create storage bucket: `documents` for file uploads
- RLS: Admin-only write, public read for published content

---

## 7. Unified Color Scheme

Standardize to amber/orange brand palette across all pages:

- Replace scattered `blue-600`, `purple-600`, `green-600` hardcoded colors with consistent amber/orange gradient theme
- Update `Login.tsx`, `Community.tsx`, `Dashboard.tsx`, `AIAssistant.tsx` backgrounds from `bg-blue-50` / `bg-gray-50` to use CSS variables (`bg-background`, `bg-muted`)
- Footer gradient bar: amber to orange instead of blue-purple-pink

---

## 8. Learn Pages for Each Section

Create a reusable `LearnPage` component and add `/plan/learn`, `/launch/learn`, `/manage/learn`, `/resources/learn` routes:

Each learn page is structured like an e-book with chapters:

- **Plan Learn**: Why plan, business model types, market research methods, financial projections, competitor analysis
- **Launch Learn**: Registration steps, legal requirements, first 100 days, common mistakes, funding basics
- **Grow Learn**: Scaling strategies, team building, operations management, customer retention, financial optimization
- **Resources Learn**: How to use templates, document management, community engagement, finding mentors

Add "Learn" links in each nav dropdown group.

---

## 9. Homepage — About Section

Add new sections to `Index.tsx` after the hero:

- **"What is BizHive?"** — mission, vision, what the platform does
- **"How We're Different"** — comparison with generic business advice sites
- **"Why We Built This"** — focus on Indian entrepreneur ecosystem gaps
- **"Our Sources"** — government databases (MCA, DPIIT, Startup India), NPTEL, industry reports
- Keep existing: tools grid, features bento, stats, testimonials, CTA

---

## 10. Fix Broken Buttons

Audit and connect all placeholder buttons:

- `Manage.tsx` — "Get Started" buttons → link to relevant tool/page
- `Launch.tsx` — "Schedule Consultation" → link to contact, "Download Guide" → link to documents
- `Community.tsx` — forum "Join Discussion" → external link or modal
- `Documents.tsx` — ensure download/save buttons work with real data
- `Dashboard.tsx` — action buttons link to correct pages

---

## 11. More Blog Content

Move blog posts from hardcoded array to `blog_posts` database table. Seed with ~15 posts. Admin can add more via the CMS and add relevent thumbnail and graphics in those blogs.

---

## 12. Content & Feature Ideas

Additional features you could add later:

- **Startup Pitch Deck Builder** — guided slide creation tool
- **Milestone Tracker** — visual timeline of business progress
- **Mentor Matching** — connect with industry mentors
- **Revenue Dashboard** — track actual vs projected revenue
- **Competitor Analysis Tool** — side-by-side comparison framework
- **Government Scheme Finder** — filter schemes by state, industry, funding amount
- **Invoice Generator** — create and download professional invoices
- **Business Health Score** — aggregate score from SWOT, financials, compliance status

---

## Implementation Order

1. **Database migrations** — blog_posts, community_posts tables, storage bucket, admin role fix
2. **Admin login fix + Google OAuth fix** — immediate blockers
3. **Logo redesign + color unification** — visual foundation
4. **Admin Panel CMS expansion** — blogs, community, documents management
5. **AI panel restructure** — full page + inline panel + mobile bottom sheet
6. **Text selection tooltip fix** — restrict to content areas
7. **Learn pages** — create template + 4 section pages
8. **Homepage about sections** — new content blocks
9. **Button audit + blog migration to DB** — connect everything
10. **Final polish** — verify all routes, buttons, and flows

---

## Technical Summary

- **New DB tables**: `blog_posts`, `community_posts`
- **New storage bucket**: `documents`
- **New routes**: `/ai-assistant`, `/plan/learn`, `/launch/learn`, `/manage/learn`, `/resources/learn`
- **Modified files**: ~20 files (Navigation, Layout, BeePanel, AdminPanel, Index, Login, all section pages)
- **New files**: `LearnPage.tsx` template, updated `AIAssistant.tsx`

&nbsp;

also create a custom fevicon icon for the website matching the new logo, and add actual leagal documentation and make them fillable and editable.

&nbsp;

create these features 

- **Startup Pitch Deck Builder** — guided slide creation tool
- chat groups in community (in admin panel let me see all the messages and give admin modrator control to ban people)