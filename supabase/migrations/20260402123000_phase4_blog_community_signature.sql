ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_image TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS signature_data_url TEXT,
ADD COLUMN IF NOT EXISTS signature_mode TEXT,
ADD COLUMN IF NOT EXISTS signature_text TEXT,
ADD COLUMN IF NOT EXISTS signature_font_family TEXT;

UPDATE public.profiles
SET signature_mode = COALESCE(signature_mode, 'draw');

ALTER TABLE public.profiles
ALTER COLUMN signature_mode SET DEFAULT 'draw';

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.community_groups (name, slug, description, is_private)
VALUES
  ('General Founders', 'general-founders', 'Talk through validation, founder mindset, hiring choices, and weekly operating questions.', false),
  ('Funding & Pitching', 'funding-pitching', 'Share investor updates, pitch feedback, fundraise prep, and storytelling ideas.', false),
  ('Marketing & Growth', 'marketing-growth', 'Discuss acquisition, content, retention, distribution, and growth experiments.', false),
  ('Legal & Compliance', 'legal-compliance', 'Discuss registrations, contracts, GST, IP, and compliance workflows.', false),
  ('Product & Operations', 'product-operations', 'Work through product priorities, systems, execution bottlenecks, and team rituals.', false)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_private = EXCLUDED.is_private,
  updated_at = now();

