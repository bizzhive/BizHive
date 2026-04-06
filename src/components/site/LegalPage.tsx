import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ClayGraphic } from "@/components/ClayGraphic";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";

type LegalPageProps = {
  description: string;
  sections: Array<{ body: string; title: string }>;
  title: string;
};

export const LegalPage = ({ description, sections, title }: LegalPageProps) => {
  const { t } = useTranslation();

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow={t("policyPage.eyebrow")}
          title={title}
          description={description}
          icon={ShieldCheck}
          visual={<ClayGraphic className="h-full min-h-[220px]" compact />}
        />
        <Surface className="space-y-6">
          {sections.map((section, index) => (
            <div key={section.title} className={index ? "border-t border-border/80 pt-6" : ""}>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-8 text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </Surface>
      </SiteContainer>
    </div>
  );
};
