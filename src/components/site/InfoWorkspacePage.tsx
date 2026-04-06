import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";

export type InfoWorkspaceSection = {
  body: string;
  title: string;
};

export type InfoWorkspaceAction = {
  href: string;
  label: string;
};

type InfoWorkspacePageProps = {
  actions?: InfoWorkspaceAction[];
  description: string;
  eyebrow: string;
  highlights?: Array<{ body: string; label: string }>;
  title: string;
  visualIcon: LucideIcon;
  visualTitle: string;
};

export const InfoWorkspacePage = ({
  actions = [],
  description,
  eyebrow,
  highlights = [],
  title,
  visualIcon: Icon,
  visualTitle,
}: InfoWorkspacePageProps) => (
  <div className="page-shell">
    <SiteContainer className="page-stack">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          actions.length ? (
            <>
              {actions.map((action) => (
                <Button asChild key={action.href} size="lg" variant={action.href === actions[0].href ? "default" : "ghost"} className="h-12 rounded-2xl border border-border/80 px-5">
                  <Link to={action.href}>
                    {action.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </>
          ) : undefined
        }
      />

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Surface className="space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <SectionHeading
            eyebrow="Why this page exists"
            title={visualTitle}
            description="Each major BizHive page now has one job, one visual system, and one clear set of next steps."
          />
        </Surface>

        <div className="grid gap-4 md:grid-cols-2">
          {highlights.map((highlight) => (
            <Surface key={highlight.label} className="h-full">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {highlight.label}
              </div>
              <div className="mt-3 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                {highlight.body}
              </div>
            </Surface>
          ))}
        </div>
      </section>
    </SiteContainer>
  </div>
);
