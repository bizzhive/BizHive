import type { HTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const SiteContainer = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8", className)}
    {...props}
  >
    {children}
  </div>
);

type PageHeaderProps = {
  actions?: ReactNode;
  className?: string;
  description: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
};

export const PageHeader = ({
  actions,
  className,
  description,
  eyebrow,
  title,
}: PageHeaderProps) => (
  <section
    className={cn(
      "relative overflow-hidden rounded-[32px] border border-border/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,145,77,0.16),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(255,195,77,0.12),_transparent_38%),linear-gradient(180deg,_rgba(255,255,255,0.82),_rgba(255,255,255,0.72))] p-6 shadow-[0_24px_60px_rgba(16,12,8,0.08)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(255,145,77,0.12),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(255,195,77,0.08),_transparent_38%),linear-gradient(180deg,_rgba(30,20,15,0.94),_rgba(22,15,11,0.94))] sm:p-8 lg:p-10",
      className
    )}
  >
    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-4">
        {eyebrow ? (
          <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </div>
        ) : null}
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <div className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </div>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  </section>
);

type SectionHeadingProps = {
  align?: "left" | "center";
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
};

export const SectionHeading = ({
  align = "left",
  className,
  description,
  eyebrow,
  title,
}: SectionHeadingProps) => (
  <div
    className={cn(
      "space-y-3",
      align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
      className
    )}
  >
    {eyebrow ? (
      <div className="inline-flex items-center rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        {eyebrow}
      </div>
    ) : null}
    <h2 className="font-display text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">
      {title}
    </h2>
    {description ? (
      <div className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</div>
    ) : null}
  </div>
);

export const Surface = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-[28px] border border-border/70 bg-card/92 p-6 shadow-[0_20px_50px_rgba(16,12,8,0.06)] backdrop-blur-xl",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
};

export const EmptyState = ({
  action,
  className,
  description,
  icon,
  title,
}: EmptyStateProps) => (
  <Surface className={cn("flex flex-col items-center justify-center gap-4 py-12 text-center", className)}>
    {icon ? (
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
    ) : null}
    <div className="space-y-2">
      <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">{title}</h3>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
    {action}
  </Surface>
);

type LoadingStateProps = {
  className?: string;
  description?: ReactNode;
  title?: ReactNode;
};

export const LoadingState = ({
  className,
  description = "We are preparing this workspace for you.",
  title = "Loading",
}: LoadingStateProps) => (
  <Surface
    className={cn(
      "flex min-h-[260px] flex-col items-center justify-center gap-4 py-12 text-center",
      className
    )}
    aria-live="polite"
  >
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
    <div className="space-y-2">
      <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">{title}</h3>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  </Surface>
);
