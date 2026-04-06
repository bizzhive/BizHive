import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BeeIcon from "@/components/BeeIcon";
import { SiteContainer, Surface } from "@/components/site/SitePrimitives";

export const AuthShell = ({
  body,
  children,
  title,
}: {
  body: string;
  children: ReactNode;
  title: string;
}) => {
  const { t } = useTranslation();

  return (
    <div className="page-shell">
      <SiteContainer className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Surface className="flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <BeeIcon className="h-7 w-7" />
              </div>
              <div>
                <div className="font-display text-2xl font-semibold text-foreground">BizHive</div>
                <div className="text-sm text-muted-foreground">{t("brand.description")}</div>
              </div>
            </Link>

            <div className="space-y-3">
              <h1 className="font-display text-4xl font-semibold tracking-[-0.06em] text-foreground">{title}</h1>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{body}</p>
            </div>
          </div>

          <div className="panel-muted p-4 text-sm leading-6 text-muted-foreground">{t("auth.shellNote")}</div>
        </Surface>

        <Surface>{children}</Surface>
      </SiteContainer>
    </div>
  );
};
