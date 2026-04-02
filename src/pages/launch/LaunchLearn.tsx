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
  {
    title: "Digital Marketing Essentials",
    content: [
      "In today's India, digital presence is non-negotiable. Here's how to build it from scratch without burning money.",
      "## SEO (Search Engine Optimization)",
      "- Research keywords your target audience searches for using Google Keyword Planner\n- Create high-quality blog content targeting those keywords\n- Optimize your website's title tags, meta descriptions, and headers\n- Build backlinks through guest posts and partnerships\n- Local SEO: claim your Google Business Profile",
      "## Social Media Strategy",
      "- Instagram: Visual products, D2C brands, lifestyle businesses\n- LinkedIn: B2B, professional services, recruitment\n- YouTube: Educational content, tutorials, product reviews\n- WhatsApp Business: Direct customer communication, catalogs\n- Twitter/X: Tech, media, thought leadership",
      "## Paid Advertising",
      "- Start with ₹500-1,000/day on Google or Meta ads\n- Test 3-5 ad creatives simultaneously\n- Use lookalike audiences based on existing customers\n- Track ROI per channel — kill channels that don't perform\n- Retargeting: show ads to people who visited but didn't buy",
      "## Content Marketing",
      "Content builds trust over time. Create content that educates, entertains, or solves problems. Repurpose: one blog post becomes 5 social media posts, 1 video, 1 newsletter, and 3 tweets.",
      "> The best marketing doesn't feel like marketing. It feels like help.",
    ],
  },
  {
    title: "Building Your Online Presence",
    content: [
      "Your website and online profiles are your digital storefront. In 2025, a customer's first impression is almost always digital.",
      "## Website Essentials",
      "- Fast loading (under 3 seconds on mobile)\n- Mobile-responsive design (60%+ of Indian traffic is mobile)\n- Clear value proposition above the fold\n- Prominent CTA (Call to Action)\n- Trust signals: reviews, certifications, partner logos\n- SSL certificate (HTTPS)\n- Privacy policy and terms of service",
      "## Tech Stack for Startups",
      "- No-code: Shopify (e-commerce), Webflow (services), WordPress (blogs)\n- Low-code: Bubble, Glide for MVPs\n- Full-code: React/Next.js, Django/Flask, Node.js for custom solutions\n- Hosting: Vercel (free tier), AWS, DigitalOcean\n- Domain: .in for India-focused, .com for global",
      "## E-commerce Setup in India",
      "- Payment gateways: Razorpay, Cashfree, PayU, PhonePe\n- Shipping: Shiprocket, Delhivery, DTDC aggregators\n- GST invoice integration: ClearTax, Zoho Invoice\n- Marketplace listing: Amazon Seller Central, Flipkart Seller Hub",
      "## Analytics Setup",
      "- Google Analytics 4 for website traffic\n- Google Search Console for SEO monitoring\n- Meta Pixel for social media ad tracking\n- Hotjar or Microsoft Clarity for user behavior heatmaps",
      "> Build your presence on platforms you own (website, email list) — not just rented platforms (social media). Algorithms change; your email list doesn't.",
    ],
  },
  {
    title: "Setting Up Payment Systems",
    content: [
      "Getting paid smoothly is critical. India has one of the world's most advanced digital payment ecosystems. Leverage it.",
      "## UPI (Unified Payments Interface)",
      "The backbone of Indian digital payments. Accept UPI through any payment gateway. Zero or minimal transaction fees. PhonePe, Google Pay, Paytm — your customers already use them.",
      "## Payment Gateways Comparison",
      "- Razorpay: Most popular for startups. 2% + GST per transaction. Easy integration.\n- Cashfree: Competitive rates, good for payouts. 1.75% + GST.\n- PayU: Strong for EMI and B2C. 2% + GST.\n- Instamojo: Simplest setup, good for freelancers. 2% + ₹3 per transaction.\n- Stripe: Best for international payments. 2.5% + GST.",
      "## Subscription Billing",
      "For recurring revenue businesses, use Razorpay Subscriptions, Chargebee, or Zoho Subscriptions. Key features: automated invoicing, dunning management (failed payment retries), proration.",
      "## Invoice & Accounting",
      "- Generate GST-compliant invoices from day one\n- Use Tally, Zoho Books, or ClearTax\n- Automate recurring invoices\n- Track payments vs outstanding receivables\n- Set up bank reconciliation",
      "## Security & Compliance",
      "- PCI DSS compliance (handled by your payment gateway)\n- Store payment data securely — never store CVV/card numbers\n- Implement 3D Secure for card payments\n- Display refund and cancellation policy clearly",
      "> Make it ridiculously easy for customers to pay you. Every extra step in checkout loses 10% of customers.",
    ],
  },
  {
    title: "Inventory & Supply Chain Basics",
    content: [
      "For product businesses, your supply chain determines your margins, delivery speed, and customer satisfaction.",
      "## Sourcing Strategies",
      "- Local manufacturing: Higher control, support 'Make in India'\n- Import: Alibaba, Global Sources for bulk. Factor in customs duty (5-30%), GST on imports, and shipping time (30-60 days)\n- Contract manufacturing: Low MOQ manufacturers on IndiaMart, TradeIndia\n- Dropshipping: Zero inventory risk but lower margins and less control",
      "## Inventory Management",
      "- ABC Analysis: 'A' items (80% of revenue, 20% of SKUs) need tight control\n- Safety stock: Keep buffer for your best sellers\n- Just-In-Time (JIT): Minimize holding costs by ordering closer to demand\n- Dead stock: Items unsold for 90+ days — liquidate or bundle them",
      "## Warehousing Options",
      "- Self-managed: Start with your office or home for initial orders\n- Third-party logistics (3PL): Shiprocket Fulfillment, Amazon FBA, Delhivery warehousing\n- Fulfillment centers: Pay per order. Scale without infrastructure investment\n- Dark stores: For hyperlocal delivery (food, groceries)",
      "## Quality Control",
      "- Set quality specifications in writing with suppliers\n- Inspect first batches personally\n- Random sampling for ongoing orders\n- Customer feedback loop — track return reasons\n- Build relationships with 2-3 suppliers per critical item (never single-source)",
      "> Your supply chain is only as strong as its weakest link. A great product means nothing if you can't deliver it on time.",
    ],
  },
  {
    title: "Customer Acquisition Strategy",
    content: [
      "Acquiring your first 100 customers is the hardest. Here's a systematic approach that works in the Indian market.",
      "## The First 10 Customers",
      "Your first customers come from your network. Tell everyone you know about your product. Ask for introductions. Offer pilot programs at reduced rates. The goal: validation, not revenue.",
      "## Customers 11-100",
      "- Cold outreach: LinkedIn messages, emails, WhatsApp for B2B\n- Local events: college fests, industry meetups, bazaars\n- Partnerships: collaborate with complementary businesses\n- Referral programs: give existing customers incentives to refer\n- Free workshops or webinars showcasing your expertise",
      "## Scaling to 1,000+",
      "- Paid advertising (Google, Meta, YouTube)\n- Content marketing and SEO\n- Influencer partnerships (micro-influencers: 10K-50K followers are most effective)\n- Marketplace listings (Amazon, Flipkart)\n- PR and media coverage",
      "## Indian-Specific Channels",
      "- WhatsApp groups and communities\n- Regional language content on YouTube and Instagram\n- Offline-to-online: QR codes on physical materials\n- College campus ambassadors\n- Festival and seasonal campaigns (Diwali, Holi, Independence Day)\n- Local language Google Ads targeting tier-2 and tier-3 cities",
      "## Measuring Acquisition",
      "- Customer Acquisition Cost (CAC): Total marketing spend / new customers acquired\n- Payback period: How many months until a customer's revenue covers their CAC\n- Channel attribution: Which channels drive the most valuable customers?\n- Cohort analysis: Do customers from different sources behave differently?",
      "> The cheapest customer acquisition channel is a delighted existing customer. Word of mouth in India is still the most powerful force in business.",
    ],
  },
  {
    title: "Launch Day Operations Playbook",
    content: [
      "Launch day is not just about going live. It is about handling traffic, questions, payments, bugs, and founder energy without slipping into chaos.",
      "## Launch Command Center",
      "- Assign one owner for customer support\n- Assign one owner for product or tech issues\n- Assign one owner for marketing and announcements\n- Keep one founder free for escalation and decision-making\n- Track issues in a shared checklist or Slack channel",
      "## Critical Checks Before You Publish",
      "- Forms and payments work end to end\n- Contact email and WhatsApp are active\n- Refund, delivery, and support policies are visible\n- Analytics and ad tracking are firing correctly\n- Inventory or service capacity matches expected demand",
      "## During the First 24 Hours",
      "Respond fast, log every complaint, and watch where users drop off. A smooth response to early issues builds more trust than a perfect silent launch.",
      "## After the Rush",
      "- Review top support queries\n- Fix the 3 biggest friction points\n- Thank your early customers personally\n- Publish learnings internally\n- Turn positive feedback into testimonials",
      "> Launch day is the start of feedback collection, not the finish line.",
    ],
  },
  {
    title: "Post-Launch Feedback Loops",
    content: [
      "The first version of your launch creates data. What you do with that data determines whether traction compounds or stalls.",
      "## Build a Weekly Feedback Rhythm",
      "- Collect direct customer calls and chat logs\n- Group issues into onboarding, product, pricing, and trust\n- Prioritize fixes by frequency and revenue impact\n- Share feedback with the whole team every week",
      "## Signals That Matter Most",
      "- Time to first value\n- Payment drop-off reasons\n- Repeat usage after the first week\n- Support questions that repeat more than 3 times\n- Customer language you can reuse in copy and ads",
      "## Closing the Loop",
      "When you ship an improvement based on user feedback, tell the users who raised it. That creates trust, stronger retention, and more useful feedback in the future.",
      "> A launch becomes momentum when customers feel heard quickly and consistently.",
    ],
  },
  {
    title: "Sales Scripts & Objection Handling",
    content: [
      "A first sales script is not meant to sound robotic. It is meant to keep your team consistent about discovery, value, proof, and next steps.",
      "## Build your script around",
      "- Customer context\n- Pain clarification\n- Cost of the current way\n- Your value in plain language\n- Proof or examples\n- A simple next step",
      "## Common early objections",
      "- We are not ready yet\n- This is too expensive\n- We already have something in place\n- We need internal approval\n- Come back later",
      "Treat objections as signals about trust, timing, or clarity rather than as personal rejection.",
    ],
  },
  {
    title: "Customer Support Setup",
    content: [
      "Support is part of the product in the first stage of a business. Fast, thoughtful support builds trust faster than marketing can.",
      "## Launch support basics",
      "- One clear support inbox or WhatsApp number\n- Defined owner for replies\n- A simple escalation path\n- A list of the most common expected questions\n- Response time expectations your team can actually meet",
      "## Why support matters early",
      "The first wave of questions tells you where buyers are confused, where trust is weak, and where onboarding is incomplete.",
      "When customers feel heard quickly, they stay longer and teach you more.",
    ],
  },
  {
    title: "Vendor Contracts & Service Levels",
    content: [
      "Weak vendor expectations create expensive launch issues. Make delivery standards clear before you depend on them.",
      "## What to define early",
      "- Scope of delivery\n- Timelines\n- Quality expectations\n- Escalation process\n- Payment terms\n- What happens if service fails",
      "## Keep the agreement practical",
      "Short, clear agreements are often better than vague trust when your launch depends on another party performing on time.",
      "If a launch depends on a vendor, service-level clarity is part of risk management, not legal decoration.",
    ],
  },
];

const LaunchLearn = () => (
  <LearnPage
    title="Learn: Launching Your Business"
    subtitle="Everything you need to know to successfully launch in India"
    chapters={chapters}
    pageSlug="launch-learn"
  />
);

export default LaunchLearn;
