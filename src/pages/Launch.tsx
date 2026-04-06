import { Link } from "react-router-dom";
import { BookOpen, Rocket, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClayGraphic } from "@/components/ClayGraphic";
import { launchChapters } from "@/content/learning";
import { PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";

const Launch = () => {
  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Launch"
          title="Go live with legal, tax, and customer readiness aligned"
          description="The launch path keeps registration, compliance, documents, and operating checks in one place so your go-live flow stays organized."
          icon={Rocket}
          visual={<ClayGraphic className="h-full min-h-[280px] xl:min-h-[360px]" compact variant="network" />}
          actions={
            <>
              <Button asChild className="h-11 rounded-2xl px-5">
                <Link to="/launch/learn">Open learn track</Link>
              </Button>
              <Button asChild variant="ghost" className="glass-button h-11">
                <Link to="/legal">Open legal studio</Link>
              </Button>
            </>
          }
        />

        <section className="split-stage">
          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="Launch actions"
              title="What launch work should feel like"
              description="A founder launch path should help you move from preparation to execution without losing important paperwork or readiness checks."
            />
            <div className="three-up">
              {[
                {
                  title: "Legal studio",
                  body: "Draft agreements, save them, and prepare reusable legal documents in one place.",
                  href: "/legal",
                  icon: ShieldCheck,
                },
                {
                  title: "Taxation",
                  body: "Use tax guidance and calculators without being thrown into a completely different UI.",
                  href: "/taxation",
                  icon: Rocket,
                },
                {
                  title: "Launch learn track",
                  body: "Read 15 chapters covering readiness, compliance, setup, and go-live confidence.",
                  href: "/launch/learn",
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
              title="Launch chapter preview"
              description="Learn the sequence before you hit real deadlines."
            />
            <div className="grid gap-3">
              {launchChapters.slice(0, 6).map((chapter, index) => (
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

export default Launch;
