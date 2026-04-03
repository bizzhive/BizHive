import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  ChevronRight,
  DollarSign,
  Home,
  Layers3,
  PieChart,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState, PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useTranslation } from "react-i18next";

const toolCatalog = [
  {
    name: "Business Model Canvas",
    description: "Map the model, customers, channels, and value exchange in one structured workspace.",
    icon: Layers3,
    href: "/tools/business-canvas",
    category: "Strategy",
    features: ["9 key blocks", "Visual layout", "Save progress", "Reusable outputs"],
  },
  {
    name: "SWOT Analysis",
    description: "Break your business into strengths, weaknesses, opportunities, and threats for clearer decisions.",
    icon: TrendingUp,
    href: "/tools/swot-analysis",
    category: "Strategy",
    features: ["Strategic framing", "Actionable prompts", "Save work", "Shareable summary"],
  },
  {
    name: "Startup Cost Calculator",
    description: "Estimate the capital needed for launch, monthly burn, and early runway.",
    icon: Calculator,
    href: "/tools/startup-calculator",
    category: "Finance",
    features: ["One-time costs", "Monthly costs", "Runway planning", "Capital target"],
  },
  {
    name: "Financial Calculator",
    description: "Project revenue, expenses, break-even points, and profit direction with a more useful layout.",
    icon: DollarSign,
    href: "/tools/financial-calculator",
    category: "Finance",
    features: ["Revenue projections", "Expense planning", "Break-even", "Scenario review"],
  },
  {
    name: "Pitch Deck Builder",
    description: "Create a guided investor narrative with autosave and a live presentation-style preview.",
    icon: PieChart,
    href: "/tools/pitch-deck-builder",
    category: "Storytelling",
    features: ["10-slide structure", "Autosave", "Slide preview", "Draft export"],
  },
];

const upcoming = [
  {
    name: "Market Size Calculator",
    description: "Estimate TAM, SAM, and SOM with a structured top-down and bottom-up workflow.",
    icon: BarChart3,
  },
];

const categories = ["All", "Strategy", "Finance", "Storytelling"];

const Tools = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTools = useMemo(() => {
    return toolCatalog.filter((tool) => {
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      const normalizedQuery = searchQuery.trim().toLowerCase();

      if (!normalizedQuery) {
        return matchesCategory;
      }

      const haystack = [tool.name, tool.description, tool.category, ...tool.features].join(" ").toLowerCase();
      return matchesCategory && haystack.includes(normalizedQuery);
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="page-shell">
      <SiteContainer className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
            <Home className="h-4 w-4" />
            {t("Home")}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{t("Tools")}</span>
        </div>

        <PageHeader
          eyebrow={t("Business toolkit")}
          title={t("A cleaner tool library for repeatable founder work")}
          description={t(
            "The tools section now follows a stronger hierarchy: one page shell, one search pattern, one card system, and clearer categories for strategy, finance, and business storytelling."
          )}
          actions={
            <>
              <Button asChild size="lg">
                <Link to="/tools/business-canvas">{t("Open Business Canvas")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">{t("Back to dashboard")}</Link>
              </Button>
            </>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[0.76fr_1.24fr]">
          <Surface className="space-y-5">
            <SectionHeading
              eyebrow={t("Tool search")}
              title={t("Find the right workspace quickly")}
              description={t(
                "Search by use case or filter by category. This sets the pattern for search expansion into blogs and learning next."
              )}
            />

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("Search tools, workflows, or outcomes...")}
                className="h-12 rounded-2xl border-border/70 bg-muted/35 pl-11"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
                    selectedCategory === category
                      ? "border-primary/30 bg-primary text-primary-foreground"
                      : "border-border/70 bg-background/70 text-foreground hover:bg-accent"
                  }`}
                >
                  {t(category)}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {[
                {
                  title: "Clear category grouping",
                  description: "Strategy, finance, and storytelling now read like one suite instead of scattered cards.",
                },
                {
                  title: "Consistent launch actions",
                  description: "Every tool card now uses the same CTA weight, spacing, and metadata treatment.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] border border-border/70 bg-background/72 p-4">
                  <div className="font-display text-lg font-semibold tracking-[-0.04em] text-foreground">
                    {t(item.title)}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{t(item.description)}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow={t("Available tools")}
                title={t("Focused tools for the most common founder workflows")}
                description={t("Browse what is ready today, then use search to narrow the list as the catalog grows.")}
              />
              <Badge className="w-fit rounded-full border-none bg-primary/10 px-3 py-1 text-primary">
                {filteredTools.length} {t("results")}
              </Badge>
            </div>

            {filteredTools.length === 0 ? (
              <EmptyState
                icon={<Target className="h-6 w-6" />}
                title={t("No matching tools")}
                description={t("Try a broader search term or switch back to the full catalog.")}
                action={
                  <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                    {t("Reset filters")}
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;

                  return (
                    <Card key={tool.name} className="group h-full border-border/70 bg-card/88 transition-all hover:-translate-y-1 hover:border-primary/35">
                      <CardHeader>
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <Badge variant="secondary" className="rounded-full px-3 py-1">
                            {t(tool.category)}
                          </Badge>
                        </div>
                        <CardTitle>{t(tool.name)}</CardTitle>
                        <CardDescription>{t(tool.description)}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="grid gap-2 sm:grid-cols-2">
                          {tool.features.map((feature) => (
                            <div key={feature} className="rounded-2xl bg-muted/45 px-3 py-2 text-sm text-muted-foreground">
                              {t(feature)}
                            </div>
                          ))}
                        </div>
                        <Button asChild className="w-full">
                          <Link to={tool.href}>
                            {t("Launch Tool")}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </Surface>
        </section>

        <section className="section-shell space-y-5">
          <SectionHeading
            eyebrow={t("Coming next")}
            title={t("The catalog is ready to grow without breaking the UI")}
            description={t(
              "Upcoming tools can now slot into the same category, search, and card system instead of needing a new page layout each time."
            )}
          />
          <div className="grid gap-5 md:grid-cols-2">
            {upcoming.map((tool) => {
              const Icon = tool.icon;

              return (
                <Card key={tool.name} className="border-dashed border-border/70 bg-muted/18">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{t(tool.name)}</CardTitle>
                    <CardDescription>{t(tool.description)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button disabled className="w-full rounded-2xl">
                      {t("Coming Soon")}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Tools;
