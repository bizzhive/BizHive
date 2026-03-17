import LearnPage from "@/components/LearnPage";

const chapters = [
  {
    title: "Getting Ready to Launch",
    content: [
      "Launching a business in India involves navigating legal requirements, setting up operations, and creating a go-to-market strategy. This guide covers everything step by step.",
      "## Pre-Launch Mindset",
      "Don't wait for perfection. Launch with a Minimum Viable Product (MVP) — just enough features to solve the core problem and get real customer feedback.",
      "> \"If you're not embarrassed by the first version of your product, you've launched too late.\" — Reid Hoffman, LinkedIn founder",
      "## Launch Readiness Checklist",
      "- Legal structure chosen and registered\n- GST registration (if applicable)\n- Bank account opened\n- Basic website/landing page ready\n- Payment gateway integrated\n- Initial inventory/service capacity ready\n- Customer support channel set up",
    ],
  },
  {
    title: "Legal Requirements & Registration",
    content: [
      "Understanding India's legal landscape is critical. Here's what you need based on your business structure.",
      "## Sole Proprietorship",
      "Simplest to set up. Need: PAN card, Aadhaar, bank account, GST registration (if applicable), Shop & Establishment license.",
      "## LLP (Limited Liability Partnership)",
      "Need: DSC (Digital Signature Certificate), DPIN, name approval, LLP agreement, incorporation on MCA portal. Timeline: 10-15 days.",
      "## Private Limited Company",
      "Need: DSC, DIN, name approval, MOA/AOA, incorporation. Timeline: 15-25 days. Best for startups seeking funding.",
      "## Common Licenses",
      "- Shop & Establishment Act registration (state-specific)\n- Professional Tax registration\n- MSME/Udyam registration (free, many benefits)\n- FSSAI license (food businesses)\n- Drug license (pharma/cosmetics)\n- Import Export Code (IEC) for international trade\n- Startup India recognition (DPIIT)",
    ],
  },
  {
    title: "Your First 100 Days",
    content: [
      "The first 100 days set the trajectory for your business. Here's a week-by-week framework.",
      "## Weeks 1-4: Foundation",
      "- Complete all legal formalities\n- Set up workspace and tools\n- Build your core team (even if it's just you)\n- Finalize product/service offering\n- Create brand identity (logo, website, social media)",
      "## Weeks 5-8: Soft Launch",
      "- Launch to a small group (friends, family, early adopters)\n- Collect feedback aggressively — call every customer\n- Fix critical bugs and issues\n- Refine your value proposition based on real feedback",
      "## Weeks 9-12: Scale",
      "- Start marketing campaigns\n- Optimize conversion funnels\n- Set up analytics and tracking\n- Begin outreach to press and influencers",
      "## Weeks 13-14: Assess",
      "- Review all metrics: revenue, customers, costs, feedback\n- Decide: pivot, persevere, or double down\n- Plan the next quarter",
    ],
  },
  {
    title: "Common Launch Mistakes",
    content: [
      "Learn from others' failures. These are the most common mistakes Indian entrepreneurs make during launch.",
      "## 1. Over-Building Before Launch",
      "Spending 6-12 months building features nobody asked for. Instead, build the minimum needed to test your core assumption.",
      "## 2. Ignoring Legal Compliance",
      "Many founders skip GST registration, labor law compliance, or proper contracts. This creates serious problems later — penalties, disputes, and inability to raise funding.",
      "## 3. No Cash Flow Planning",
      "Revenue ≠ cash in hand. Indian businesses often face 30-90 day payment cycles. Plan for this gap or you'll run out of money while being \"profitable.\"",
      "## 4. Trying to Serve Everyone",
      "\"Everyone is our customer\" means nobody is your customer. Pick a niche, dominate it, then expand.",
      "## 5. Hiring Too Fast",
      "Every hire should be justified by revenue or a clear path to revenue. Maintain a lean team until you have product-market fit.",
      "## 6. Ignoring Unit Economics",
      "If it costs you ₹500 to acquire a customer who pays ₹300, no amount of volume will make you profitable. Fix unit economics before scaling.",
    ],
  },
  {
    title: "Funding Basics",
    content: [
      "Not every business needs external funding. But if you do, here's how the funding landscape works in India.",
      "## Bootstrapping",
      "Using your own savings and revenue. Pros: full control, no dilution. Cons: limited by your resources. Best for: services, consulting, small-scale manufacturing.",
      "## Friends & Family",
      "Informal funding from your network. Always document terms clearly — mixing money and relationships can be toxic.",
      "## Angel Investors",
      "Individual investors who invest ₹5L-50L in early-stage startups. Find them through: Indian Angel Network, LetsVenture, AngelList India, Mumbai Angels.",
      "## Venture Capital",
      "For high-growth startups. Series Seed (₹25L-2Cr), Series A (₹2Cr-15Cr), Series B+ (₹15Cr+). Top Indian VCs: Accel, Sequoia, Blume, Matrix.",
      "## Government Schemes",
      "- MUDRA Loans: up to ₹10L without collateral\n- Stand-Up India: ₹10L-1Cr for SC/ST/women\n- CGTMSE: collateral-free loans up to ₹2Cr\n- SIDBI Fund of Funds: via SEBI-registered AIFs\n- Startup India Seed Fund: up to ₹50L",
      "> Focus on building a business that generates revenue before seeking VC funding. Revenue is the best negotiating leverage.",
    ],
  },
];

const LaunchLearn = () => (
  <LearnPage
    title="Learn: Launching Your Business"
    subtitle="Everything you need to know to successfully launch in India"
    chapters={chapters}
  />
);

export default LaunchLearn;
