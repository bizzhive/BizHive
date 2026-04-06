import { Calculator, LayoutTemplate, LineChart, Presentation, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useTranslation } from "react-i18next";

const toolCards = [
  { href: "/tools/business-canvas", titleKey: "tools.cards.businessCanvas.title", icon: LayoutTemplate, categoryKey: "tools.cards.businessCanvas.category" },
  { href: "/tools/swot-analysis", titleKey: "tools.cards.swotAnalysis.title", icon: LineChart, categoryKey: "tools.cards.swotAnalysis.category" },
  { href: "/tools/startup-calculator", titleKey: "tools.cards.startupCalculator.title", icon: Calculator, categoryKey: "tools.cards.startupCalculator.category" },
  { href: "/tools/financial-calculator", titleKey: "tools.cards.financialCalculator.title", icon: Wallet, categoryKey: "tools.cards.financialCalculator.category" },
  { href: "/tools/pitch-deck-builder", titleKey: "tools.cards.pitchDeckBuilder.title", icon: Presentation, categoryKey: "tools.cards.pitchDeckBuilder.category" },
];

type ToolCategory = { body: string; title: string };

const Tools = () => {
  const { t } = useTranslation();
  const categories = useMemo(
    () => t("tools.categories", { returnObjects: true }) as ToolCategory[],
    [t]
  );

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow={t("tools.eyebrow")}
          title={t("tools.title")}
          description={t("tools.description")}
          actions={
            <Button asChild size="lg" className="h-12 rounded-2xl px-5">
              <Link to="/dashboard">{t("tools.openDashboard")}</Link>
            </Button>
          }
        />

        <section className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <Surface key={category.title}>
              <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                {category.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.body}</p>
            </Surface>
          ))}
        </section>

        <section className="space-y-4">
          <SectionHeading
            eyebrow={t("tools.directoryEyebrow")}
            title={t("tools.directoryTitle")}
            description={t("tools.directoryDescription")}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {toolCards.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.href} to={tool.href}>
                  <Surface className="h-full transition-colors hover:bg-accent/60">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {t(tool.categoryKey)}
                    </div>
                    <div className="mt-2 font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
                      {t(tool.titleKey)}
                    </div>
                  </Surface>
                </Link>
              );
            })}
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Tools;
