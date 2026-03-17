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
];

const PlanLearn = () => (
  <LearnPage
    title="Learn: Business Planning"
    subtitle="A comprehensive guide to planning your business from idea to launch-ready"
    chapters={chapters}
  />
);

export default PlanLearn;
