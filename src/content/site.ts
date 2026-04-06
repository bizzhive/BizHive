import {
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Calculator,
  FileText,
  Globe2,
  HandCoins,
  LayoutDashboard,
  MessagesSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

export const appFeatureGroups = [
  {
    id: "plan",
    icon: BriefcaseBusiness,
    href: "/plan",
    stat: "Strategy",
  },
  {
    id: "launch",
    icon: Rocket,
    href: "/launch",
    stat: "Execution",
  },
  {
    id: "grow",
    icon: TrendingUp,
    href: "/manage",
    stat: "Operations",
  },
  {
    id: "library",
    icon: BookOpen,
    href: "/documents",
    stat: "Resources",
  },
];

export const homeCapabilityIcons = {
  analytics: LayoutDashboard,
  blog: FileText,
  community: MessagesSquare,
  compliance: ShieldCheck,
  docs: FileText,
  funding: HandCoins,
  incubators: Building2,
  language: Globe2,
  mentorship: Users,
  tools: Calculator,
};

export const journeyIconMap = {
  blog: FileText,
  contact: Sparkles,
  dashboard: LayoutDashboard,
  documents: FileText,
  legal: ShieldCheck,
  tools: Calculator,
};

export const testimonials = [
  {
    name: "Aarav Menon",
    role: "SaaS Founder, Bengaluru",
    quote:
      "The biggest difference was clarity. Instead of jumping between docs, calculators, and random bookmarks, the team finally had one operating system.",
  },
  {
    name: "Riya Kapoor",
    role: "Consumer Brand Operator, Delhi",
    quote:
      "The structure feels much more credible now. I can see what each section does, where to go next, and what is already saved for me.",
  },
  {
    name: "Harsh Patel",
    role: "Agency Owner, Ahmedabad",
    quote:
      "The compact panels and saved work areas are exactly what a small founder team needs. It feels like product UI, not a patched landing page.",
  },
];

export const compactMetricCards = [
  { id: "templates", value: "5+", icon: ShieldCheck },
  { id: "documents", value: "10+", icon: FileText },
  { id: "tools", value: "5", icon: Calculator },
  { id: "rooms", value: "4", icon: MessagesSquare },
];
