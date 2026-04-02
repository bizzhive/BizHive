import LearnPage from "@/components/LearnPage";

const chapters = [
  {
    title: "When & How to Scale",
    content: [
      "Scaling means growing your business while maintaining or improving efficiency. Premature scaling is the #1 killer of startups.",
      "## Signs You're Ready to Scale",
      "- Consistent revenue growth for 3+ months\n- Unit economics are positive (LTV > 3x CAC)\n- Customer demand exceeds your capacity\n- Processes are documented and repeatable\n- Team can operate without founder involvement in daily tasks",
      "## Scaling Strategies",
      "- Horizontal scaling: expanding to new markets or geographies\n- Vertical scaling: adding new products/services to existing customers\n- Technology scaling: automating manual processes\n- Partnership scaling: leveraging other companies' distribution",
      "> Scale one thing at a time. Scaling everything simultaneously is a recipe for chaos.",
    ],
  },
  {
    title: "Building Your Team",
    content: [
      "Your team is your biggest asset and your biggest liability. Hire carefully.",
      "## Hiring Principles",
      "- Hire for culture fit first, skills second\n- First 10 hires set the company culture permanently\n- Use trial projects before full-time offers\n- Check references — always talk to previous managers",
      "## Team Structure by Stage",
      "Idea stage: Just founders. Planning stage: 1-2 freelancers or contractors. Launch stage: 3-5 core team. Growth stage: functional teams (sales, marketing, ops, tech).",
      "## Indian Hiring Landscape",
      "- Use LinkedIn, Internshala, and AngelList for startup hiring\n- Consider hiring from tier-2 cities for cost-effective talent\n- ESOP (Employee Stock Options) are common for early hires\n- Comply with PF, ESI, and professional tax from day one",
      "## Remote vs Office",
      "Many Indian startups are now hybrid. Remote reduces office costs significantly. But early-stage teams benefit from in-person collaboration. Consider co-working spaces as a middle ground.",
    ],
  },
  {
    title: "Operations Management",
    content: [
      "Efficient operations are the backbone of sustainable growth.",
      "## Process Documentation",
      "Document every repeating task. Use SOPs (Standard Operating Procedures). This makes onboarding faster and reduces dependency on individuals.",
      "## Tools for Indian Startups",
      "- Project management: Notion, Trello, Asana\n- Communication: Slack, Google Workspace\n- CRM: HubSpot (free tier), Zoho CRM\n- Accounting: Tally, Zoho Books, ClearTax\n- HR: Keka, GreytHR, Darwinbox\n- Customer Support: Freshdesk, Intercom",
      "## Supply Chain Management",
      "For product businesses, optimize your supply chain early. Build relationships with multiple suppliers. Negotiate payment terms. Use inventory management software.",
      "## Quality Control",
      "Set quality standards and measure them. Customer complaints should decrease over time, not increase. Build feedback loops into every process.",
    ],
  },
  {
    title: "Customer Retention",
    content: [
      "Acquiring a new customer costs 5-7x more than retaining an existing one. Retention is the most overlooked growth lever.",
      "## Retention Strategies",
      "- Deliver consistent quality — the basics matter most\n- Build a community around your brand\n- Implement a loyalty program\n- Ask for and act on feedback\n- Personalize communication",
      "## Measuring Retention",
      "- Churn rate: % of customers who stop using your product\n- NPS (Net Promoter Score): would they recommend you?\n- Repeat purchase rate: % of customers who buy again\n- Customer lifetime: average duration of customer relationship",
      "## The Power of Word-of-Mouth",
      "In India, word-of-mouth is the most powerful marketing channel. A single satisfied customer can bring 5-10 referrals. Build a referral program — even a simple discount code works.",
    ],
  },
  {
    title: "Financial Optimization",
    content: [
      "As you grow, financial discipline becomes even more important. Here's how to optimize.",
      "## Working Capital Management",
      "- Negotiate longer payment terms with suppliers (60-90 days)\n- Offer early payment discounts to customers\n- Use invoice factoring for B2B businesses\n- Maintain 3-6 months of operating expenses as buffer",
      "## Tax Optimization (Legal)",
      "- Claim all eligible deductions under Section 80\n- Use Startup India benefits (3 years tax holiday)\n- Optimize GST input credits\n- Consider salary structuring for employee tax benefits\n- Maintain proper books — CA fees are an investment, not an expense",
      "## Fundraising for Growth",
      "If unit economics are proven, consider growth capital. Revenue-based financing is growing in India — you repay as a % of revenue rather than giving equity.",
      "## Financial Metrics Dashboard",
      "Track weekly: Revenue, Burn Rate, Cash Balance. Track monthly: MRR, Gross Margin, CAC, LTV, Runway. Track quarterly: P&L, Balance Sheet, Cash Flow Statement.",
      "> \"What gets measured gets managed.\" — Peter Drucker",
    ],
  },
  {
    title: "Leadership & Management",
    content: [
      "As your startup grows from 5 to 50 to 500 people, your role shifts from doing to leading. This transition is the hardest part of entrepreneurship.",
      "## From Founder to CEO",
      "- At 1-10 employees: You're a player-coach. Do everything and lead by example.\n- At 10-50: You're a manager. Build systems, hire managers, delegate daily operations.\n- At 50+: You're a leader. Set vision, culture, and strategy. Empower teams to execute.",
      "## Decision-Making Frameworks",
      "- Reversible vs Irreversible: Make reversible decisions quickly (Type 2). Take time for irreversible ones (Type 1).\n- RACI Matrix: For every decision, define who is Responsible, Accountable, Consulted, and Informed.\n- First Principles: Break problems down to fundamental truths rather than reasoning by analogy.",
      "## Building Culture",
      "- Culture is what happens when the founder isn't in the room\n- Hire and fire based on values, not just performance\n- Celebrate failures that came from bold experimentation\n- Transparency builds trust — share financials, strategy, and challenges with your team\n- Weekly all-hands meetings keep everyone aligned",
      "## Managing Conflict",
      "Conflict is inevitable and healthy when managed well. Address issues directly, focus on behaviors not personalities, and use structured feedback frameworks like SBI (Situation, Behavior, Impact).",
      "> The best leaders are not those who have the most answers, but those who ask the best questions.",
    ],
  },
  {
    title: "Data-Driven Decision Making",
    content: [
      "In the age of information, gut feeling alone isn't enough. Data-driven businesses outperform by 5-6% in productivity.",
      "## Building a Data Culture",
      "- Start by defining your North Star Metric — the one number that best captures the value you deliver\n- Make data accessible to every team member\n- Create dashboards for each team: sales, marketing, product, operations\n- Review metrics weekly as a team\n- Question assumptions — if something has 'always been done this way,' ask why",
      "## Key Metrics by Function",
      "- Sales: conversion rate, average deal size, sales cycle length, pipeline value\n- Marketing: CAC, ROAS, click-through rate, engagement rate, brand awareness\n- Product: DAU/MAU, feature adoption rate, time-to-value, bug count\n- Operations: order fulfillment time, error rate, capacity utilization\n- Finance: burn rate, runway, gross margin, cash conversion cycle",
      "## Tools for Data Analysis",
      "- Google Analytics 4: website and app analytics\n- Mixpanel or Amplitude: product analytics\n- Google Data Studio or Metabase: custom dashboards\n- Excel/Google Sheets: surprisingly powerful for early-stage analysis\n- SQL: learn basic SQL to query your own database",
      "## Avoiding Data Pitfalls",
      "- Vanity metrics: followers, page views, and downloads that don't correlate with revenue\n- Survivorship bias: only studying successes, not failures\n- Correlation vs causation: just because two things happen together doesn't mean one caused the other\n- Sample size issues: don't make major decisions based on 10 data points",
      "> Data tells you what happened. Analysis tells you why. Insight tells you what to do next.",
    ],
  },
  {
    title: "Crisis Management",
    content: [
      "Every business faces crises — economic downturns, PR disasters, supply chain breaks, or pandemic-level disruptions. Preparation is everything.",
      "## Types of Business Crises",
      "- Financial: Cash flow emergencies, losing a major client, funding falling through\n- Operational: Key employee quits, supplier fails, technology outage\n- Reputational: Negative press, social media backlash, product recall\n- External: Natural disasters, regulatory changes, pandemic, economic recession\n- Legal: Lawsuits, compliance violations, IP disputes",
      "## Crisis Response Framework",
      "- Detect: Set up alerts and monitoring systems\n- Assess: How severe is it? Is it getting worse?\n- Contain: Stop the bleeding immediately\n- Communicate: Be transparent with stakeholders\n- Resolve: Fix the root cause, not just symptoms\n- Learn: Post-mortem analysis to prevent recurrence",
      "## Financial Crisis Playbook",
      "- Cut non-essential expenses immediately\n- Renegotiate payment terms with vendors\n- Accelerate collections from customers\n- Consider emergency funding: revenue-based financing, MSME emergency credit line\n- If layoffs are necessary, do them once and deeply — multiple rounds destroy morale",
      "## Communication During Crisis",
      "- Customers: Acknowledge the issue, share what you're doing, provide timeline\n- Team: Be honest about the situation, share the plan, ask for input\n- Investors: Early communication prevents surprise — investors hate surprises\n- Media: Prepare a statement, designate a spokesperson, stick to facts",
      "> A crisis doesn't build character — it reveals it. How you handle adversity defines your business for years to come.",
    ],
  },
  {
    title: "International Expansion",
    content: [
      "If your product has proven demand in India, international expansion can multiply your addressable market by 10-50x.",
      "## Readiness Assessment",
      "Before expanding internationally, ensure: product-market fit is strong in India, unit economics are positive, your team can handle divided attention, and you have or can raise sufficient capital.",
      "## Market Selection Framework",
      "- Market size and growth rate\n- Cultural proximity (Middle East and Southeast Asia often work well for Indian businesses)\n- Regulatory complexity (Singapore is easiest, EU is hardest)\n- Competitive landscape\n- Language and localization needs\n- Payment infrastructure",
      "## Entry Strategies",
      "- Digital-first: SaaS and services can sell globally from India with zero physical presence\n- Partnership: Find local distributors or resellers\n- Subsidiary: Register a company locally (needed for some markets)\n- Acquisition: Buy a local player for instant market access\n- Franchise: License your brand and model",
      "## Legal & Compliance",
      "- Foreign Exchange Management Act (FEMA) compliance for outward remittances\n- Liberalised Remittance Scheme (LRS) for individual investments abroad\n- Transfer pricing documentation for inter-company transactions\n- Local tax registration (VAT/GST) in target markets\n- Data privacy compliance (GDPR for EU, CCPA for California)",
      "## Practical Tips for Indian Startups Going Global",
      "- Start with one market, not five\n- Hire a local champion who understands the market\n- Price in local currency\n- Adapt your marketing — what works in India may not work elsewhere\n- Consider Singapore or Dubai as a holding company jurisdiction\n- Use Deel, Remote.com, or Multiplier for international hiring without setting up entities",
      "> India is a $3.5 trillion economy. The world is a $100 trillion economy. Don't limit your ambition to one country.",
    ],
  },
  {
    title: "Exit Strategies",
    content: [
      "Building a business is one thing. Knowing when and how to exit is equally important for wealth creation.",
      "## Types of Exits",
      "- Acquisition: Selling your company to a larger player. Most common exit in India. Examples: Flipkart to Walmart, FreeCharge to Axis Bank.\n- IPO (Initial Public Offering): Going public on BSE/NSE. Requires significant scale (typically ₹500Cr+ revenue).\n- Secondary Sale: Selling your shares to another investor while the company continues operating.\n- Management Buyout: Your management team buys out the founders.\n- Merger: Combining with a complementary business for strategic value.\n- Acqui-hire: A company acquires yours primarily for the team, not the product.",
      "## Planning Your Exit",
      "- Start thinking about exit from Day 1 — not because you want to leave, but because it shapes how you build\n- Build value drivers: recurring revenue, strong IP, diverse customer base, clean financials, documented processes\n- Maintain clean corporate records and financial statements\n- Keep your cap table simple — messy cap tables kill deals\n- Build relationships with potential acquirers well before you want to sell",
      "## Valuation Approaches",
      "- Revenue multiple: Common for tech companies (1-10x annual revenue)\n- EBITDA multiple: Common for traditional businesses (5-15x EBITDA)\n- Discounted Cash Flow (DCF): Based on projected future cash flows\n- Comparable transactions: What similar companies sold for recently\n- Asset-based: Value of physical assets (real estate, equipment, inventory)",
      "## Tax Implications of Exit",
      "- Long-term capital gains tax: 20% with indexation for unlisted shares held 2+ years\n- Short-term capital gains: Taxed at your income tax slab rate\n- Section 54F exemption: Reinvest proceeds in residential property within 2 years\n- Angel tax considerations for seed-stage investments\n- ESOP taxation: Important to plan employee tax impact during exit\n- Consult a CA and a tax lawyer before any exit — the difference in tax planning can be crores",
      "> Not every exit is about billions. A ₹5Cr exit from a bootstrapped company you built in 3 years is an extraordinary outcome. Define success on your own terms.",
    ],
  },
  {
    title: "Building Scalable Systems",
    content: [
      "Growth eventually breaks everything that depends on founder memory. Scalable systems turn repeated founder effort into repeatable team execution.",
      "## Systems Worth Building Early",
      "- Sales qualification and follow-up workflows\n- Hiring scorecards and onboarding checklists\n- Weekly finance review and cash controls\n- Customer support response standards\n- Escalation paths for operations and product incidents",
      "## Principles for Good Systems",
      "- Keep them simple enough to follow under pressure\n- Document the owner for each workflow\n- Review exceptions, not just outputs\n- Update the system when reality changes\n- Measure system health with a small set of metrics",
      "## Avoid Over-Engineering",
      "Do not install enterprise-grade process for a five-person team. Build the lightest structure that reduces mistakes, speeds execution, and helps new people succeed.",
      "> If the business only works when you are present, you have a job, not a scalable company.",
    ],
  },
  {
    title: "Partnerships & Strategic Alliances",
    content: [
      "Partnerships can unlock distribution, trust, and speed that would take years to build alone. The best ones create value for both sides and are easy to explain.",
      "## Common Partnership Models",
      "- Referral partnerships\n- Channel sales or reseller agreements\n- Co-marketing campaigns\n- Distribution alliances\n- Technology integrations\n- White-label delivery partnerships",
      "## What Makes a Partnership Work",
      "- Clear commercial incentive for both sides\n- Shared target audience or use case\n- Defined owner and operating rhythm\n- Simple first pilot before a long contract\n- Success metrics agreed in advance",
      "## Red Flags",
      "- The deal only works if one side does all the execution\n- No decision-maker is directly involved\n- Legal complexity is high before commercial validation\n- Expectations are vague or too broad",
      "> A strong partnership should accelerate revenue or trust within weeks, not remain a slide-deck idea for months.",
    ],
  },
  {
    title: "Cash Conversion Cycle",
    content: [
      "A growing business can still become fragile if cash takes too long to come back after it goes out.",
      "## What to watch",
      "- How quickly customers pay\n- How long inventory sits\n- When vendors must be paid\n- How much cash gets trapped in operations",
      "## Why it matters",
      "Small improvements in collections, inventory discipline, or vendor terms can create more breathing room than a rushed fundraising process.",
      "Great growth companies do not just grow revenue. They also shorten the time between effort and cash recovery.",
    ],
  },
  {
    title: "Process Audits & Continuous Improvement",
    content: [
      "Growth exposes weak process faster than founder intuition can catch it. Regular audits help you fix repeated friction before customers or margins suffer.",
      "## What to audit regularly",
      "- Sales handoff quality\n- Support response consistency\n- Finance controls\n- Hiring and onboarding flow\n- Delivery errors and rework",
      "## Keep the audit simple",
      "Use short monthly reviews that focus on repeated mistakes, unclear ownership, and where work slows down unnecessarily.",
      "Continuous improvement compounds when teams review systems with curiosity instead of blame.",
    ],
  },
  {
    title: "Founder Governance & Reporting Rhythm",
    content: [
      "Governance is not just for large companies. Simple reporting habits protect decision quality as complexity increases.",
      "## Core founder rhythms",
      "- Weekly business review\n- Monthly financial review\n- Quarterly strategy reset\n- Decision log for major bets\n- Written updates for investors or advisors when relevant",
      "## Why this matters",
      "Once multiple teams, decisions, and stakeholders are involved, undocumented thinking becomes expensive and confusing.",
      "Governance becomes valuable the moment the business is too complex to run on memory and verbal updates alone.",
    ],
  },
];

const ManageLearn = () => (
  <LearnPage
    title="Learn: Growing & Scaling"
    subtitle="Master the art of sustainable business growth"
    chapters={chapters}
    pageSlug="manage-learn"
  />
);

export default ManageLearn;
