import { MessageSquareMore } from "lucide-react";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useTranslation } from "react-i18next";

const AIAssistant = () => {
  const { t } = useTranslation();

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader eyebrow={t("ai.eyebrow")} title={t("ai.title")} description={t("ai.description")} />
        <Surface className="max-w-3xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquareMore className="h-5 w-5" />
          </div>
          <div className="mt-4 font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
            {t("ai.pausedTitle")}
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {t("ai.pausedBody")}
          </p>
        </Surface>
      </SiteContainer>
    </div>
  );
};

export default AIAssistant;
