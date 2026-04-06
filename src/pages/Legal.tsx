import { useEffect, useMemo, useState } from "react";
import { Download, FilePenLine, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollSurface, PageHeader, SiteContainer } from "@/components/site/SitePrimitives";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getLegalTemplates } from "@/services/site-content";
import { supabase } from "@/services/supabase/client";
import { fillTemplate } from "@/lib/text";
import { useTranslation } from "react-i18next";

type Template = Awaited<ReturnType<typeof getLegalTemplates>>[number];

const Legal = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [savedDrafts, setSavedDrafts] = useState<Array<{ id: string; title: string }>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getLegalTemplates().then((result) => {
      setTemplates(result);
      if (result[0]) {
        setSelectedSlug(result[0].slug);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedDrafts([]);
      return;
    }

    void supabase
      .from("user_legal_documents")
      .select("id,title")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setSavedDrafts(data ?? []));
  }, [user]);

  const selectedTemplate = templates.find((template) => template.slug === selectedSlug) ?? templates[0];

  useEffect(() => {
    if (!selectedTemplate) {
      return;
    }

    setFieldValues((current) =>
      Object.fromEntries(
        selectedTemplate.fieldSchema.map((field) => [field.name, current[field.name] ?? ""])
      )
    );
  }, [selectedTemplate?.slug]);

  const generatedContent = useMemo(
    () => (selectedTemplate ? fillTemplate(selectedTemplate.templateContent, fieldValues) : ""),
    [fieldValues, selectedTemplate]
  );

  const saveDraft = async () => {
    if (!user || !selectedTemplate) {
      toast({
        title: t("legalStudio.loginRequiredTitle"),
        description: t("legalStudio.loginRequiredBody"),
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("user_legal_documents").insert({
      user_id: user.id,
      template_id: null,
      slug: selectedTemplate.slug,
      title: selectedTemplate.title,
      status: "draft",
      field_values: fieldValues,
      generated_content: generatedContent,
    });

    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("legalStudio.draftSavedTitle"), description: t("legalStudio.draftSavedBody") });
    }
    setSaving(false);
  };

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow={t("legalStudio.eyebrow")}
          title={t("legalStudio.title")}
          description={t("legalStudio.description")}
          actions={
            <>
              <Button className="h-12 rounded-2xl px-5" onClick={saveDraft} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? t("common.saving") : t("legalStudio.saveDraft")}
              </Button>
              <Button variant="ghost" className="h-12 rounded-2xl border border-border/80 px-5" onClick={() => window.print()}>
                <Download className="mr-2 h-4 w-4" />
                {t("legalStudio.download")}
              </Button>
            </>
          }
        />

        <section className="grid gap-5 xl:grid-cols-[260px_minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <ScrollSurface className="lg:h-[38rem]">
            <div className="space-y-3 compact-scroll">
              {templates.map((template) => (
                <button
                  key={template.slug}
                  type="button"
                  onClick={() => setSelectedSlug(template.slug)}
                  className={`rounded-2xl border px-4 py-3 text-left ${
                    selectedSlug === template.slug ? "border-primary/40 bg-primary/10" : "border-border/80 bg-muted/35"
                  }`}
                >
                  <div className="font-semibold text-foreground">{template.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{template.category}</div>
                </button>
              ))}
            </div>
          </ScrollSurface>

          <ScrollSurface className="lg:h-[38rem]">
            <div className="space-y-4 compact-scroll">
              <div>
                <div className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">{selectedTemplate?.title}</div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{selectedTemplate?.summary}</p>
              </div>
              <div className="grid gap-4">
                {selectedTemplate?.fieldSchema.map((field) => (
                  <label key={field.name} className="space-y-2 text-sm">
                    <span className="font-semibold text-foreground">{field.label}</span>
                    <Input
                      value={fieldValues[field.name] || ""}
                      placeholder={field.placeholder}
                      onChange={(event) =>
                        setFieldValues((current) => ({ ...current, [field.name]: event.target.value }))
                      }
                      className="h-12 rounded-2xl"
                    />
                  </label>
                ))}
              </div>

              <div className="panel-muted p-4 text-sm leading-7 text-muted-foreground">
                {t("legalStudio.savedDraftsLabel")}: {savedDrafts.length ? savedDrafts.map((draft) => draft.title).join(", ") : t("legalStudio.noSavedDrafts")}
              </div>
            </div>
          </ScrollSurface>

          <ScrollSurface className="lg:h-[38rem]">
            <div className="compact-scroll whitespace-pre-wrap text-sm leading-8 text-foreground">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <FilePenLine className="h-4 w-4 text-primary" />
                {t("legalStudio.livePreview")}
              </div>
              {generatedContent}
            </div>
          </ScrollSurface>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Legal;
