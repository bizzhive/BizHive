import LearnPage from "@/components/LearnPage";

const chapters = [
  {
    title: "Getting the Most from BizHive",
    content: [
      "BizHive provides a comprehensive suite of tools and resources. Here's how to use them effectively.",
      "## Your Learning Path",
      "Start with planning tools (Business Canvas, SWOT Analysis), then move to financial planning (Startup Calculator, Financial Calculator), and finally launch tools (Legal Checklist, Launch Checklist).",
      "## Using Templates",
      "All templates are designed for Indian businesses. They include relevant sections for GST, MCA compliance, and Indian market conditions. Customize them for your specific industry and state.",
      "> Tip: Save your work regularly. All tools support cloud saving when you're logged in.",
    ],
  },
  {
    title: "Document Management",
    content: [
      "Proper documentation is essential for business growth, compliance, and fundraising.",
      "## Essential Documents",
      "- Business registration certificates\n- GST registration\n- PAN and TAN\n- Partnership deed / MOA / AOA\n- Bank account opening documents\n- Insurance policies\n- Employment contracts\n- NDA templates",
      "## Organization Tips",
      "- Use a digital filing system from day one\n- Name files consistently: CompanyName_DocumentType_Date\n- Keep both digital and physical copies of legal documents\n- Set calendar reminders for renewal dates",
      "## Using BizHive's Document Library",
      "Browse by category (Legal, Financial, HR, Contracts). Download templates, fill in your details, and save to your library for easy access.",
    ],
  },
  {
    title: "Community & Networking",
    content: [
      "No entrepreneur succeeds alone. Building a network is one of the most valuable investments you can make.",
      "## Why Community Matters",
      "- Get honest feedback from peers who understand your challenges\n- Find potential co-founders, employees, and partners\n- Learn from others' mistakes (cheaper than making your own)\n- Access opportunities through warm introductions",
      "## BizHive Community",
      "Join discussions on business topics. Share your experience. Ask questions. The more you contribute, the more value you receive.",
      "## External Communities",
      "- Startup India: Official government platform\n- TiE (The Indus Entrepreneurs): Mentorship and networking\n- NASSCOM: For tech startups\n- Industry-specific associations: FICCI, CII, ASSOCHAM\n- Local entrepreneur meetups: Headstart, Startup Weekend",
    ],
  },
  {
    title: "Finding Mentors",
    content: [
      "A good mentor can save you years of trial and error. Here's how to find and work with mentors effectively.",
      "## Where to Find Mentors",
      "- Incubators and accelerators (most offer mentorship)\n- Industry associations and chambers of commerce\n- LinkedIn (reach out respectfully with specific questions)\n- Startup events and conferences\n- Alumni networks (IIT, IIM, other institutions)",
      "## How to Approach a Mentor",
      "- Be specific about what you need help with\n- Show you've done your homework\n- Respect their time (30 minutes max for first meetings)\n- Come prepared with specific questions\n- Follow up with a thank-you and progress updates",
      "## Making the Relationship Work",
      "- Set clear expectations on frequency and format\n- Share wins and challenges honestly\n- Act on their advice (or explain why you chose differently)\n- Don't expect them to do your work — they guide, you execute",
      "> The best mentors are 2-3 stages ahead of you, not 10. They remember the challenges you face because they recently overcame them.",
    ],
  },
  {
    title: "Using Public Data & Government Portals",
    content: [
      "Public datasets and official portals can save founders time, money, and bad assumptions when used well.",
      "## High-Value Government Sources",
      "- RBI for macro and lending context\n- MCA for company filings and incorporation guidance\n- GST resources for indirect tax compliance\n- MSME and Udyam portals for registration support\n- Startup India for schemes and recognition benefits",
      "## How to Use Them Well",
      "- Save official links in one workspace\n- Note update dates and download references you rely on\n- Cross-check old PDFs against the latest portal flow\n- Treat unofficial summaries as secondary, not primary, sources",
      "## Team Workflow",
      "When one founder finds a useful official source, turn it into a reusable note or checklist so the entire team benefits next time.",
      "> A founder who knows where the official answer lives moves faster and makes fewer expensive mistakes.",
    ],
  },
  {
    title: "Creating Your Founder Knowledge Base",
    content: [
      "A knowledge base turns scattered bookmarks, chats, PDFs, and founder memory into a system the team can actually use.",
      "## What to Capture",
      "- Registration steps and deadlines\n- Vendor comparisons\n- Investor feedback patterns\n- Customer objections and winning responses\n- Financial assumptions and key ratios\n- Document renewal calendars",
      "## A Simple Structure",
      "- Playbooks for repeatable tasks\n- Decision logs for major choices\n- Source library for official links and PDFs\n- Templates for email, proposals, and forms\n- Review notes from experiments and launches",
      "## Make It Useful",
      "Keep entries short, dated, and searchable. If a page has not helped someone act faster, rewrite it until it does.",
      "> Knowledge compounds when it is captured clearly enough for the next person to execute without guessing.",
    ],
  },
];

const ResourcesLearn = () => (
  <LearnPage
    title="Learn: Using Resources Effectively"
    subtitle="Maximize the value of tools, documents, and community"
    chapters={chapters}
    pageSlug="resources-learn"
  />
);

export default ResourcesLearn;
