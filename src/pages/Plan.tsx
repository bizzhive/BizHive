import { Link } from "react-router-dom";
import { BookOpen, ClipboardList, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClayGraphic } from "@/components/ClayGraphic";
import { planChapters } from "@/content/learning";
import { PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";

const Plan = () => {
  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Plan"
          title="Validate the business before you overbuild it"
          description="Use the planning path for customer research, business model clarity, founder decision-making, and your 15-chapter learning track."
          icon={ClipboardList}
          visual={<ClayGraphic className="h-full min-h-[280px] xl:min-h-[360px]" compact variant="workspace" />}
          actions={
            <>
              <Button asChild className="h-11 rounded-2xl px-5">
                <Link to="/plan/learn">Open learn track</Link>
              </Button>
              <Button asChild variant="ghost" className="glass-button h-11">
                <Link to="/plan/market-research">Open market research</Link>
              </Button>
            </>
          }
        />

        <section className="split-stage">
          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="Start here"
              title="What planning should help you answer"
              description="A strong planning phase should make the customer, problem, offer, and next experiment easier to explain."
            />
            <div className="three-up">
              {[
                {
                  title: "Market research",
                  body: "Capture demand, buying behavior, and competitor alternatives in one saved workspace.",
                  href: "/plan/market-research",
                  icon: SearchCheck,
                },
                {
                  title: "Business plan",
                  body: "Turn loose thoughts into a readable founder narrative with milestones and economics.",
                  href: "/plan/business-plan",
                  icon: ClipboardList,
                },
                {
                  title: "Planning learn track",
                  body: "Read all 15 chapters with XP, notes, and checkpoints that stay saved.",
                  href: "/plan/learn",
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
              title="Chapter preview"
              description="Move through the essentials in a cleaner order instead of jumping randomly between disconnected advice."
            />
            <div className="grid gap-3">
              {planChapters.slice(0, 6).map((chapter, index) => (
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

export default Plan;
