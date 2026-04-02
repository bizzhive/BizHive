import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/services/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fillTemplate } from "@/lib/text";
import { FileText, Save, Scale, Upload, Download } from "lucide-react";
import SignaturePad from "@/components/SignaturePad";
import { useTranslation } from "react-i18next";

type TemplateField = {
  name: string;
  label: string;
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
        ? supabase.from("user_legal_documents").select("*").eq("user_id", user.id).order("updated_at", { ascending: false })
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
    if (!selectedTemplate) return;

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
    if (!selectedTemplate?.template_content) return "";
    return fillTemplate(selectedTemplate.template_content, values);
  }, [selectedTemplate?.template_content, values]);

  const saveDraft = async () => {
    if (!user) {
      toast({ title: t("Login required"), description: t("Sign in to save editable legal drafts."), variant: "destructive" });
      return;
    }

    if (!selectedTemplate) return;

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
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-document, #printable-document * { visibility: visible; }
          #printable-document { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="container mx-auto space-y-8 px-4 py-12">
        <div className="text-center no-print">
          <h1 className="text-5xl font-bold text-foreground">{t("Legal Document Studio")}</h1>
          <p className="mx-auto mt-2 max-w-3xl text-lg text-muted-foreground">
            {t("Editable business drafts and filing-preparation worksheets built for Indian founders.")}
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_0.9fr_1.1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>{t("Templates")}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`w-full rounded-lg border px-4 py-2 text-left transition-colors ${selectedTemplateId === template.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
                  >
                    <div className="text-sm font-medium text-foreground">{template.title}</div>
                    <div className="text-xs text-muted-foreground">{template.category}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{t("Saved drafts")}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => (
                  <button key={doc.id} type="button" onClick={() => loadDraft(doc)} className="w-full rounded-lg border px-4 py-2 text-left hover:bg-muted">
                    <div className="text-sm font-medium text-foreground">{doc.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(doc.updated_at).toLocaleDateString()}</div>
                  </button>
                ))}
                {documents.length === 0 && <p className="text-sm text-muted-foreground">{t("No saved legal drafts yet.")}</p>}
              </CardContent>
            </Card>
          </div>

          <Card className="no-print">
            <CardHeader>
              <CardTitle>{t("Fillable fields")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{selectedTemplate?.category ? t(selectedTemplate.category) : t("template")}</Badge>
                <Badge variant="outline">{selectedTemplate?.jurisdiction ? t(selectedTemplate.jurisdiction) : t("India")}</Badge>
              </div>
              {selectedTemplate?.summary && (
                <p className="text-sm text-muted-foreground">{selectedTemplate.summary}</p>
              )}
              {fields.map((field) => {
                const Component = field.type === "textarea" ? Textarea : Input;

                return (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{field.label}</label>
                    <Component
                      placeholder={field.placeholder ? t(field.placeholder) : t("Enter value")}
                      value={values[field.name] || ""}
                      onChange={(e: any) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                      className={field.type === "textarea" ? "min-h-[120px]" : undefined}
                    />
                  </div>
                );
              })}

              <div className="border-t pt-4">
                <label className="mb-2 block text-sm font-medium text-foreground">{t("E-Signature")}</label>
                <div className="mb-2 flex gap-2">
                  <Button variant={!useUpload ? "default" : "outline"} size="sm" onClick={() => setUseUpload(false)}>{t("Draw")}</Button>
                  <Button variant={useUpload ? "default" : "outline"} size="sm" onClick={() => setUseUpload(true)}>{t("Upload")}</Button>
                </div>
                {useUpload ? (
                  <div className="rounded-md border border-dashed p-6 text-center">
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> {t("Select Image")}</Button>
                    {signature && <img src={signature} alt="Signature" className="mx-auto mt-2 h-16 object-contain" />}
                  </div>
                ) : (
                  <SignaturePad onSave={setSignature} />
                )}
              </div>

              <Button onClick={saveDraft} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? t("Saving...") : t("Save Editable Draft")}
              </Button>
              <Button variant="secondary" onClick={handlePrint} className="ml-2">
                <Download className="h-4 w-4" /> {t("Download PDF")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="no-print">
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />{t("Generated document")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div id="printable-document" className="relative min-h-[800px] border bg-white p-8 text-black shadow-sm">
                <div className="mb-6 border-b pb-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black">
                      <Scale className="h-8 w-8 text-black" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold uppercase tracking-wide">{selectedTemplate?.title ? t(selectedTemplate.title) : t("Document Preview")}</h2>
                      <h3 className="mt-1 text-sm font-medium uppercase">{t("BizHive Legal Drafting Workspace")}</h3>
                    </div>
                  </div>
                  <p className="text-xs italic">
                    {selectedTemplate?.summary ? t(selectedTemplate.summary) : t("Review this editable draft carefully before signing or filing.")}
                  </p>
                  <p className="mt-2 text-xs">
                    {t("This workspace helps you prepare editable drafts and filing data. Verify the latest requirements on the relevant official portal before submission.")}
                  </p>
                </div>

                <div className="whitespace-pre-wrap text-justify font-serif text-sm leading-relaxed">
                  {generatedContent || t("Select a template to generate document...")}
                </div>

                <div className="mt-16 flex justify-end">
                  <div className="w-48 text-center">
                    {signature && <img src={signature} alt="Signed" className="mx-auto mb-2 h-16 object-contain" />}
                    <div className="border-t border-black pt-1 font-bold">{t("Authorized Signatory")}</div>
                    <div className="text-xs text-gray-500">{t("Date:")} {new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Legal;