INSERT INTO public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  category,
  author_name,
  cover_image,
  thumbnail_image,
  published,
  read_time,
  meta_title,
  meta_description,
  featured,
  created_at,
  updated_at
)
VALUES
(
  'The Founder Weekly Scorecard That Keeps Teams Aligned',
  'founder-weekly-scorecard',
  'A simple weekly operating scorecard to help founders spot drift, unblock teams, and keep priorities visible.',
  '## Why founders need a weekly scorecard

When every week feels urgent, teams stop seeing the handful of metrics that actually matter. A founder scorecard brings the company back to a shared view of truth.

## What to track

- Revenue booked this week
- Qualified pipeline created
- Cash runway in months
- Product delivery milestones hit
- Major risks that need founder attention

## How to run the ritual

Start with five numbers, one sentence on momentum, and one blocker per function. Keep the review under 20 minutes and end by naming the one decision the leadership team must make next.

## Make it visible

Use the same definitions every week. If a metric changes, note why. Consistency matters more than complexity because it helps teams trust the dashboard and act faster.',
  'Strategy',
  'BizHive Team',
  '/blog/founder-weekly-scorecard.svg',
  '/blog/founder-weekly-scorecard.svg',
  true,
  '6 min',
  'Founder Weekly Scorecard for Startup Alignment | BizHive',
  'Learn how to build a lightweight founder scorecard that tracks focus, cash, pipeline, and execution without adding process drag.',
  true,
  '2026-03-30T08:00:00Z'::timestamptz,
  '2026-03-30T08:00:00Z'::timestamptz
),
(
  'How to Build a Pricing Page That Converts First-Time Visitors',
  'pricing-page-that-converts',
  'Use customer language, clear plan design, and confidence-building proof to make pricing pages easier to buy from.',
  '## Start with buyer questions

Most pricing pages fail because they answer the founder''s logic instead of the buyer''s. Visitors want to know who each plan is for, how quickly value appears, and what happens after they click buy.

## The three things every section needs

- A clear ideal customer for each plan
- The main outcome the buyer gets
- A risk reducer such as support, onboarding, or a guarantee

## Remove hidden friction

Spell out setup fees, contract length, and usage limits. Surprises increase hesitation. Clarity shortens the decision cycle.',
  'Sales',
  'BizHive Team',
  '/blog/pricing-page-that-converts.svg',
  '/blog/pricing-page-that-converts.svg',
  true,
  '5 min',
  'Startup Pricing Page Tips That Improve Conversion | BizHive',
  'Design a pricing page with clearer packages, buyer intent signals, and trust-building elements that improve conversions.',
  false,
  '2026-03-29T08:00:00Z'::timestamptz,
  '2026-03-29T08:00:00Z'::timestamptz
),
(
  'A Practical GST and Bookkeeping Setup for Early-Stage Teams',
  'gst-bookkeeping-setup',
  'A clean bookkeeping foundation keeps founders compliant, investor-ready, and less stressed at month end.',
  '## Keep the stack simple

Your finance stack should answer three questions fast: what came in, what went out, and what you owe. Build the process before volume builds complexity for you.

## Minimum monthly close checklist

- Reconcile bank accounts
- Record invoices and vendor bills
- Review GST categories for each transaction
- Check receivables older than 30 days
- Export a cash summary for leadership

## What founders should review personally

A founder should still review runway, tax deadlines, and unusual expenses every month. Delegation is good, but blind spots are expensive.',
  'Finance',
  'BizHive Team',
  '/blog/gst-bookkeeping-setup.svg',
  '/blog/gst-bookkeeping-setup.svg',
  true,
  '7 min',
  'GST and Bookkeeping Setup for Startups in India | BizHive',
  'Create a lightweight GST and bookkeeping process that supports compliance, reporting, and future fundraising readiness.',
  false,
  '2026-03-28T08:00:00Z'::timestamptz,
  '2026-03-28T08:00:00Z'::timestamptz
),
(
  'The Customer Interview Playbook for Better Product Decisions',
  'customer-interview-playbook',
  'Ask sharper questions, document patterns, and turn customer interviews into usable product evidence.',
  '## Interview for reality, not validation

Good interviews uncover context, not compliments. Ask about the last time the customer faced the problem instead of asking whether they like your idea.

## Questions worth asking

- What triggered the search for a solution?
- What did they try before?
- What made the workaround frustrating?
- What would success look like in 30 days?

## Capture the evidence

Log quotes, repeated words, current tools, and urgency signals. Pattern quality matters more than interview volume.',
  'Product',
  'BizHive Team',
  '/blog/customer-interview-playbook.svg',
  '/blog/customer-interview-playbook.svg',
  true,
  '6 min',
  'Customer Interview Playbook for Founders | BizHive',
  'Run customer interviews that reveal real pains, workarounds, and buying triggers so product decisions stay grounded.',
  false,
  '2026-03-27T08:00:00Z'::timestamptz,
  '2026-03-27T08:00:00Z'::timestamptz
),
(
  'Designing a Founder Brand Content Engine That Actually Compounds',
  'founder-brand-content-engine',
  'Turn one weekly insight into repeatable content across channels without creating a content treadmill.',
  '## Start with one useful point of view

The strongest founder brands do not post more. They repeat clear, useful ideas with fresh examples. Pick one audience pain and explain it from your own operating experience.

## Repurpose with a system

- Write one short memo each week
- Turn it into a post, email, and carousel
- Save audience replies as future prompts

## Measure trust signals

Track qualified replies, inbound conversations, and repeat readers instead of vanity impressions alone.',
  'Marketing',
  'BizHive Team',
  '/blog/founder-brand-content-engine.svg',
  '/blog/founder-brand-content-engine.svg',
  true,
  '5 min',
  'Founder Brand Content Engine for Consistent Growth | BizHive',
  'Build a repeatable founder-led content system that compounds trust across social, email, and community channels.',
  false,
  '2026-03-26T08:00:00Z'::timestamptz,
  '2026-03-26T08:00:00Z'::timestamptz
),
(
  'What to Put in a Pre-Seed Data Room Before Investors Ask',
  'pre-seed-data-room',
  'A simple pre-seed data room reduces back-and-forth and makes founder credibility easier to evaluate.',
  '## Keep it decision-ready

Your data room should answer investor diligence questions without making them chase you for basics. If everything important lives in one place, the process moves faster.

## Include the essentials

- Pitch deck and one-line company overview
- Revenue, growth, and retention snapshots
- Cap table and incorporation docs
- Product roadmap and current team roles
- Key legal contracts and policies

## Review for founder confidence

If you would hesitate to explain any document live, clean it up now. Preparation changes the tone of every investor conversation.',
  'Funding',
  'BizHive Team',
  '/blog/pre-seed-data-room.svg',
  '/blog/pre-seed-data-room.svg',
  true,
  '7 min',
  'Pre-Seed Data Room Checklist for Startup Fundraising | BizHive',
  'Prepare a clean pre-seed data room with traction, finance, market, and legal basics before investor diligence begins.',
  false,
  '2026-03-25T08:00:00Z'::timestamptz,
  '2026-03-25T08:00:00Z'::timestamptz
),
(
  'The First 10 Sales Calls: A Founder Script That Stays Human',
  'first-10-sales-calls',
  'Use a lightweight call structure to learn fast, keep the conversation natural, and move prospects toward a clear next step.',
  '## Use structure without sounding robotic

A founder call works best when you know the arc but keep the tone human. Start with context, move into pain, then explore the cost of delay.

## Core flow

- Confirm why they took the meeting
- Understand the current workflow
- Explore what is expensive or slow today
- Share only the most relevant part of your solution
- Close with one clear next step

## Debrief every call

Record objections, exact phrases, and the moment energy rose or dropped. That is where future conversion gains usually hide.',
  'Sales',
  'BizHive Team',
  '/blog/first-10-sales-calls.svg',
  '/blog/first-10-sales-calls.svg',
  true,
  '6 min',
  'Startup Sales Call Script for Early Founders | BizHive',
  'Run your first 10 sales calls with a simple structure that improves discovery, confidence, and follow-through.',
  false,
  '2026-03-24T08:00:00Z'::timestamptz,
  '2026-03-24T08:00:00Z'::timestamptz
),
(
  'An Operating Cadence for Small Teams That Reduces Founder Bottlenecks',
  'operating-cadence-small-teams',
  'A lightweight meeting cadence gives teams clarity without adding layers of management overhead.',
  '## Cadence beats intensity

Founders often overwork because the team lacks a steady rhythm. A simple cadence reduces repeated clarifications and makes handoffs easier.

## Recommended rhythm

- Monday priorities check-in
- Midweek async update
- Friday scorecard review
- Monthly retrospective on systems and decisions

## Watch the load on founders

If too many decisions still route through one person, the problem is usually unclear ownership, not weak effort.',
  'Operations',
  'BizHive Team',
  '/blog/operating-cadence-small-teams.svg',
  '/blog/operating-cadence-small-teams.svg',
  true,
  '5 min',
  'Operating Cadence for Small Startup Teams | BizHive',
  'Build a founder-friendly operating cadence with weekly priorities, async updates, and fewer bottlenecks.',
  false,
  '2026-03-23T08:00:00Z'::timestamptz,
  '2026-03-23T08:00:00Z'::timestamptz
),
(
  'A New-Hire Onboarding Checklist for Teams Without an HR Department',
  'new-hire-onboarding-checklist',
  'A strong first week helps new hires ramp faster, ask better questions, and trust the team?s operating style.',
  '## Good onboarding starts before day one

A new hire should arrive with context, not confusion. Send the schedule, tools list, and who they will meet before they start.

## First-week checklist

- Access to tools and accounts
- A written 30-day success plan
- Intro meetings with decision-makers
- One real task completed by day three
- A buddy for questions and context

## Close the loop

Ask what still feels unclear at the end of week one. Onboarding quality becomes visible in the questions people ask.',
  'Hiring',
  'BizHive Team',
  '/blog/new-hire-onboarding-checklist.svg',
  '/blog/new-hire-onboarding-checklist.svg',
  true,
  '5 min',
  'New Hire Onboarding Checklist for Small Teams | BizHive',
  'Use a simple onboarding checklist to improve clarity, confidence, and speed for new hires in small startups.',
  false,
  '2026-03-22T08:00:00Z'::timestamptz,
  '2026-03-22T08:00:00Z'::timestamptz
),
(
  'A Prompt Library for Founders Using AI as a Daily Copilot',
  'prompt-library-founder-copilot',
  'A founder prompt library makes AI more reliable for strategy reviews, writing, research, and team communication.',
  '## Build prompts around jobs, not tools

The best founder prompts are tied to repeatable tasks like summarizing customer calls, drafting outreach, or pressure-testing plans.

## Keep each prompt anchored

- State the context
- Name the exact output format
- Add the audience or decision-maker
- Include constraints and what to avoid

## Save what works

When a prompt produces a useful result twice, store it. Reusable prompts turn AI into part of your workflow instead of a novelty.',
  'AI',
  'BizHive Team',
  '/blog/prompt-library-founder-copilot.svg',
  '/blog/prompt-library-founder-copilot.svg',
  true,
  '6 min',
  'Founder AI Prompt Library for Daily Execution | BizHive',
  'Use a structured prompt library to get more consistent AI output for planning, writing, analysis, and operating work.',
  false,
  '2026-03-21T08:00:00Z'::timestamptz,
  '2026-03-21T08:00:00Z'::timestamptz
),
(
  'How Service Businesses Can Build a Retention Loop Instead of Chasing Leads',
  'retention-loop-service-businesses',
  'Retention becomes easier when you design a clear rhythm of proof, value delivery, and proactive follow-up.',
  '## Retention begins with visibility

Clients stay when they can see progress. If your work is valuable but invisible, renewal conversations become harder than they should be.

## Build the loop

- Set a measurable success goal early
- Share progress in a weekly summary
- Surface wins before the client asks
- Ask for feedback before frustration grows

## Expand only after trust

Expansion offers land better when clients already believe the team understands their goals and follows through.',
  'Growth',
  'BizHive Team',
  '/blog/retention-loop-service-businesses.svg',
  '/blog/retention-loop-service-businesses.svg',
  true,
  '6 min',
  'Retention Loop for Service Businesses | BizHive',
  'Create a retention loop that improves client visibility, renewals, referrals, and expansion revenue for service businesses.',
  false,
  '2026-03-20T08:00:00Z'::timestamptz,
  '2026-03-20T08:00:00Z'::timestamptz
),
(
  'The Startup Compliance Calendar Every Founder in India Should Keep',
  'startup-compliance-calendar-india',
  'A founder-friendly compliance calendar helps teams stay ahead of recurring filings, renewals, and document maintenance.',
  '## Put deadlines in one operating system

Compliance slips when deadlines live in inboxes and founder memory. A shared calendar turns compliance into a managed workflow.

## What to include

- Tax and GST filing dates
- Board or governance reviews
- Contract renewals
- Payroll and labor obligations
- Annual policy or register updates

## Assign owners

Every task needs one accountable owner and a review date. Shared visibility should never mean shared ambiguity.',
  'Legal',
  'BizHive Team',
  '/blog/startup-compliance-calendar-india.svg',
  '/blog/startup-compliance-calendar-india.svg',
  true,
  '7 min',
  'Startup Compliance Calendar for India-Based Founders | BizHive',
  'Track recurring startup compliance work in India with a practical calendar for filings, renewals, and governance checks.',
  false,
  '2026-03-19T08:00:00Z'::timestamptz,
  '2026-03-19T08:00:00Z'::timestamptz
),
(
  'A Launch Readiness Checklist for Product, GTM, and Support Teams',
  'launch-readiness-checklist',
  'A launch lands better when product, marketing, support, and analytics are prepared at the same time.',
  '## Launches fail in the handoffs

Many launches slip because each team assumes another team handled the final detail. A checklist prevents invisible gaps.

## Review these areas

- Product quality and rollback plan
- Analytics and event naming
- Support scripts and help content
- Go-to-market assets and owner list
- Feedback loop for launch week learnings

## Decide what success means

Define the first-week metrics before launch day. Otherwise the team debates outcomes instead of learning from them.',
  'Launch',
  'BizHive Team',
  '/blog/launch-readiness-checklist.svg',
  '/blog/launch-readiness-checklist.svg',
  true,
  '5 min',
  'Product Launch Readiness Checklist for Startups | BizHive',
  'Coordinate product, marketing, support, and analytics with a practical launch readiness checklist for startups.',
  false,
  '2026-03-18T08:00:00Z'::timestamptz,
  '2026-03-18T08:00:00Z'::timestamptz
),
(
  'Cash Runway Planning: A Founder Model for Better Hiring Decisions',
  'cash-runway-planning',
  'Runway planning gets sharper when founders model hiring choices against cash, revenue timing, and risk tolerance.',
  '## Hiring is a cash decision first

Every hire changes the company''s time horizon. Founders make better hiring decisions when they can see how runway shifts under different scenarios.

## Model three cases

- Base case with current revenue trend
- Growth case with expected wins landing on time
- Downside case with slower collections or delays

## Decide from thresholds

Set minimum runway thresholds before you approve headcount. Decisions become calmer when the trigger points are already agreed.',
  'Finance',
  'BizHive Team',
  '/blog/cash-runway-planning.svg',
  '/blog/cash-runway-planning.svg',
  true,
  '6 min',
  'Cash Runway Planning Model for Startup Hiring | BizHive',
  'Use cash runway planning to make hiring decisions that balance growth needs with realistic financial risk.',
  false,
  '2026-03-17T08:00:00Z'::timestamptz,
  '2026-03-17T08:00:00Z'::timestamptz
),
(
  'A Partner Channel Playbook for Startups That Want Warm Distribution',
  'partner-channel-playbook',
  'The right partner channel can accelerate distribution when the offer, incentive, and enablement are tightly aligned.',
  '## Pick partners with the same customer moment

The best partners already serve your ideal customer before or after the need your product solves. That shared moment creates natural fit.

## What each partner needs

- Clear positioning in one sentence
- A simple referral or resale motion
- Fast onboarding and support
- Reporting they can trust

## Start manually before scaling

Run the first few partnerships by hand. You will learn what enablement and incentives actually matter before building a full program.',
  'Growth',
  'BizHive Team',
  '/blog/partner-channel-playbook.svg',
  '/blog/partner-channel-playbook.svg',
  true,
  '6 min',
  'Partner Channel Playbook for Startup Distribution | BizHive',
  'Build a startup partner channel with the right ideal partner profile, incentives, enablement, and reporting rhythm.',
  false,
  '2026-03-16T08:00:00Z'::timestamptz,
  '2026-03-16T08:00:00Z'::timestamptz
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  author_name = EXCLUDED.author_name,
  cover_image = EXCLUDED.cover_image,
  thumbnail_image = EXCLUDED.thumbnail_image,
  published = EXCLUDED.published,
  read_time = EXCLUDED.read_time,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  featured = EXCLUDED.featured,
  updated_at = EXCLUDED.updated_at;
