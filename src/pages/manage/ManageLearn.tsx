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
];

const ManageLearn = () => (
  <LearnPage
    title="Learn: Growing & Scaling"
    subtitle="Master the art of sustainable business growth"
    chapters={chapters}
  />
);

export default ManageLearn;
