import type { ReactNode } from "react";
import BeeIcon from "@/components/BeeIcon";
import { Surface, SiteContainer } from "@/components/site/SitePrimitives";
import { cn } from "@/lib/utils";

type AuthFeature = {
  description: ReactNode;
  icon: ReactNode;
  title: ReactNode;
};

type AuthShellProps = {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  description: ReactNode;
  eyebrow?: ReactNode;
  features?: AuthFeature[];
  footer?: ReactNode;
  title: ReactNode;
};

export const AuthShell = ({
  actions,
  children,
  className,
  description,
  eyebrow,
  features = [],
  footer,
  title,
}: AuthShellProps) => (
  <div className={cn("page-shell", className)}>
    <SiteContainer>
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Surface className="relative overflow-hidden border-primary/12 bg-[radial-gradient(circle_at_top_left,_rgba(255,145,77,0.22),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(255,195,77,0.12),_transparent_38%),linear-gradient(180deg,_rgba(255,255,255,0.9),_rgba(255,255,255,0.78))] p-8 dark:bg-[radial-gradient(circle_at_top_left,_rgba(255,145,77,0.18),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(255,195,77,0.1),_transparent_38%),linear-gradient(180deg,_rgba(30,20,15,0.94),_rgba(22,15,11,0.94))] sm:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="space-y-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary text-primary-foreground shadow-[0_18px_40px_rgba(244,107,43,0.28)]">
                    <BeeIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                      BizHive
                    </div>
                    <p className="text-sm text-muted-foreground">Business Growth Platform</p>
                  </div>
                </div>
                {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
              </div>

              <div className="space-y-5">
                {eyebrow ? (
                  <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    {eyebrow}
                  </div>
                ) : null}

                <div className="space-y-4">
                  <h1 className="max-w-2xl font-display text-4xl font-semibold tracking-[-0.055em] text-foreground sm:text-5xl lg:text-6xl">
                    {title}
                  </h1>
                  <div className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                    {description}
                  </div>
                </div>
              </div>

              {features.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div
                      key={`${feature.title}`}
                      className="rounded-[24px] border border-border/70 bg-background/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]"
                    >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        {feature.icon}
                      </div>
                      <h2 className="text-base font-semibold text-foreground">{feature.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {footer ? (
              <div className="rounded-[24px] border border-border/70 bg-background/62 px-5 py-4 text-sm leading-6 text-muted-foreground">
                {footer}
              </div>
            ) : null}
          </div>
        </Surface>

        <Surface className="overflow-hidden p-0">
          {children}
        </Surface>
      </div>
    </SiteContainer>
  </div>
);
