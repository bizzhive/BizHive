import {
  BookOpen,
  FileCheck2,
  FileSignature,
  LayoutTemplate,
  LineChart,
  MessageSquareMore,
  Presentation,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type FeatureSpotlight = {
  body: string;
  href: string;
  icon: LucideIcon;
  id: string;
  title: string;
};

export type KnowledgeSource = {
  body: string;
  href: string;
  title: string;
};

export type PremiumFeature = {
  body: string;
  title: string;
};

export type SetupStep = {
  body: string;
  title: string;
};

export type SeedTestimonial = {
  display_name: string;
  feedback: string;
  profession: string;
  rating: number;
};

export const heroFeatureSpotlights: FeatureSpotlight[] = [
  {
    id: "bee",
    title: "Ask Bee anywhere",
    body: "Use fullscreen Bee from the nav or open the copilot while you work on tools, documents, and learning chapters.",
    href: "/ai-assistant",
    icon: MessageSquareMore,
  },
  {
    id: "pitch",
    title: "Pitch deck builder",
    body: "Shape the investor story, traction narrative, and raise ask in a cleaner deck workflow.",
    href: "/tools/pitch-deck-builder",
    icon: Presentation,
  },
  {
    id: "canvas",
    title: "Business canvas",
    body: "Map segments, value, channels, and revenue logic in a structured workspace that you can save.",
    href: "/tools/business-canvas",
    icon: LayoutTemplate,
  },
  {
    id: "incubators",
    title: "Incubators and funding",
    body: "Explore support programs, founder resources, and pitch preparation without leaving the product shell.",
    href: "/incubators",
    icon: Rocket,
  },
  {
    id: "signature",
    title: "E-signature ready",
    body: "Create, save, and reuse your signature for profile workflows and legal document drafting.",
    href: "/dashboard",
    icon: FileSignature,
  },
  {
    id: "languages",
    title: "Regional language ready",
    body: "Switch the guided workspace between English, Hindi, Gujarati, Kannada, Telugu, Marathi, and Tamil.",
    href: "/dashboard",
    icon: Sparkles,
  },
];

export const workspaceHighlights = [
  {
    id: "plan",
    title: "Plan with clarity",
    body: "Customer demand, market mapping, business model thinking, and guided learning in one path.",
    icon: BookOpen,
    href: "/plan",
  },
  {
    id: "launch",
    title: "Launch with control",
    body: "Legal, taxation, documents, signature, and go-live readiness stay inside one operating layer.",
    icon: ShieldCheck,
    href: "/launch",
  },
  {
    id: "grow",
    title: "Grow with rhythm",
    body: "Funding, incubators, calculators, pitch support, and growth learning sit in one operating loop.",
    icon: TrendingUp,
    href: "/manage",
  },
];

export const toolSpotlights = [
  {
    id: "financial",
    title: "Financial planning",
    body: "Startup cost and financial calculators for burn, runway, and pricing confidence.",
    icon: Wallet,
    href: "/tools/financial-calculator",
  },
  {
    id: "strategy",
    title: "Strategy tools",
    body: "Business canvas and SWOT surfaces that store reusable founder thinking instead of one-time notes.",
    icon: LineChart,
    href: "/tools/swot-analysis",
  },
  {
    id: "documents",
    title: "Document and compliance support",
    body: "Templates, editable drafts, and filing prep that connect back to launch and operations.",
    icon: FileCheck2,
    href: "/documents",
  },
];

export const officialKnowledgeSources: KnowledgeSource[] = [
  {
    title: "Ministry of Corporate Affairs (MCA)",
    body: "Company incorporation, company law filings, and official governance references.",
    href: "https://www.mca.gov.in/",
  },
  {
    title: "GST Portal",
    body: "GST registration, filing basics, and official tax workflow guidance.",
    href: "https://www.gst.gov.in/",
  },
  {
    title: "Udyam Registration",
    body: "Official MSME registration portal and guidance for small businesses in India.",
    href: "https://udyamregistration.gov.in/",
  },
  {
    title: "Startup India",
    body: "Programs, recognition, policy explainers, and support resources for Indian startups.",
    href: "https://www.startupindia.gov.in/",
  },
  {
    title: "DGFT",
    body: "Import-export code and trade-related official workflows.",
    href: "https://www.dgft.gov.in/",
  },
  {
    title: "FSSAI FoSCoS",
    body: "Food business registration and compliance guidance for applicable businesses.",
    href: "https://foscos.fssai.gov.in/",
  },
];

export const premiumFeaturePreview: PremiumFeature[] = [
  {
    title: "Private founder channels",
    body: "Members-only community rooms for peer circles, workshops, and guided founder cohorts.",
  },
  {
    title: "Advanced tool stack",
    body: "Expanded calculators, premium document kits, richer AI drafting surfaces, and better export workflows.",
  },
  {
    title: "Events and workshops",
    body: "Webinars, live clinics, and structured learning sessions that extend the self-serve workspace.",
  },
  {
    title: "Priority support",
    body: "Faster support, feedback loops, and curated founder resources as the product grows.",
  },
];

export const onboardingSetupSteps: SetupStep[] = [
  {
    title: "Set your profile and signature",
    body: "Save your working identity, language, business stage, and signature first so the rest of the product can personalize around you.",
  },
  {
    title: "Pick your current path",
    body: "Jump into Plan, Launch, or Grow based on where the business is right now. The product should always make that next path obvious.",
  },
  {
    title: "Save something immediately",
    body: "Use one tool, document, or legal draft right away so the saved library becomes valuable from day one.",
  },
  {
    title: "Start the walkthrough",
    body: "Use the guided walkthrough to understand nav structure, Bee entry points, learning tracks, and premium previews without guessing.",
  },
];

export const seededTestimonials: SeedTestimonial[] = [
  { display_name: "Aditi Rao", profession: "Student founder", rating: 5, feedback: "This finally feels like one startup workspace instead of ten disconnected pages." },
  { display_name: "Harsh Jain", profession: "Cafe owner", rating: 5, feedback: "The launch and compliance sections actually make sense to me now." },
  { display_name: "Maya S.", profession: "Teen maker", rating: 4, feedback: "The product feels brighter, faster, and way less intimidating than before." },
  { display_name: "Arjun Patel", profession: "Freelance designer", rating: 5, feedback: "Saving documents and reopening them from the dashboard is the kind of workflow I wanted." },
  { display_name: "Ishita K.", profession: "Campus entrepreneur", rating: 4, feedback: "I like that the learning path feels rewarding instead of just looking like a long article." },
  { display_name: "Zayan M.", profession: "Small business operator", rating: 5, feedback: "The compact panels keep everything visible without endless scrolling." },
  { display_name: "Rhea T.", profession: "Food brand founder", rating: 5, feedback: "The legal and signature flows feel much more usable than the usual template sites." },
  { display_name: "Devansh V.", profession: "Pitch deck intern", rating: 4, feedback: "Bee being available from both the nav and the side widget is a smart move." },
  { display_name: "Neha L.", profession: "Boutique owner", rating: 5, feedback: "The regional language support makes the workspace feel more welcoming for real users." },
  { display_name: "Karan D.", profession: "Early-stage founder", rating: 5, feedback: "I can actually tell where I am in the app now. That alone is a huge improvement." },
  { display_name: "Pooja R.", profession: "Operations manager", rating: 4, feedback: "The community screen is much easier to understand when topic creation and replies are separated clearly." },
  { display_name: "Sameer A.", profession: "Startup mentor", rating: 5, feedback: "The home page explains the product clearly enough that I would share it with new founders." },
  { display_name: "Tanvi N.", profession: "College incubator member", rating: 5, feedback: "Incubators finally feel like a proper product surface instead of a placeholder." },
  { display_name: "Rohit G.", profession: "Agency founder", rating: 4, feedback: "The premium preview is framed well. It teases future value without making the free product feel broken." },
  { display_name: "Nikhil B.", profession: "Workshop attendee", rating: 5, feedback: "This feels more international and modern while still being useful for Indian founders." },
];
