import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fillTemplate } from "@/lib/text";
import { FileText, Save, Scale } from "lucide-react";

type TemplateField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
};

const Legal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [templatesRes, docsRes] = await Promise.all([
      supabase.from("legal_document_templates").select("*").eq("published", true).order("created_at", { ascending: true }),
      user
        ? supabase.from("user_legal_documents").select("*").eq("user_id", user.id).order("updated_at", { ascending: false })
        : Promise.resolve({ data: [], error: null } as any),
    ]);

    const nextTemplates = templatesRes.data ?? [];
    setTemplates(nextTemplates);
    setDocuments(docsRes.data ?? []);
    if (!selectedTemplateId && nextTemplates[0]) setSelectedTemplateId(nextTemplates[0].id);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

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

  const generatedContent = useMemo(() => {
    if (!selectedTemplate?.template_content) return "";
    return fillTemplate(selectedTemplate.template_content, values);
  }, [selectedTemplate?.template_content, values]);

  const saveDraft = async () => {
    if (!user) {
      toast({ title: "Login required", description: "Sign in to save editable legal drafts.", variant: "destructive" });
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
    };

    const query = draftId
      ? supabase.from("user_legal_documents").update(payload).eq("id", draftId)
      : supabase.from("user_legal_documents").insert(payload).select("id").single();

    const { data, error } = await query as any;
    setSaving(false);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    if (data?.id) setDraftId(data.id);
    toast({ title: "Draft saved" });
    await fetchData();
  };

  const loadDraft = (doc: any) => {
    setSelectedTemplateId(doc.template_id);
    setValues(doc.field_values || {});
    setDraftId(doc.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent">
            <Scale className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold text-foreground">Legal Document Studio</h1>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-muted-foreground">
            Pick a template, fill the fields, edit the generated copy, and save reusable drafts.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_0.9fr_1.1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Templates</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${selectedTemplateId === template.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
                  >
                    <div className="font-medium text-foreground">{template.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{template.summary || template.category}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Saved drafts</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => (
                  <button key={doc.id} type="button" onClick={() => loadDraft(doc)} className="w-full rounded-lg border px-4 py-3 text-left hover:bg-muted">
                    <div className="font-medium text-foreground">{doc.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">Updated {new Date(doc.updated_at).toLocaleDateString()}</div>
                  </button>
                ))}
                {documents.length === 0 && <p className="text-sm text-muted-foreground">No saved legal drafts yet.</p>}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fillable fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{selectedTemplate?.category || "template"}</Badge>
                <Badge variant="outline">{selectedTemplate?.jurisdiction || "India"}</Badge>
              </div>
              {fields.map((field) => {
                const Component = field.type === "textarea" ? Textarea : Input;
                return (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{field.label}</label>
                    <Component
                      placeholder={field.placeholder || "Enter value"}
                      value={values[field.name] || ""}
                      onChange={(e: any) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                      className={field.type === "textarea" ? "min-h-[120px]" : undefined}
                    />
                  </div>
                );
              })}
              <Button onClick={saveDraft} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Editable Draft"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Generated document</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={generatedContent} onChange={(e) => setValues((prev) => ({ ...prev, __manual_override: e.target.value }))} className="min-h-[680px] font-mono text-sm" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Legal;
