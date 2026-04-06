import { Calculator, Landmark, ShieldCheck } from "lucide-react";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useTranslation } from "react-i18next";

const Taxation = () => {
  const { t } = useTranslation();
  const cards = t("taxation.cards", { returnObjects: true }) as Array<{ title: string; body: string }>;

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow={t("taxation.eyebrow")}
          title={t("taxation.title")}
          description={t("taxation.description")}
        />

        <section className="grid gap-4 lg:grid-cols-3">
          <Surface>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Calculator className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{cards[0]?.title}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{cards[0]?.body}</p>
          </Surface>
          <Surface>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Landmark className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{cards[1]?.title}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{cards[1]?.body}</p>
          </Surface>
          <Surface>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{cards[2]?.title}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{cards[2]?.body}</p>
          </Surface>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Taxation;
