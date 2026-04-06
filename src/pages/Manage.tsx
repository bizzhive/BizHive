import { Link } from "react-router-dom";
import { BookOpen, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClayGraphic } from "@/components/ClayGraphic";
import { growChapters } from "@/content/learning";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";

const Manage = () => {
  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Grow"
          title="Operate, fund, and scale the business without losing the plot"
          description="The growth workspace combines metrics, tool use, funding preparation, and founder education so growth feels designed instead of reactive."
          icon={TrendingUp}
          visual={<ClayGraphic className="h-full min-h-[240px]" compact />}
          actions={
            <>
              <Button asChild className="h-12 rounded-2xl px-5">
                <Link to="/manage/learn">Start the 15-chapter growth track</Link>
              </Button>
              <Button asChild variant="ghost" className="glass-button h-12">
                <Link to="/incubators">Explore incubators</Link>
              </Button>
            </>
          }
        />

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Surface className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { title: "15 chapters", body: "A full growth curriculum covering metrics, hiring, focus, funding, and operational maturity." },
                { title: "Incubators ready", body: "Funding and program discovery now lives as a proper top-level product route." },
                { title: "Tool-supported", body: "Growth decisions connect directly to calculators, pitch prep, and saved founder work." },
              ].map((item) => (
                <div key={item.title} className="panel-muted p-4">
                  <div className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">{item.title}</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                {
                  title: "Incubators and funding",
                  body: "Search for the right support programs, compare funding pathways, and shortlist the strongest opportunities.",
                  href: "/incubators",
                  icon: Building2,
                },
                {
                  title: "Founder tools",
                  body: "Use the tool suite to pressure-test financials, strategy, and pitch readiness as the business grows.",
                  href: "/tools",
                  icon: TrendingUp,
                },
                {
                  title: "Growth learn track",
                  body: "Work through 15 chapters focused on operating rhythm, metrics, delegation, and funding readiness.",
                  href: "/manage/learn",
                  icon: BookOpen,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} to={item.href} className="panel-muted p-4 transition-colors hover:bg-accent/65">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{item.title}</div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </Link>
                );
              })}
            </div>
          </Surface>

          <Surface className="space-y-4">
            <div className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">Growth learning preview</div>
            <div className="grid gap-3">
              {growChapters.slice(0, 5).map((chapter, index) => (
                <div key={chapter.title} className="panel-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Chapter {index + 1}</div>
                  <div className="mt-2 font-semibold text-foreground">{chapter.title}</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{chapter.content[0]}</p>
                </div>
              ))}
            </div>
          </Surface>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Manage;
