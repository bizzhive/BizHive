import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Building2,
  Languages,
  Rocket,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ClayGraphicVariant = "default" | "workspace" | "tools" | "network" | "ai";

type ClayGraphicProps = {
  className?: string;
  compact?: boolean;
  variant?: ClayGraphicVariant;
};

type GraphicMetric = {
  icon: LucideIcon;
  label: string;
  value: string;
};

const variantContent: Record<
  ClayGraphicVariant,
  {
    chip: string;
    headline: string;
    subline: string;
    metrics: GraphicMetric[];
    highlights: string[];
  }
> = {
  default: {
    chip: "Founder operating system",
    headline: "Plan, launch, and grow from one screen",
    subline: "Business, documents, learning, and AI guidance stay in one product rhythm.",
    metrics: [
      { icon: Sparkles, label: "Chapters", value: "45+" },
      { icon: Languages, label: "Languages", value: "7" },
      { icon: Bot, label: "Bee access", value: "2 modes" },
    ],
    highlights: ["Launch-ready workflows", "Clay-style product visuals", "Desktop-wide layout"],
  },
  workspace: {
    chip: "Workspace mode",
    headline: "Profile, signature, and saved work stay visible",
    subline: "Dense work panels with better hierarchy and less wasted height.",
    metrics: [
      { icon: BriefcaseBusiness, label: "Saved tools", value: "7+" },
      { icon: ShieldCheck, label: "Drafts", value: "Reusable" },
      { icon: Languages, label: "Locale", value: "Synced" },
    ],
    highlights: ["View-first profile", "Reusable e-signature", "Walkthrough and guide"],
  },
  tools: {
    chip: "Tool stack",
    headline: "Compact tools that save back into the product",
    subline: "Calculators, canvas work, pitch prep, and compliance flow through one system.",
    metrics: [
      { icon: BarChart3, label: "Workbenches", value: "8" },
      { icon: Bot, label: "AI assist", value: "Ready" },
      { icon: ShieldCheck, label: "Save & reopen", value: "Built in" },
    ],
    highlights: ["Business canvas", "Pitch deck builder", "Financial tools"],
  },
  network: {
    chip: "Founder network",
    headline: "Incubators, funding, and pitch prep in one finder",
    subline: "Shortlist real support programs without losing your business context.",
    metrics: [
      { icon: Building2, label: "Programs", value: "500+" },
      { icon: Rocket, label: "Funding cues", value: "Tracked" },
      { icon: Sparkles, label: "Pitch prep", value: "Guided" },
    ],
    highlights: ["Search by state", "Compare focus and stage", "Move into pitch flow"],
  },
  ai: {
    chip: "Bee AI",
    headline: "Fullscreen history and a live copilot",
    subline: "One assistant layer that follows the page, remembers the session, and stays brand-native.",
    metrics: [
      { icon: Bot, label: "History", value: "Persistent" },
      { icon: Sparkles, label: "Context", value: "Route aware" },
      { icon: Languages, label: "Product tone", value: "BizHive-first" },
    ],
    highlights: ["Selection to Bee", "Retry without losing thread", "Copilot + fullscreen"],
  },
};

export const ClayGraphic = ({ className, compact = false, variant = "default" }: ClayGraphicProps) => {
  const content = variantContent[variant];
  const visibleMetrics = compact ? content.metrics.slice(0, 2) : content.metrics;
  const visibleHighlights = compact ? content.highlights.slice(0, 2) : content.highlights;

  return (
    <div className={cn("relative isolate overflow-hidden rounded-[34px]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,195,142,0.98),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(255,127,82,0.88),transparent_26%),radial-gradient(circle_at_82%_78%,rgba(214,96,79,0.84),transparent_28%),radial-gradient(circle_at_34%_78%,rgba(255,236,218,0.96),transparent_30%),linear-gradient(160deg,rgba(255,248,241,0.98),rgba(240,223,210,0.92))] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(255,155,89,0.38),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(188,79,63,0.44),transparent_28%),radial-gradient(circle_at_78%_80%,rgba(110,48,41,0.7),transparent_30%),radial-gradient(circle_at_36%_80%,rgba(83,37,31,0.86),transparent_32%),linear-gradient(165deg,rgba(53,31,29,0.98),rgba(26,17,16,0.98))]" />
      <div className="motion-drift absolute -left-10 top-12 h-28 w-28 rounded-[34px] bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_24px_42px_rgba(208,102,51,0.2)] dark:bg-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_28px_52px_rgba(0,0,0,0.28)]" />
      <div className="motion-float absolute left-[44%] top-7 h-28 w-28 rounded-[38px] bg-[linear-gradient(180deg,#ffd09e,#ff8b4c)] shadow-[inset_0_10px_24px_rgba(255,255,255,0.28),0_30px_54px_rgba(226,109,49,0.28)]" />
      <div className="motion-float-delayed absolute right-8 top-14 h-[5.5rem] w-[5.5rem] rounded-full bg-[linear-gradient(180deg,#fff4ec,#ffd6c1)] shadow-[inset_0_6px_18px_rgba(255,255,255,0.56),0_18px_30px_rgba(182,95,58,0.2)] dark:bg-[linear-gradient(180deg,rgba(255,232,215,0.22),rgba(150,72,54,0.76))]" />
      <div className="motion-float absolute bottom-10 left-10 h-20 w-20 rounded-[28px] bg-[linear-gradient(180deg,#fff8ee,#ffd7b1)] shadow-[inset_0_6px_18px_rgba(255,255,255,0.56),0_18px_32px_rgba(194,100,51,0.18)] dark:bg-[linear-gradient(180deg,rgba(255,230,214,0.16),rgba(123,51,41,0.76))]" />
      <div className="motion-float-delayed absolute bottom-7 right-10 h-24 w-24 rounded-[30px] bg-[linear-gradient(180deg,#ffa96a,#ff703f)] shadow-[inset_0_8px_20px_rgba(255,255,255,0.22),0_22px_40px_rgba(220,95,39,0.24)]" />

      <div className="absolute left-5 top-5 hidden sm:block">
        <div className="clay-pill motion-float">{content.chip}</div>
      </div>

      <div className="absolute left-5 right-5 bottom-5 z-[1] grid gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="rounded-[28px] border border-white/55 bg-white/62 p-5 shadow-[0_22px_48px_rgba(171,95,55,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_26px_54px_rgba(0,0,0,0.3)]">
          <div className="max-w-xl">
            <div className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground xl:text-[2rem]">
              {content.headline}
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground xl:text-[0.98rem]">{content.subline}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {visibleHighlights.map((item) => (
              <span key={item} className="clay-pill">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden gap-3 xl:grid">
          {visibleMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className={cn(
                  "rounded-[24px] border border-white/55 bg-white/60 p-4 shadow-[0_18px_36px_rgba(171,95,55,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_22px_40px_rgba(0,0,0,0.28)]",
                  index % 2 === 0 ? "motion-float" : "motion-float-delayed"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-primary/14 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {metric.label}
                    </div>
                    <div className="mt-1 font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
                      {metric.value}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
