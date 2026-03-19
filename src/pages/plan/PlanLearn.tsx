import LearnPage from "@/components/LearnPage";

const chapters = [
  {
    title: "Why Business Planning Matters",
    content: [
      "Business planning is the foundation of every successful venture. It forces you to think critically about your idea, market, competition, and finances before investing significant time and money.",
      "> According to Harvard Business Review, entrepreneurs who write business plans are 16% more likely to achieve viability than those who don't.",
      "## Key Benefits of Planning",
      "- Provides clarity on your business model and revenue streams\n- Helps identify potential risks and mitigation strategies\n- Attracts investors by demonstrating thorough preparation\n- Serves as a roadmap for decision-making\n- Aligns team members around shared goals",
      "Planning doesn't mean you need a 100-page document. Even a lean canvas or a 2-page plan can provide the structure needed to move forward with confidence.",
    ],
  },
  {
    title: "Business Model Types in India",
    content: [
      "Choosing the right business model is crucial. India's diverse market supports many models, each with unique advantages.",
      "## B2C (Business to Consumer)",
      "Selling directly to end consumers. Examples: Flipkart, Zomato, Nykaa. Works well for consumer goods, food delivery, and e-commerce.",
      "## B2B (Business to Business)",
      "Selling to other businesses. Examples: Zoho, Freshworks, IndiaMart. Often involves longer sales cycles but higher lifetime value.",
      "## D2C (Direct to Consumer)",
      "Manufacturing and selling your own brand directly, bypassing middlemen. The fastest-growing segment in India. Examples: boAt, Mamaearth, Sugar Cosmetics.",
      "## Marketplace Model",
      "Connecting buyers and sellers. Revenue through commissions or subscriptions. Examples: Amazon India, OLX, Urban Company.",
      "## Subscription/SaaS",
      "Recurring revenue model. Users pay monthly/annually for access. Growing rapidly in India with the digital transformation wave.",
      "## Franchise Model",
      "Licensing your brand and business model. Lower risk expansion strategy used by companies like Chai Point, Amul parlors.",
    ],
  },
  {
    title: "Market Research Methods",
    content: [
      "Market research validates your assumptions and uncovers opportunities. Here's how to do it effectively without expensive agencies.",
      "## Primary Research",
      "Collect data directly from your target audience:",
      "- Customer interviews (aim for 20-50)\n- Online surveys (Google Forms, Typeform)\n- Focus groups (5-8 people per session)\n- Observation and field visits\n- Prototype testing",
      "## Secondary Research",
      "Use existing data and reports:",
      "- Government data: MOSPI, RBI reports, Census data\n- Industry reports: NASSCOM, CII, FICCI\n- Academic research: NPTEL courses, university publications\n- Competitor analysis: website traffic (SimilarWeb), social media analysis\n- Market intelligence: Statista, RedSeer, Inc42",
      "## TAM, SAM, SOM Framework",
      "- TAM (Total Addressable Market): The entire market for your product globally\n- SAM (Serviceable Addressable Market): The segment you can reach geographically and technically\n- SOM (Serviceable Obtainable Market): The realistic portion you can capture in 2-3 years",
      "> Start with SOM. Most investors care about your realistic capture rate, not grand TAM numbers.",
    ],
  },
  {
    title: "Financial Projections & Planning",
    content: [
      "Financial planning separates dreamers from doers. Even rough projections force you to confront the economics of your business.",
      "## Revenue Projection",
      "Start with unit economics: how much does one customer pay, and how many customers can you realistically acquire per month? Build bottom-up from there.",
      "## Cost Structure",
      "- Fixed costs: rent, salaries, software subscriptions, insurance\n- Variable costs: raw materials, shipping, marketing spend per customer\n- One-time costs: incorporation, equipment, initial inventory",
      "## Break-Even Analysis",
      "Calculate how many units/customers you need to cover your costs. If break-even requires unrealistic numbers, revisit your pricing or cost structure.",
      "## Cash Flow Management",
      "Cash is king. Many profitable businesses fail because they run out of cash. Track:",
      "- Monthly burn rate (how much cash you spend)\n- Runway (how many months of cash you have)\n- Collection cycles (when customers actually pay)\n- Payment terms with suppliers",
      "## Key Financial Ratios",
      "- Gross margin: (Revenue - COGS) / Revenue\n- Customer Acquisition Cost (CAC)\n- Lifetime Value (LTV): LTV should be at least 3x CAC\n- Monthly Recurring Revenue (MRR) for subscription businesses",
    ],
  },
  {
    title: "Competitor Analysis",
    content: [
      "Understanding your competition helps you find your unique positioning and avoid their mistakes.",
      "## Direct vs Indirect Competitors",
      "Direct competitors sell the same product/service. Indirect competitors solve the same problem differently. Track both.",
      "## Analysis Framework",
      "- Product/service comparison: features, quality, pricing\n- Market positioning: budget, mid-range, premium\n- Distribution channels: online, offline, partnerships\n- Marketing strategies: content, paid ads, social media\n- Customer reviews: what do their customers love/hate?\n- Financial health: funded? profitable? growing?",
      "## Tools for Competitor Research",
      "- SimilarWeb: website traffic and sources\n- Social media: follower count, engagement rates\n- App store reviews: real customer feedback\n- Google Trends: search interest over time\n- LinkedIn: team size, hiring patterns\n- Glassdoor: employee reviews (culture insights)",
      "## Finding Your Edge",
      "After analyzing competitors, identify gaps. Maybe they're weak on customer service, or don't serve a specific geography, or their pricing excludes a segment. Your edge lives in these gaps.",
      "> Don't compete on everything. Pick 1-2 dimensions where you can be 10x better.",
    ],
  },
  {
    title: "Intellectual Property Basics",
    content: [
      "Intellectual property (IP) protection is often overlooked by Indian entrepreneurs, but it's critical for long-term value creation.",
      "## Types of IP in India",
      "- Trademark: Protects your brand name, logo, tagline. Register at ipindia.gov.in. Cost: ~₹4,500 per class.\n- Patent: Protects inventions and processes. Takes 2-4 years. Provisional patent gives 12 months of protection while you file fully.\n- Copyright: Automatic upon creation for original works — code, designs, content. Registration strengthens enforcement.\n- Trade Secret: Confidential business information (recipes, algorithms, customer lists). Protect with NDAs and access controls.\n- Design Registration: Protects the visual appearance of products. Valid for 10+5 years.",
      "## When to File",
      "File trademarks immediately — even before launch. Use the TM symbol while your application is pending. File patents before public disclosure or you lose rights.",
      "## Startup India IP Benefits",
      "- 80% rebate on patent filing fees\n- 50% rebate on trademark filing fees\n- Fast-track patent examination available\n- Panel of facilitators to assist with filing",
      "> Your brand name and logo are your identity. Trademark them on Day 1 — it costs less than a restaurant dinner but protects millions in brand value.",
    ],
  },
  {
    title: "Building Your Brand Identity",
    content: [
      "Brand identity goes beyond a logo. It's how customers perceive, remember, and talk about your business.",
      "## Brand Strategy Framework",
      "- Purpose: Why does your business exist beyond making money?\n- Values: What principles guide your decisions?\n- Positioning: What unique space do you occupy in customers' minds?\n- Personality: If your brand were a person, how would it talk and behave?\n- Promise: What consistent experience can customers expect?",
      "## Visual Identity Components",
      "- Logo: Simple, scalable, works in black and white. Get it professionally designed (₹5,000-₹50,000).\n- Color palette: Choose 2-3 primary colors that evoke your brand emotion.\n- Typography: Select 2 fonts — one for headings, one for body text.\n- Photography style: Consistent editing, subjects, and composition.\n- Iconography: Custom icons that match your brand personality.",
      "## Building Brand Voice",
      "Your brand voice should be consistent across all channels. Define it with these dimensions:",
      "- Formal vs Casual\n- Serious vs Playful\n- Technical vs Simple\n- Respectful vs Irreverent",
      "## Brand in the Indian Context",
      "Indian consumers value trust above all. Build trust through consistent quality, responsive customer service, transparent communication, and social proof. Regional language support can increase brand affinity by 3-5x in non-metro markets.",
      "> Great brands aren't built by marketing departments. They're built by every customer interaction, every product experience, every employee behavior.",
    ],
  },
  {
    title: "Creating a Pitch Deck",
    content: [
      "A pitch deck is your 10-15 slide presentation that tells your startup's story to investors. It should be compelling, clear, and data-driven.",
      "## The 12-Slide Framework",
      "- Slide 1: Title — Company name, one-liner, your name\n- Slide 2: Problem — The pain point you're solving (use real stories)\n- Slide 3: Solution — Your product/service and how it solves the problem\n- Slide 4: Market Size — TAM, SAM, SOM with credible sources\n- Slide 5: Business Model — How you make money\n- Slide 6: Traction — Revenue, users, growth rate, key metrics\n- Slide 7: Competition — Competitive landscape and your differentiation\n- Slide 8: Product — Screenshots, demo, or feature highlights\n- Slide 9: Team — Founders' backgrounds and why you're the right team\n- Slide 10: Financials — Revenue projections, unit economics\n- Slide 11: Ask — How much you're raising and what you'll do with it\n- Slide 12: Contact — How to reach you",
      "## Design Principles",
      "- One key message per slide\n- Use visuals over text — charts, screenshots, icons\n- Consistent branding throughout\n- Font size: minimum 24pt for readability\n- White space is your friend",
      "## Common Pitch Deck Mistakes",
      "- Too many slides (keep it under 15)\n- No clear ask amount\n- Unrealistic financial projections without basis\n- Ignoring competition ('we have no competitors')\n- Missing traction slide\n- Reading slides word-for-word during presentation",
      "> The pitch deck gets you the meeting. Your storytelling in the room closes the deal.",
    ],
  },
  {
    title: "Government Schemes for Startups",
    content: [
      "The Indian government offers extensive support for startups. Knowing these schemes can save you lakhs and open doors.",
      "## Startup India (DPIIT Recognition)",
      "Benefits: 3-year tax holiday (Section 80-IAC), self-certification for 6 labor and 3 environmental laws, fast-track patent examination, easier public procurement norms, access to Fund of Funds.",
      "## Financial Schemes",
      "- MUDRA Loans: Up to ₹10L without collateral (Shishu: ₹50K, Kishor: ₹5L, Tarun: ₹10L)\n- Stand-Up India: ₹10L to ₹1Cr for SC/ST/Women entrepreneurs\n- CGTMSE: Collateral-free loans up to ₹2Cr with government guarantee\n- Startup India Seed Fund: Up to ₹50L for proof of concept\n- SIDBI Fund of Funds: ₹10,000Cr corpus deployed through SEBI-registered AIFs",
      "## State-Level Schemes",
      "Every state has its own startup policy. Key ones:",
      "- Karnataka: Elevate program, KITS incubator\n- Maharashtra: Maharashtra State Innovation Society\n- Tamil Nadu: TANSEED fund, StartupTN\n- Telangana: T-Hub, WE Hub for women\n- Kerala: KSUM, technology innovation zones\n- Gujarat: iCreate, student startup support",
      "## How to Apply",
      "- Register on startupindia.gov.in\n- Get DPIIT recognition certificate\n- Apply for relevant schemes through the portal\n- Keep your incorporation certificate, pitch deck, and financial projections ready\n- Track deadlines — many schemes have application windows",
      "> Don't leave free money on the table. DPIIT recognition alone can save you ₹10-50L in taxes over three years.",
    ],
  },
  {
    title: "Risk Assessment Framework",
    content: [
      "Every business faces risks. The successful ones identify, assess, and mitigate risks before they become crises.",
      "## Risk Categories",
      "- Market Risk: Will customers actually pay for your solution? Mitigate with validation and MVPs.\n- Financial Risk: Will you run out of cash? Mitigate with conservative projections and emergency funds.\n- Operational Risk: Can your team execute? Mitigate with documented processes and cross-training.\n- Regulatory Risk: Will laws change affecting your business? Monitor government gazettes and industry bodies.\n- Technology Risk: Will your tech stack scale? Build modular, test regularly.\n- Competitive Risk: Will a larger player copy you? Build moats — brand, data, network effects.",
      "## Risk Assessment Matrix",
      "Rate each risk on two dimensions: Probability (1-5) and Impact (1-5). Multiply for a Risk Score. Focus on risks scoring 15+.",
      "## Mitigation Strategies",
      "- Avoid: Don't enter markets with unmanageable regulatory risk\n- Reduce: Build redundancy into critical systems\n- Transfer: Use insurance for insurable risks\n- Accept: Some risks are inherent — plan for them",
      "## Building Resilience",
      "- Maintain 6 months of operating expenses in reserve\n- Diversify revenue streams — don't depend on one client or channel\n- Build a strong advisory board for guidance during crises\n- Create contingency plans for your top 3 risks\n- Review and update your risk register quarterly",
      "> The goal isn't to eliminate risk — that's impossible. The goal is to take calculated risks with eyes wide open.",
    ],
  },
];

const PlanLearn = () => (
  <LearnPage
    title="Learn: Business Planning"
    subtitle="A comprehensive guide to planning your business from idea to launch-ready"
    chapters={chapters}
    pageSlug="plan-learn"
  />
);

export default PlanLearn;
