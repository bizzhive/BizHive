import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  Calculator,
  FileCheck2,
  Landmark,
  Layers3,
  Rocket,
  Scale,
  Search,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BeeIcon from "@/components/BeeIcon";
import { useTranslation } from "react-i18next";
import { PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";

const Index = () => {
  const { t } = useTranslation();

  const platformAreas = [
    {
      icon: Layers3,
      title: "Business Planning",
      description: "Shape your model, customer segments, and roadmap with structured planning tools.",
      href: "/plan",
    },
    {
      icon: ShieldCheck,
      title: "Legal & Compliance",
      description: "Prepare documents, understand compliance, and keep launch requirements visible.",
      href: "/legal",
    },
    {
      icon: Calculator,
      title: "Finance & Forecasting",
      description: "Estimate startup costs, revenue paths, and basic unit economics with confidence.",
      href: "/tools",
    },
    {
      icon: Building2,
      title: "Funding & Incubators",
      description: "Discover programs, funding routes, and growth support built for Indian founders.",
      href: "/incubators",
    },
  ];

  const stages = [
    {
      icon: Search,
      step: "01",
      title: "Clarify the opportunity",
      description: "Validate demand, define your market, and turn loose ideas into a real business direction.",
    },
    {
      icon: FileCheck2,
      step: "02",
      title: "Prepare the launch",
      description: "Organize registrations, legal drafts, tax basics, and business setup in one flow.",
    },
    {
      icon: BarChart3,
      step: "03",
      title: "Operate with discipline",
      description: "Use structured tools to track risks, finances, positioning, and decision quality.",
    },
    {
      icon: Rocket,
      step: "04",
      title: "Scale deliberately",
      description: "Use the platform as a system for growth instead of a collection of disconnected pages.",
    },
  ];

  const trustPoints = [
    "India-focused startup and compliance context",
    "One visual system across planning, tools, and documents",
    "Practical founder workflows instead of scattered guides",
    "Structured templates for repeatable output quality",
  ];

  const toolHighlights = [
    {
      icon: Layers3,
      title: "Business Model Canvas",
      description: "Map your model visually and keep each core business block aligned.",
      href: "/tools/business-canvas",
    },
    {
      icon: Scale,
      title: "Legal Document Studio",
      description: "Turn templates into editable, structured drafts with a cleaner workspace.",
      href: "/legal",
    },
    {
      icon: Calculator,
      title: "Financial Calculator",
      description: "Forecast costs, break-even, and growth scenarios from one consistent interface.",
      href: "/tools/financial-calculator",
    },
    {
      icon: BookOpen,
      title: "Learning Paths",
      description: "Move from planning to launch with guided learning sections tied to product flows.",
      href: "/resources/learn",
    },
  ];

  return (
    <div className="page-shell">
      <SiteContainer className="space-y-8 sm:space-y-10">
        <PageHeader
          eyebrow={t("India-first startup workspace")}
          title={
            <>
              {t("One product")}
              <br />
              <span className="text-primary">{t("for planning, launch, and growth.")}</span>
            </>
          }
          description={t(
            "BizHive is being rebuilt into a cleaner, more coherent founder operating system. Use one structured workspace for planning, compliance, tools, and business execution."
          )}
          actions={
            <>
              <Button asChild size="lg">
                <Link to="/dashboard">
                  {t("Open Dashboard")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/tools">{t("Explore Tools")}</Link>
              </Button>
            </>
          }
        />

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Surface className="relative overflow-hidden">
            <div className="grid-overlay absolute inset-0 opacity-40" />
            <div className="relative z-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  <BeeIcon className="h-4 w-4" />
                  {t("Built for business clarity")}
                </div>
                <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
                  {t("The platform should feel like one product, not a pile of tools.")}
                </h2>
                <p className="text-base leading-7 text-muted-foreground">
                  {t(
                    "This new direction standardizes layout, spacing, card systems, document editing, tool UX, and navigation so every part of BizHive feels intentional."
                  )}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {trustPoints.map((point) => (
                    <div
                      key={point}
                      className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm font-medium text-foreground"
                    >
                      {t(point)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Planning modules", value: "12+" },
                  { label: "Interactive tools", value: "5" },
                  { label: "Founder resources", value: "100+" },
                  { label: "Core workflows", value: "4" },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[24px] border border-border/70 bg-card/88 p-5 shadow-sm"
                  >
                    <div className="font-display text-4xl font-semibold tracking-[-0.06em] text-foreground">
                      {metric.value}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(metric.label)}</p>
                  </div>
                ))}
              </div>
            </div>
          </Surface>

          <Surface className="space-y-5">
            <SectionHeading
              eyebrow={t("Core paths")}
              title={t("Choose the path that matches where you are.")}
              description={t(
                "Every major section is being aligned to the same grid, card language, and content hierarchy."
              )}
            />
            <div className="grid gap-3">
              {platformAreas.map((area) => {
                const Icon = area.icon;

                return (
                  <Link
                    key={area.href}
                    to={area.href}
                    className="group rounded-[24px] border border-border/70 bg-background/72 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_16px_34px_rgba(16,12,8,0.08)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                          {t(area.title)}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{t(area.description)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Surface>
        </section>

        <section className="section-shell space-y-6">
          <SectionHeading
            align="center"
            eyebrow={t("Founder journey")}
            title={t("A clearer path from idea to scale")}
            description={t(
              "The platform is strongest when each stage of the journey feels connected instead of abrupt."
            )}
          />
          <div className="grid gap-5 lg:grid-cols-4">
            {stages.map((stage) => {
              const Icon = stage.icon;

              return (
                <Card key={stage.step} className="h-full border-border/70 bg-card/86">
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {stage.step}
                      </span>
                    </div>
                    <CardTitle>{t(stage.title)}</CardTitle>
                    <CardDescription>{t(stage.description)}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="section-shell space-y-6">
          <SectionHeading
            eyebrow={t("Product modules")}
            title={t("Tools, documents, and learning should feel tightly connected")}
            description={t(
              "Instead of isolated pages, BizHive now uses one card language, one grid, and one CTA system across the highest-traffic areas."
            )}
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {toolHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <Link key={item.href} to={item.href} className="group">
                  <Card className="h-full border-border/70 bg-card/86 transition-all hover:-translate-y-1 hover:border-primary/35">
                    <CardHeader>
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{t(item.title)}</CardTitle>
                      <CardDescription>{t(item.description)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        {t("Open module")}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="section-shell">
          <Surface className="overflow-hidden">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {t("Trusted sources")}
                </div>
                <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
                  {t("Grounded in practical Indian business context")}
                </h2>
                <p className="text-base leading-7 text-muted-foreground">
                  {t(
                    "BizHive’s value comes from making regulations, templates, planning, and guidance easier to navigate without losing structure or trust."
                  )}
                </p>
                <Button asChild size="lg">
                  <Link to="/contact">
                    {t("Talk to BizHive")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "MCA and company registration flows",
                  "Startup India and MSME ecosystem context",
                  "GST and compliance-oriented document support",
                  "Founder tools for market, strategy, and finance",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-border/70 bg-background/72 px-4 py-4 text-sm leading-6 text-foreground"
                  >
                    {t(item)}
                  </div>
                ))}
              </div>
            </div>
          </Surface>
        </section>

        <section className="section-shell pt-0">
          <Surface className="bg-[linear-gradient(135deg,_rgba(255,145,77,0.12),_rgba(255,195,77,0.08))]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {t("Next step")}
                </div>
                <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
                  {t("Start with the strongest workflows first")}
                </h2>
                <p className="text-base leading-7 text-muted-foreground">
                  {t(
                    "Open the dashboard, review the tools, or head straight into the document and business-plan workspaces."
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/dashboard">{t("Go to dashboard")}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/documents">{t("Open documents")}</Link>
                </Button>
              </div>
            </div>
          </Surface>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Index;
