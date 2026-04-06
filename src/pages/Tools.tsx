import { Link } from "react-router-dom";
import {
  Calculator,
  FileSignature,
  Grid2X2,
  LayoutTemplate,
  LineChart,
  Presentation,
  SearchCheck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClayGraphic } from "@/components/ClayGraphic";
import { PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";

const toolCards = [
  {
    href: "/plan/market-research",
    title: "Market research",
    category: "Planning",
    body: "Study demand, customers, competitor alternatives, and buying signals in one structured workspace.",
    icon: SearchCheck,
  },
  {
    href: "/plan/business-plan",
    title: "Business plan builder",
    category: "Planning",
    body: "Build a cleaner founder narrative with milestones, operating assumptions, and a reviewable document flow.",
    icon: Grid2X2,
  },
  {
    href: "/tools/business-canvas",
    title: "Business canvas",
    category: "Strategy",
    body: "Map segments, value proposition, channels, and business logic without turning the page into a wall of forms.",
    icon: LayoutTemplate,
  },
  {
    href: "/tools/swot-analysis",
    title: "SWOT analysis",
    category: "Strategy",
    body: "Capture strengths, weaknesses, opportunities, and threats in an easier team-review format.",
    icon: LineChart,
  },
  {
    href: "/tools/startup-calculator",
    title: "Startup calculator",
    category: "Finance",
    body: "Estimate setup cost, monthly burn, runway, and what early revenue needs to support.",
    icon: Calculator,
  },
  {
    href: "/tools/financial-calculator",
    title: "Financial calculator",
    category: "Finance",
    body: "Check gross margin, net outcome, pricing comfort, and annualized revenue in a founder-readable layout.",
    icon: Wallet,
  },
  {
    href: "/tools/pitch-deck-builder",
    title: "Pitch deck builder",
    category: "Fundraising",
    body: "Structure the investor story, slide logic, traction proof, and the funding ask in one flow.",
    icon: Presentation,
  },
  {
    href: "/legal",
    title: "Legal studio",
    category: "Documents",
    body: "Draft agreements, save legal work, capture signatures, and reopen the latest versions from your dashboard.",
    icon: FileSignature,
  },
] as const;

const Tools = () => {
  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Tool stack"
          title="Use focused founder tools that save back into the product"
          description="BizHive tools are not isolated widgets. They connect to your dashboard, Bee prompts, documents, and ongoing business context so the work remains reusable."
          icon={Grid2X2}
          visual={<ClayGraphic className="h-full min-h-[320px] xl:min-h-[400px]" variant="tools" />}
          actions={
            <>
              <Button asChild className="h-12 rounded-2xl px-5">
                <Link to="/dashboard">Open dashboard</Link>
              </Button>
              <Button asChild variant="ghost" className="glass-button h-12">
                <Link to="/ai-assistant">Open Bee AI</Link>
              </Button>
            </>
          }
        />

        <section className="feature-wall">
          <Surface className="space-y-4 overflow-hidden">
            <SectionHeading
              eyebrow="What makes the tools useful"
              title="Each workspace is built to be compact, savable, and AI-ready"
              description="The product now keeps business planning, calculators, canvas work, legal drafting, and pitch prep in the same design language instead of scattering them across mismatched pages."
            />
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  {
                    title: "Saved to library",
                    body: "Most structured tools push work back into your dashboard so it stays easy to reopen later.",
                  },
                  {
                    title: "Bee-assisted",
                    body: "Key workbenches can hand context into Bee so users can ask for clarification or stronger phrasing.",
                  },
                  {
                    title: "Desktop-balanced",
                    body: "Panels are designed to use screen width more effectively instead of shrinking every tool into a narrow center strip.",
                  },
                ].map((item) => (
                  <div key={item.title} className="panel-muted card-lift p-4">
                    <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{item.title}</div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>

              <ClayGraphic className="h-full min-h-[320px]" compact variant="tools" />
            </div>
          </Surface>

          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="Suggested sequence"
              title="A clean order for new founders"
              description="The tool stack works best when it follows one logical flow instead of random jumping."
            />
            <div className="grid gap-3">
              {[
                "Start with Market research to test whether the problem is real.",
                "Use the Business canvas to shape the model before writing long-form plans.",
                "Draft the Business plan once the customer, offer, and delivery logic are clearer.",
                "Use calculators when pricing, runway, and launch timing become real decisions.",
                "Open the Pitch deck only after the business story and numbers are already grounded.",
              ].map((item, index) => (
                <div key={item} className="panel-muted flex items-start gap-3 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </Surface>
        </section>

        <section className="space-y-4">
          <SectionHeading
            eyebrow="Tool directory"
            title="Everything available in the product right now"
            description="The cards below link straight into the working routes so testers can see a complete product map instead of placeholders."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {toolCards.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link key={tool.href} to={tool.href}>
                  <Surface className="card-lift h-full transition-colors hover:bg-accent/60">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {tool.category}
                    </div>
                    <div className="mt-2 font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
                      {tool.title}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{tool.body}</p>
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
