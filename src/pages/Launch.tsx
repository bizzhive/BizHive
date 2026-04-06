import { Link } from "react-router-dom";
import { BookOpen, Rocket, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClayGraphic } from "@/components/ClayGraphic";
import { launchChapters } from "@/content/learning";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";

const Launch = () => {
  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Launch"
          title="Go live with legal, tax, operations, and customer readiness aligned"
          description="The launch workspace is where registrations, compliance, signature, document prep, and launch learning stop fighting each other."
          icon={Rocket}
          visual={<ClayGraphic className="h-full min-h-[240px]" compact />}
          actions={
            <>
              <Button asChild className="h-12 rounded-2xl px-5">
                <Link to="/launch/learn">Start the 15-chapter launch track</Link>
              </Button>
              <Button asChild variant="ghost" className="glass-button h-12">
                <Link to="/legal">Open legal studio</Link>
              </Button>
            </>
          }
        />

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Surface className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { title: "15 chapters", body: "Structured launch guidance from business setup through controlled go-live." },
                { title: "Legal + tax", body: "The key launch surfaces are now placed side by side instead of across disconnected screens." },
                { title: "Signature ready", body: "Save your signature and use it as part of legal drafting and document preparation." },
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
                  title: "Legal studio",
                  body: "Open templates, draft them, and prepare documents without leaving the product shell.",
                  href: "/legal",
                  icon: ShieldCheck,
                },
                {
                  title: "Taxation",
                  body: "Use tax guidance and calculator support without falling into a completely different design system.",
                  href: "/taxation",
                  icon: Rocket,
                },
                {
                  title: "Launch learn track",
                  body: "Read the full 15-chapter launch curriculum covering readiness, compliance, and operations.",
                  href: "/launch/learn",
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
            <div className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">Launch learning preview</div>
            <div className="grid gap-3">
              {launchChapters.slice(0, 5).map((chapter, index) => (
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

export default Launch;
