import { Link } from "react-router-dom";
import { BookOpen, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClayGraphic } from "@/components/ClayGraphic";
import { growChapters } from "@/content/learning";
import { PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";

const Manage = () => {
  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Grow"
          title="Operate, fund, and scale without losing the plot"
          description="The growth path brings funding, incubators, tools, and ongoing operator learning into one cleaner workflow."
          icon={TrendingUp}
          visual={<ClayGraphic className="h-full min-h-[280px] xl:min-h-[360px]" compact variant="network" />}
          actions={
            <>
              <Button asChild className="h-11 rounded-2xl px-5">
                <Link to="/manage/learn">Open learn track</Link>
              </Button>
              <Button asChild variant="ghost" className="glass-button h-11">
                <Link to="/incubators">Explore incubators</Link>
              </Button>
            </>
          }
        />

        <section className="split-stage">
          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="Growth actions"
              title="The parts of growth that matter most"
              description="Use this path when the business needs better operating rhythm, stronger financial visibility, and funding readiness."
            />
            <div className="three-up">
              {[
                {
                  title: "Incubators and funding",
                  body: "Search support programs, compare opportunities, and shortlist the right next conversations.",
                  href: "/incubators",
                  icon: Building2,
                },
                {
                  title: "Founder tools",
                  body: "Use calculators, pitch prep, and business tools to make better scaling decisions.",
                  href: "/tools",
                  icon: TrendingUp,
                },
                {
                  title: "Growth learn track",
                  body: "Read 15 chapters focused on metrics, hiring, delegation, retention, and momentum.",
                  href: "/manage/learn",
                  icon: BookOpen,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} to={item.href} className="panel-muted card-lift p-4 transition-colors hover:bg-accent/65">
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
            <SectionHeading
              eyebrow="15 chapters"
              title="Growth chapter preview"
              description="Keep your team, metrics, and scaling choices grounded as the business gets more complex."
            />
            <div className="grid gap-3">
              {growChapters.slice(0, 6).map((chapter, index) => (
                <div key={chapter.title} className="panel-muted flex items-start gap-3 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{chapter.title}</div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{chapter.content[0]}</p>
                  </div>
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
