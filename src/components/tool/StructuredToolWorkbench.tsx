import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AIAssistButton } from "@/components/AIAssistButton";
import { ClayGraphic } from "@/components/ClayGraphic";
import { PageHeader, ScrollSurface, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useSavedTool } from "@/hooks/use-saved-tool";

type ToolType =
  | "business_canvas"
  | "swot_analysis"
  | "market_research"
  | "business_plan"
  | "pitch_deck";

type FieldConfig = {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "textarea";
};

type SectionConfig = {
  body: string;
  fields: FieldConfig[];
  title: string;
};

type StructuredToolWorkbenchProps = {
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  sections: SectionConfig[];
  summaryTitle: string;
  summaryBody: string;
  title: string;
  toolType: ToolType;
  trailingPanel?: ReactNode;
};

const buildDefaultData = (sections: SectionConfig[]) =>
  Object.fromEntries(sections.flatMap((section) => section.fields.map((field) => [field.name, ""])));

export const StructuredToolWorkbench = ({
  description,
  eyebrow,
  icon: Icon,
  sections,
  summaryBody,
  summaryTitle,
  title,
  toolType,
  trailingPanel,
}: StructuredToolWorkbenchProps) => {
  const defaultData = useMemo(() => buildDefaultData(sections), [sections]);
  const { data, isLoading, isSaving, save } = useSavedTool<Record<string, string>>(toolType, defaultData);
  const [form, setForm] = useState<Record<string, string>>(defaultData);

  useEffect(() => {
    setForm({ ...defaultData, ...data });
  }, [data, defaultData]);

  const completion = useMemo(() => {
    const values = Object.values(form);
    if (!values.length) {
      return 0;
    }
    const completed = values.filter((value) => value.trim().length > 0).length;
    return Math.round((completed / values.length) * 100);
  }, [form]);

  const filledHighlights = useMemo(
    () =>
      sections
        .map((section) => ({
          title: section.title,
          filled: section.fields.filter((field) => (form[field.name] ?? "").trim().length > 0).length,
          total: section.fields.length,
        }))
        .filter((section) => section.filled > 0),
    [form, sections]
  );

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          icon={Icon}
          visual={<ClayGraphic className="h-full min-h-[280px] xl:min-h-[360px]" compact variant="tools" />}
          actions={
            <div className="flex flex-wrap gap-3">
              <Button className="h-11 rounded-2xl px-5" onClick={() => save(form)} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save work"}
              </Button>
              <div className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-muted-foreground">
                {isLoading ? "Loading your saved draft..." : "Your latest saved draft reopens automatically."}
              </div>
            </div>
          }
        />

        <section className="workspace-grid">
          <ScrollSurface className="xl:max-h-[calc(100vh-9.75rem)]">
            <div className="compact-scroll space-y-5">
              {sections.map((section) => (
                <div key={section.title} className="panel-muted p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                        {section.title}
                      </div>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{section.body}</p>
                    </div>
                    <AIAssistButton
                      field={section.title}
                      context={{ toolType, title }}
                      onSuggestion={(suggestion) => {
                        const firstField = section.fields[0];
                        if (firstField) {
                          setForm((current) => ({
                            ...current,
                            [firstField.name]: current[firstField.name]?.trim() ? current[firstField.name] : suggestion,
                          }));
                        }
                      }}
                    />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {section.fields.map((field) => {
                      const Component = field.type === "textarea" ? Textarea : Input;
                      return (
                        <label key={field.name} className={field.type === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"}>
                          <span className="text-sm font-semibold text-foreground">{field.label}</span>
                          <Component
                            value={form[field.name] ?? ""}
                            onChange={(event) =>
                              setForm((current) => ({ ...current, [field.name]: event.target.value }))
                            }
                            placeholder={field.placeholder}
                            className={field.type === "textarea" ? "min-h-[130px] rounded-[22px]" : "h-12 rounded-[22px]"}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollSurface>

          <div className="grid gap-4">
            <Surface className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Progress</div>
                  <div className="mt-2 font-display text-4xl font-semibold tracking-[-0.06em] text-foreground">{completion}%</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Keep the inputs concrete and evidence-backed. This workspace is designed to save evolving founder thinking, not one-off rough notes.
              </p>
            </Surface>

            <ScrollSurface className="xl:max-h-[20rem]">
              <div className="compact-scroll space-y-3">
                <div>
                  <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{summaryTitle}</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{summaryBody}</p>
                </div>

                {filledHighlights.length ? (
                  filledHighlights.map((item) => (
                    <div key={item.title} className="panel-muted p-4">
                      <div className="font-semibold text-foreground">{item.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {item.filled} of {item.total} fields completed
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="panel-muted p-4 text-sm leading-7 text-muted-foreground">
                    Start filling the workspace and Bee can help you refine the first draft while everything stays saved in one place.
                  </div>
                )}
              </div>
            </ScrollSurface>

            {trailingPanel}
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};
