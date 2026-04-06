import type { ReactNode } from "react";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";

type RouteDetailPageProps = {
  actions?: ReactNode;
  description: string;
  eyebrow: string;
  sections: Array<{ body: string; title: string }>;
  title: string;
};

export const RouteDetailPage = ({
  actions,
  description,
  eyebrow,
  sections,
  title,
}: RouteDetailPageProps) => (
  <div className="page-shell">
    <SiteContainer className="page-stack">
      <PageHeader eyebrow={eyebrow} title={title} description={description} actions={actions} />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Surface key={section.title}>
            <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
              {section.title}
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{section.body}</p>
          </Surface>
        ))}
      </section>
    </SiteContainer>
  </div>
);
