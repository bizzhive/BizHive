import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle,
  Cog,
  DollarSign,
  Rocket,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FAQSection from "@/components/FAQSection";
import { PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useTranslation } from "react-i18next";

const manageFAQs = [
  {
    question: "When should I start scaling my business?",
    answer:
      "Scale when revenue, demand, and delivery systems are stable enough that growth will amplify strength rather than amplify failure.",
  },
  {
    question: "How do I manage cash flow during growth?",
    answer:
      "Forecast cash, protect runway, and separate revenue excitement from actual operating health. Growth pressure makes discipline more important, not less.",
  },
  {
    question: "What metrics should I track?",
    answer:
      "Track the metrics that reflect delivered value, acquisition efficiency, retention, and operating stability. Not every number deserves dashboard space.",
  },
  {
    question: "How do I build a strong team while scaling?",
    answer:
      "Document outcomes first, then hire into clear roles. Scaling without process clarity usually creates management drag instead of leverage.",
  },
  {
    question: "Should I seek external funding to grow?",
    answer:
      "Only when capital clearly improves speed or defensibility. Funding is a strategic tool, not automatic validation.",
  },
];

const managementAreas = [
  {
    icon: TrendingUp,
    title: "Scale operations",
    description: "Expand delivery capacity without turning the company into a coordination problem.",
    path: "/tools",
    bullets: ["Team expansion", "Process optimization", "Operational visibility"],
  },
  {
    icon: Users,
    title: "Customer systems",
    description: "Retention, support, and customer understanding should mature as fast as acquisition does.",
    path: "/community",
    bullets: ["Support loops", "Feedback systems", "Customer continuity"],
  },
  {
    icon: DollarSign,
    title: "Financial control",
    description: "Keep cash, pricing, and unit economics visible while the business becomes more complex.",
    path: "/tools/financial-calculator",
    bullets: ["Cash flow discipline", "Pricing review", "Runway awareness"],
  },
];

const scalingStrategies = [
  { icon: Target, title: "Market expansion", description: "Enter adjacent markets only after the current one is working.", path: "/plan/market-research" },
  { icon: BarChart3, title: "Performance analytics", description: "Use data to make weekly decisions instead of retrospective guesses.", path: "/tools/startup-calculator" },
  { icon: Cog, title: "Operational automation", description: "Automate repeated work only after the manual version is understood.", path: "/tools" },
  { icon: Rocket, title: "Growth experiments", description: "Run deliberate experiments rather than scattered marketing activity.", path: "/blog" },
  { icon: Shield, title: "Risk management", description: "Protect growth with compliance, contracts, and better decision hygiene.", path: "/legal" },
  { icon: Award, title: "Quality control", description: "Make quality measurable before volume pushes it downward.", path: "/launch" },
];

const growthPrinciples = [
  {
    title: "Unit economics first",
    description: "A business that loses money faster under growth is not scaling, it is compounding risk.",
  },
  {
    title: "Systems before headcount",
    description: "Teams scale better when the operating model is visible and repeatable, not trapped in one founder's head.",
  },
  {
    title: "Retention compounds value",
    description: "Growth gets healthier when existing customers stay, expand, and create proof for the next wave.",
  },
];

const Manage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="page-shell">
      <SiteContainer className="space-y-8">
        <PageHeader
          eyebrow="Grow"
          title={t("Scale the business without losing control")}
          description={t("The manage layer now feels more like a scaling workspace and less like a loose set of ideas. Strategy, metrics, customer systems, and operating discipline all sit under one clearer frame.")}
          actions={
            <>
              <Button size="lg" onClick={() => navigate("/tools")}>
                {t("Open growth tools")}
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/manage/learn")}>
                {t("Open growth learning")}
              </Button>
            </>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <Surface className="space-y-5">
            <SectionHeading
              eyebrow="Growth frame"
              title={t("Scale only what already works")}
              description={t("This page now explains growth as a systems problem, not just an ambition problem.")}
            />
            <div className="space-y-4">
              {growthPrinciples.map((principle) => (
                <div key={principle.title} className="rounded-[22px] border border-border/70 bg-background/72 p-4">
                  <div className="font-semibold text-foreground">{t(principle.title)}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(principle.description)}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Operating signals"
                title={t("Growth should feel measured, not accidental")}
                description={t("These signals make the page read like a system-level overview rather than another navigation stop.")}
              />
              <Badge className="w-fit rounded-full border-none bg-primary/10 px-3 py-1 text-primary">
                {t("Management phase")}
              </Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Focus areas",
                  value: "3",
                  description: "Operations, customers, and finance anchor the rest of the growth layer.",
                },
                {
                  label: "Strategy tracks",
                  value: "6",
                  description: "The page now surfaces the most common scale decisions in one structured grid.",
                },
                {
                  label: "Primary warning",
                  value: "Premature",
                  description: "The content intentionally pushes against scaling before the fundamentals are stable.",
                },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] border border-border/70 bg-background/72 p-4">
                  <div className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">{t(item.value)}</div>
                  <div className="mt-1 text-sm font-medium text-foreground">{t(item.label)}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(item.description)}</p>
                </div>
              ))}
            </div>
          </Surface>
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Management areas"
            title={t("Use the right system for the next scale problem")}
            description={t("These cards now feel like connected management lanes instead of loosely related feature boxes.")}
          />
          <div className="grid gap-5 xl:grid-cols-3">
            {managementAreas.map((area) => (
              <Surface key={area.title} className="flex h-full flex-col p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
                  <area.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {t(area.title)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{t(area.description)}</p>
                <div className="mt-5 space-y-3">
                  {area.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{t(bullet)}</span>
                    </div>
                  ))}
                </div>
                <Button className="mt-6 w-full" variant="outline" onClick={() => navigate(area.path)}>
                  {t("Open workflow")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Surface>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Scaling strategies"
            title={t("Explore the next set of growth decisions")}
            description={t("This strategy grid is now cleaner and easier to scan, with each card mapping to a specific next path in the platform.")}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {scalingStrategies.map((strategy) => (
              <button
                key={strategy.title}
                type="button"
                onClick={() => navigate(strategy.path)}
                className="rounded-[24px] border border-border/70 bg-card/88 p-5 text-left transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_36px_rgba(16,12,8,0.08)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <strategy.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {t(strategy.title)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{t(strategy.description)}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {t("Open")}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>
        </section>

        <FAQSection items={manageFAQs} />
      </SiteContainer>
    </div>
  );
};

export default Manage;
