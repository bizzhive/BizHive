import { Building2, HandCoins, Presentation } from "lucide-react";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useTranslation } from "react-i18next";
import incubatorsData from "@/data/incubators.json";

const Incubators = () => {
  const { t } = useTranslation();
  const cards = t("incubators.cards", { returnObjects: true }) as Array<{ title: string; body: string }>;

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow={t("incubators.eyebrow")}
          title={t("incubators.title")}
          description={t("incubators.description")}
        />

        <section className="grid gap-4 lg:grid-cols-3">
          <Surface>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{cards[0]?.title}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{cards[0]?.body}</p>
            <div className="mt-3 text-sm text-muted-foreground">{t("incubators.recordsLoaded", { count: incubatorsData.incubators.length })}</div>
          </Surface>
          <Surface>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HandCoins className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{cards[1]?.title}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{cards[1]?.body}</p>
          </Surface>
          <Surface>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Presentation className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{cards[2]?.title}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{cards[2]?.body}</p>
          </Surface>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Incubators;
