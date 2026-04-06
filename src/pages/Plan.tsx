import { Link } from "react-router-dom";
import { BookOpen, ClipboardList, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClayGraphic } from "@/components/ClayGraphic";
import { planChapters } from "@/content/learning";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";

const Plan = () => {
  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Plan"
          title="Validate the business before you overbuild the business"
          description="Use planning as a compact founder workspace for market research, customer understanding, business model design, and guided learning."
          icon={ClipboardList}
          visual={<ClayGraphic className="h-full min-h-[240px]" compact />}
          actions={
            <>
              <Button asChild className="h-12 rounded-2xl px-5">
                <Link to="/plan/learn">Start the 15-chapter learn track</Link>
              </Button>
              <Button asChild variant="ghost" className="glass-button h-12">
                <Link to="/plan/market-research">Open market research</Link>
              </Button>
            </>
          }
        />

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Surface className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { title: "15 chapters", body: "A full planning curriculum from validation to business-model discipline." },
                { title: "2 key tools", body: "Market research and business plan workspaces that save directly to your founder stack." },
                { title: "1 clear outcome", body: "A business you can explain with evidence instead of vague excitement." },
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
                  title: "Market research",
                  body: "Capture customer pain, competitor alternatives, and the price signal that matters.",
                  href: "/plan/market-research",
                  icon: SearchCheck,
                },
                {
                  title: "Business plan",
                  body: "Turn scattered notes into one readable founder narrative with milestones and economics.",
                  href: "/plan/business-plan",
                  icon: ClipboardList,
                },
                {
                  title: "Planning learn track",
                  body: "Read through the 15 planning chapters and track your progress with XP and workbooks.",
                  href: "/plan/learn",
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
            <div className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">What you will learn here</div>
            <div className="grid gap-3">
              {planChapters.slice(0, 5).map((chapter, index) => (
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

export default Plan;
