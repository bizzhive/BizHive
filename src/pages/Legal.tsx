import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Download,
  FileText,
  Save,
  Scale,
  Upload,
  PenTool,
  FolderOpen,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/services/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fillTemplate } from "@/lib/text";
import SignaturePad from "@/components/SignaturePad";
import { useTranslation } from "react-i18next";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";

type TemplateField = {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
};

const Legal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [useUpload, setUseUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchData = async () => {
    const [templatesRes, docsRes] = await Promise.all([
      supabase.from("legal_document_templates").select("*").order("created_at", { ascending: true }),
      user
        ? supabase
            .from("user_legal_documents")
            .select("*")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
        : Promise.resolve({ data: [], error: null } as any),
    ]);

    const nextTemplates = templatesRes.data ?? [];
    const requestedSlug = searchParams.get("template");
    const requestedTemplate = requestedSlug
      ? nextTemplates.find((template) => template.slug === requestedSlug)
      : null;

    setTemplates(nextTemplates);
    setDocuments(docsRes.data ?? []);

    if (requestedTemplate) {
      setSelectedTemplateId(requestedTemplate.id);
    } else if (!selectedTemplateId && nextTemplates[0]) {
      setSelectedTemplateId(nextTemplates[0].id);
    }
  };

  useEffect(() => {
    void fetchData();
  }, [searchParams, user]);

  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId) ?? templates[0];
  const fields: TemplateField[] = Array.isArray(selectedTemplate?.field_schema) ? selectedTemplate.field_schema : [];

  useEffect(() => {
    if (!selectedTemplate) {
      return;
    }

    const initialValues = Object.fromEntries(
      fields.map((field) => [field.name, values[field.name] ?? field.placeholder ?? ""])
    );

    setValues(initialValues);
    setDraftId(null);
  }, [selectedTemplateId, selectedTemplate?.id]);

  useEffect(() => {
    if (!selectedTemplate?.slug) {
      return;
    }

    if (searchParams.get("template") !== selectedTemplate.slug) {
      setSearchParams({ template: selectedTemplate.slug }, { replace: true });
    }
  }, [searchParams, selectedTemplate?.slug, setSearchParams]);

  const generatedContent = useMemo(() => {
    if (!selectedTemplate?.template_content) {
      return "";
    }

    return fillTemplate(selectedTemplate.template_content, values);
  }, [selectedTemplate?.template_content, values]);

  const saveDraft = async () => {
    if (!user) {
      toast({
        title: t("Login required"),
        description: t("Sign in to save editable legal drafts."),
        variant: "destructive",
      });
      return;
    }

    if (!selectedTemplate) {
      return;
    }

    setSaving(true);

    const payload = {
      user_id: user.id,
      template_id: selectedTemplate.id,
      title: selectedTemplate.title,
      slug: selectedTemplate.slug,
      status: "draft",
      field_values: values,
      generated_content: generatedContent,
      updated_at: new Date().toISOString(),
      signature_url: signature,
    };

    const query = draftId
      ? supabase.from("user_legal_documents").update(payload).eq("id", draftId)
      : supabase.from("user_legal_documents").insert(payload).select("id").single();

    const { data, error } = await (query as any);
    setSaving(false);

    if (error) {
      toast({ title: t("Save failed"), description: error.message, variant: "destructive" });
      return;
    }

    if (data?.id) {
      setDraftId(data.id);
    }

    toast({ title: t("Draft saved") });
    await fetchData();
  };

  const loadDraft = (doc: any) => {
    setSelectedTemplateId(doc.template_id);
    setValues(doc.field_values || {});
    setDraftId(doc.id);
    setSignature(doc.signature_url || null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSignature(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page-shell">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-document, #printable-document * { visibility: visible; }
          #printable-document { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 24px; box-shadow: none; }
          .no-print { display: none !important; }
        }
      `}</style>

      <SiteContainer className="space-y-8">
        <PageHeader
          eyebrow={t("Legal document studio")}
          title={t("A more deliberate drafting workspace")}
          description={t(
            "Templates, fillable fields, saved drafts, and the generated document preview now sit inside one structured editor instead of feeling improvised."
          )}
          actions={
            <>
              <Button onClick={saveDraft} disabled={saving} size="lg">
                <Save className="h-4 w-4" />
                {saving ? t("Saving...") : t("Save Draft")}
              </Button>
              <Button variant="outline" onClick={handlePrint} size="lg">
                <Download className="h-4 w-4" />
                {t("Download PDF")}
              </Button>
            </>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[260px_minmax(360px,0.78fr)_minmax(0,1.22fr)]">
          <div className="space-y-6">
            <Surface className="no-print space-y-4 p-5">
              <div>
                <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {t("Templates")}
                </div>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
                  {t("Choose a draft")}
                </h2>
              </div>
              <div className="grid gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`rounded-[22px] border px-4 py-3 text-left transition-colors ${
                      selectedTemplateId === template.id
                        ? "border-primary/30 bg-primary/8"
                        : "border-border/70 bg-background/72 hover:bg-accent"
                    }`}
                  >
                    <div className="font-medium text-foreground">{template.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{template.category}</div>
                  </button>
                ))}
              </div>
            </Surface>

            <Surface className="no-print space-y-4 p-5">
              <div>
                <div className="inline-flex items-center rounded-full border border-border/70 bg-muted/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {t("Saved drafts")}
                </div>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
                  {t("Recent work")}
                </h2>
              </div>
              {documents.length > 0 ? (
                <div className="grid gap-2">
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => loadDraft(doc)}
                      className="rounded-[22px] border border-border/70 bg-background/72 px-4 py-3 text-left transition-colors hover:bg-accent"
                    >
                      <div className="font-medium text-foreground">{doc.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {new Date(doc.updated_at).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-[22px] border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
                  <FolderOpen className="mx-auto mb-2 h-5 w-5" />
                  {t("No saved legal drafts yet.")}
                </div>
              )}
            </Surface>
          </div>

          <Surface className="no-print space-y-5 p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-none bg-primary/10 text-primary">
                  {selectedTemplate?.category ? t(selectedTemplate.category) : t("template")}
                </Badge>
                <Badge variant="secondary">
                  {selectedTemplate?.jurisdiction ? t(selectedTemplate.jurisdiction) : t("India")}
                </Badge>
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
                  {selectedTemplate?.title ? t(selectedTemplate.title) : t("Select a template")}
                </h2>
                {selectedTemplate?.summary ? (
                  <p className="text-sm leading-7 text-muted-foreground">{selectedTemplate.summary}</p>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-border/70 bg-background/72 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <PenTool className="h-4 w-4 text-primary" />
                    {t("Fillable fields")}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {t("Use structured inputs instead of editing the full document manually.")}
                  </p>
                </div>
                <div className="rounded-[22px] border border-border/70 bg-background/72 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    {t("Preview aligned")}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {t("The editor and generated draft now follow a more consistent document proportion.")}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {fields.map((field) => {
                const Component = field.type === "textarea" ? Textarea : Input;

                return (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">{field.label}</label>
                    <Component
                      placeholder={field.placeholder ? t(field.placeholder) : t("Enter value")}
                      value={values[field.name] || ""}
                      onChange={(event: any) =>
                        setValues((previous) => ({ ...previous, [field.name]: event.target.value }))
                      }
                      className={field.type === "textarea" ? "min-h-[128px] rounded-[22px] border-border/70 bg-muted/30" : "h-12 rounded-[22px] border-border/70 bg-muted/30"}
                    />
                  </div>
                );
              })}
            </div>

            <div className="rounded-[24px] border border-border/70 bg-background/72 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                {t("E-Signature")}
              </div>
              <div className="mb-3 flex gap-2">
                <Button variant={!useUpload ? "default" : "outline"} size="sm" onClick={() => setUseUpload(false)}>
                  {t("Draw")}
                </Button>
                <Button variant={useUpload ? "default" : "outline"} size="sm" onClick={() => setUseUpload(true)}>
                  {t("Upload")}
                </Button>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                {t("Draw your signature below. Saving will keep the latest version with this draft.")}
              </p>
              {useUpload ? (
                <div className="rounded-[22px] border border-dashed border-border/70 p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" />
                    {t("Select Image")}
                  </Button>
                  {signature ? (
                    <img src={signature} alt="Signature" className="mx-auto mt-4 h-16 object-contain" />
                  ) : null}
                </div>
              ) : (
                <SignaturePad onSave={setSignature} />
              )}
            </div>
          </Surface>

          <Card className="overflow-hidden border-border/70 bg-card/92">
            <CardHeader className="no-print border-b border-border/70 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileText className="h-5 w-5 text-primary" />
                {t("Generated document")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div
                id="printable-document"
                className="mx-auto min-h-[880px] w-full max-w-[860px] rounded-[24px] border border-black/10 bg-white px-6 py-8 text-black shadow-[0_24px_60px_rgba(16,12,8,0.12)] sm:px-10 sm:py-10"
              >
                <div className="mb-8 border-b border-black/10 pb-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black/80">
                      <Scale className="h-8 w-8 text-black" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-black">
                        {selectedTemplate?.title ? t(selectedTemplate.title) : t("Document Preview")}
                      </h2>
                      <h3 className="mt-1 text-sm font-semibold uppercase tracking-[0.22em] text-black/60">
                        {t("BizHive Legal Drafting Workspace")}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm italic text-black/70">
                    {selectedTemplate?.summary
                      ? t(selectedTemplate.summary)
                      : t("Review this editable draft carefully before signing or filing.")}
                  </p>
                  <p className="mt-3 text-sm text-black/75">
                    {t(
                      "This workspace helps you prepare editable drafts and filing data. Verify the latest requirements on the relevant official portal before submission."
                    )}
                  </p>
                </div>

                <div className="whitespace-pre-wrap font-serif text-[15px] leading-8 text-black/90">
                  {generatedContent || t("Select a template to generate document...")}
                </div>

                <div className="mt-20 flex justify-end">
                  <div className="w-56 text-center">
                    {signature ? (
                      <img src={signature} alt="Signed" className="mx-auto mb-2 h-16 object-contain" />
                    ) : null}
                    <div className="border-t border-black/70 pt-2 font-semibold text-black">
                      {t("Authorized Signatory")}
                    </div>
                    <div className="mt-1 text-xs text-black/55">
                      {t("Date:")} {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Legal;
