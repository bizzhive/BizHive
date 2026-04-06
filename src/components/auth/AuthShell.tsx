import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileSignature, MessageSquareMore, Rocket } from "lucide-react";
import BeeIcon from "@/components/BeeIcon";
import { ClayGraphic } from "@/components/ClayGraphic";
import { SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useTranslation } from "react-i18next";

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

            <ClayGraphic className="min-h-[220px]" compact />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              { title: "Bee AI surfaces", body: "Copilot from the bottom-right and a fullscreen Bee workspace from the nav.", icon: MessageSquareMore },
              { title: "Guided learning", body: "Fifteen chapters each for planning, launch, and growth, with progress and workbook saving.", icon: BookOpen },
              { title: "Launch and documents", body: "Legal drafts, signature-ready workflows, and document saving tied to your profile.", icon: FileSignature },
              { title: "Incubators and funding", body: "Support programs, pitch preparation, and founder resource discovery in one route.", icon: Rocket },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="panel-muted p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-primary/12 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="mt-3 font-semibold text-foreground">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              );
            })}
          </div>
        </Surface>

        <Surface>{children}</Surface>
      </SiteContainer>
    </div>
  );
};
