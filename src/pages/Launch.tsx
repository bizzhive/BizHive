import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Building,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Rocket,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FAQSection from "@/components/FAQSection";
import { PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/services/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const launchFAQs = [
  {
    question: "When is the right time to launch?",
    answer:
      "Launch when you have a minimum viable offer that solves a real problem. Early feedback is more valuable than waiting for perfection.",
  },
  {
    question: "What licenses do I need before launching?",
    answer:
      "It depends on your industry. GST, local registrations, and sector-specific licenses should be reviewed before you begin serving customers.",
  },
  {
    question: "How much should I spend on my initial launch?",
    answer:
      "Start lean. Validate channels and operations before scaling spend on marketing or team expansion.",
  },
  {
    question: "Should I soft launch or go all-in?",
    answer:
      "A soft launch is usually safer. It helps you test systems, gather feedback, and correct issues before broader visibility.",
  },
  {
    question: "What common launch mistakes should I avoid?",
    answer:
      "Skipping validation, ignoring compliance, launching without support systems, and confusing activity with readiness are all common avoidable mistakes.",
  },
];

const launchChecklist = [
  "Business plan finalized and approved",
  "Legal structure established",
  "All licenses and permits obtained",
  "Tax registrations completed",
  "Business bank account opened",
  "Insurance policies in place",
  "Workspace or office setup completed",
  "Technology infrastructure ready",
  "Product or service development finished",
  "Quality testing completed",
  "Pricing strategy finalized",
  "Marketing materials prepared",
  "Website and online presence ready",
  "Team hired and trained",
  "Customer support system in place",
  "Launch marketing campaign planned",
  "Financial projections validated",
  "Risk management plan in place",
];

const launchPhases = [
  {
    phase: "Pre-launch",
    title: "Foundation setup",
    description: "Finish legal, financial, and operational groundwork before customer pressure begins.",
    icon: Building,
    timeframe: "4-8 weeks",
  },
  {
    phase: "Soft launch",
    title: "Market testing",
    description: "Release to a smaller audience and treat feedback like product fuel, not criticism.",
    icon: Target,
    timeframe: "2-4 weeks",
  },
  {
    phase: "Official launch",
    title: "Go to market",
    description: "Bring marketing, sales, support, and offer clarity together in one visible motion.",
    icon: Rocket,
    timeframe: "2-3 weeks",
  },
  {
    phase: "Post-launch",
    title: "Stabilize and grow",
    description: "Use the first wave of data to improve systems instead of prematurely scaling chaos.",
    icon: TrendingUp,
    timeframe: "Ongoing",
  },
];

const supportRoutes = [
  {
    icon: FileText,
    title: "Document library",
    description: "Open templates, official links, and reusable worksheets for launch operations.",
    href: "/documents",
  },
  {
    icon: Shield,
    title: "Legal studio",
    description: "Move from compliance review into editable legal drafts and saved document flows.",
    href: "/legal",
  },
  {
    icon: DollarSign,
    title: "Funding and support",
    description: "Explore incubators, capital options, and support structures once launch basics are in place.",
    href: "/incubators",
  },
];

const Launch = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadChecklist = async () => {
      const { data } = await supabase
        .from("launch_checklist")
        .select("checklist_data")
        .eq("user_id", user.id)
        .single();

      if (data?.checklist_data) {
        setCheckedItems(data.checklist_data as Record<string, boolean>);
      }
    };

    void loadChecklist();
  }, [user]);

  const completedCount = useMemo(() => Object.values(checkedItems).filter(Boolean).length, [checkedItems]);
  const progress = Math.round((completedCount / launchChecklist.length) * 100);

  const toggleItem = async (item: string) => {
    const nextValue = !checkedItems[item];
    const nextState = { ...checkedItems, [item]: nextValue };
    setCheckedItems(nextState);

    if (!user) {
      return;
    }

    const { error } = await supabase.from("launch_checklist").upsert(
      {
        user_id: user.id,
        checklist_data: nextState,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      toast({ title: t("Error"), description: t("Failed to save checklist"), variant: "destructive" });
    }
  };

  return (
    <div className="page-shell">
      <SiteContainer className="space-y-8">
        <PageHeader
          eyebrow="Launch"
          title={t("Turn preparation into a controlled launch")}
          description={t("The launch page now behaves like a real operations workspace: phases, readiness checks, and support paths are grouped logically instead of feeling like separate fragments.")}
          actions={
            <>
              <Button asChild size="lg">
                <Link to="/documents">{t("Open launch documents")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/launch/learn">{t("Open launch learning")}</Link>
              </Button>
            </>
          }
        />

        <section className="grid gap-4 lg:grid-cols-4">
          {[
            {
              label: t("Checklist progress"),
              value: `${completedCount}/${launchChecklist.length}`,
              detail: `${progress}% ${t("complete")}`,
              icon: <BadgeCheck className="h-5 w-5 text-emerald-500" />,
            },
            {
              label: t("Launch mode"),
              value: progress >= 75 ? t("Nearly ready") : t("In preparation"),
              detail: progress >= 75 ? t("You are close to launch execution.") : t("Keep reducing operational gaps."),
              icon: <Rocket className="h-5 w-5 text-primary" />,
            },
            {
              label: t("Recommended path"),
              value: t("Soft launch"),
              detail: t("Test the workflow with a smaller audience before going broad."),
              icon: <Target className="h-5 w-5 text-amber-500" />,
            },
            {
              label: t("System memory"),
              value: user ? t("Synced") : t("Local"),
              detail: user ? t("Checklist changes save to your workspace.") : t("Sign in to save your readiness state."),
              icon: <Clock className="h-5 w-5 text-rose-500" />,
            },
          ].map((item) => (
            <Surface key={item.label} className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
                  <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">{item.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted/70">
                  {item.icon}
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
            </Surface>
          ))}
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Launch phases"
            title={t("Move through launch in clear operating stages")}
            description={t("This replaces the earlier broad cards with a tighter phase model that matches how founders actually prepare to launch.")}
          />
          <div className="grid gap-5 xl:grid-cols-4">
            {launchPhases.map((phase) => (
              <Surface key={phase.phase} className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
                    <phase.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{t(phase.timeframe)}</Badge>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{t(phase.phase)}</div>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {t(phase.title)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(phase.description)}</p>
                </div>
              </Surface>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <Surface className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Readiness checklist"
                title={t("Track launch readiness in one place")}
                description={t("This checklist now has a stronger layout and keeps saved progress visible so launch prep feels cumulative instead of temporary.")}
              />
              <Badge className="w-fit rounded-full border-none bg-primary/10 px-3 py-1 text-primary">
                {progress}% {t("complete")}
              </Badge>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {launchChecklist.map((item) => (
                <label
                  key={item}
                  className="flex items-start gap-3 rounded-[22px] border border-border/70 bg-background/72 px-4 py-4 transition-colors hover:bg-accent/40"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(checkedItems[item])}
                    onChange={() => toggleItem(item)}
                    className="mt-1 h-4 w-4 rounded border-input"
                  />
                  <span className={`text-sm leading-6 ${checkedItems[item] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {t(item)}
                  </span>
                </label>
              ))}
            </div>

            {!user ? (
              <div className="mt-5 rounded-[22px] border border-dashed border-border/70 bg-muted/15 px-4 py-4 text-sm text-muted-foreground">
                {t("Log in to save your checklist progress.")}
              </div>
            ) : null}
          </Surface>

          <div className="space-y-6">
            <Surface className="p-6 sm:p-8">
              <SectionHeading
                eyebrow="Launch note"
                title={t("Why the launch flow feels sharper now")}
                description={t("The screen now groups sequencing, persistence, and support resources into one coherent experience instead of leaving founders to piece it together.")}
              />
              <div className="mt-6 space-y-4">
                {[
                  "Use a soft launch to expose weak systems before they become public failures.",
                  "Treat compliance and customer support as launch blockers, not later tasks.",
                  "Save checklist progress as you go so readiness is measurable across sessions.",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-[22px] border border-border/70 bg-muted/20 p-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">{t(point)}</p>
                  </div>
                ))}
              </div>
            </Surface>

            <Surface className="p-6 sm:p-8">
              <SectionHeading
                eyebrow="Support flows"
                title={t("Open the launch-adjacent systems")}
                description={t("These routes are placed here because founders usually need them during launch, not buried elsewhere in the site.")}
              />
              <div className="mt-6 space-y-3">
                {supportRoutes.map((item) => (
                  <Button key={item.href} asChild variant="outline" className="h-auto w-full justify-between rounded-[22px] px-4 py-4">
                    <Link to={item.href}>
                      <span className="flex items-center gap-3 text-left">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block font-semibold text-foreground">{t(item.title)}</span>
                          <span className="mt-1 block text-sm leading-6 text-muted-foreground">{t(item.description)}</span>
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
            </Surface>
          </div>
        </section>

        <FAQSection items={launchFAQs} />
      </SiteContainer>
    </div>
  );
};

export default Launch;
