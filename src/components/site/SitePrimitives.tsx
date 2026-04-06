import type { HTMLAttributes, ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const SiteContainer = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-8 2xl:px-10", className)} {...props}>
    {children}
  </div>
);

export const Surface = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <section className={cn("panel-surface p-4 sm:p-5 lg:p-6", className)} {...props}>
    {children}
  </section>
);

export const ScrollSurface = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <Surface className={cn("flex min-h-0 flex-col overflow-hidden", className)} {...props}>
    {children}
  </Surface>
);

export const Eyebrow = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "inline-flex w-fit items-center rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary",
      className
    )}
  >
    {children}
  </div>
);

type PageHeaderProps = {
  actions?: ReactNode;
  className?: string;
  description: ReactNode;
  eyebrow?: ReactNode;
  icon?: LucideIcon;
  visual?: ReactNode;
  title: ReactNode;
};

export const PageHeader = ({
  actions,
  className,
  description,
  eyebrow,
  icon: Icon,
  title,
  visual,
}: PageHeaderProps) => (
  <section
    className={cn(
      "panel-hero panel-surface overflow-hidden px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8",
      className
    )}
  >
    <div
      className={cn(
        "relative z-[1] grid gap-8",
        visual
          ? "xl:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] xl:items-center"
          : "lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
      )}
    >
      <div className="space-y-4 min-w-0">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        {Icon ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-primary/12 text-primary shadow-[0_16px_34px_rgba(255,138,61,0.18)]">
            <Icon className="h-6 w-6" />
          </div>
        ) : null}
        <div className="space-y-3">
          <h1 className="max-w-5xl font-display text-4xl font-semibold tracking-[-0.07em] text-foreground sm:text-5xl xl:text-6xl 2xl:text-[4.4rem]">
            {title}
          </h1>
          <div className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base xl:text-[1.02rem] xl:leading-8">
            {description}
          </div>
        </div>
      </div>
      {visual ? (
        <div className="min-h-[280px] xl:min-h-[380px]">{visual}</div>
      ) : actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
      {visual && actions ? <div className="xl:col-span-2 flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  </section>
);

export const SectionHeading = ({
  align = "left",
  className,
  description,
  eyebrow,
  title,
}: {
  align?: "left" | "center";
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
}) => (
  <div
    className={cn(
      "space-y-3",
      align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
      className
    )}
  >
    {eyebrow ? <Eyebrow className={align === "center" ? "mx-auto" : undefined}>{eyebrow}</Eyebrow> : null}
    <div className="space-y-2">
      <h2 className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <div className="text-sm leading-7 text-muted-foreground sm:text-base">{description}</div>
      ) : null}
    </div>
  </div>
);

export const MetricTile = ({
  label,
  value,
  hint,
  className,
}: {
  className?: string;
  hint?: ReactNode;
  label: ReactNode;
  value: ReactNode;
}) => (
  <div className={cn("panel-muted p-4", className)}>
    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
    <div className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
      {value}
    </div>
    {hint ? <div className="mt-2 text-sm leading-6 text-muted-foreground">{hint}</div> : null}
  </div>
);

export const EmptyState = ({
  action,
  className,
  description,
  icon,
  title,
}: {
  action?: ReactNode;
  className?: string;
  description: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
}) => (
  <Surface className={cn("flex min-h-[240px] flex-col items-center justify-center gap-4 text-center", className)}>
    {icon ? (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
    ) : null}
    <div className="space-y-2">
      <h3 className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{title}</h3>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
    {action}
  </Surface>
);

export const LoadingState = ({
  className,
  description = "We are preparing this workspace for you.",
  title = "Loading",
}: {
  className?: string;
  description?: ReactNode;
  title?: ReactNode;
}) => (
  <Surface className={cn("flex min-h-[240px] flex-col items-center justify-center gap-4 text-center", className)}>
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
    <div className="space-y-2">
      <h3 className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{title}</h3>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  </Surface>
);
