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
import { FileText, Save, Scale, Upload, Download, PenTool } from "lucide-react";
import SignaturePad from "@/components/SignaturePad";

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
  const [signature, setSignature] = useState<string | null>(null);
  const [useUpload, setUseUpload] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const [templatesRes, docsRes] = await Promise.all([
      supabase.from("legal_document_templates").select("*").order("created_at", { ascending: true }),
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
      signature_url: signature // Assuming schema supports this or stored in metadata
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
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="text-center no-print">
          <h1 className="text-5xl font-bold text-foreground">Legal Document Studio</h1>
          <p className="mx-auto mt-2 max-w-3xl text-lg text-muted-foreground">
            Government-compliant templates with e-signature support.
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
                    className={`w-full rounded-lg border px-4 py-2 text-left transition-colors ${selectedTemplateId === template.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
                  >
                    <div className="font-medium text-foreground text-sm">{template.title}</div>
                    <div className="text-xs text-muted-foreground">{template.category}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Saved drafts</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => (
                  <button key={doc.id} type="button" onClick={() => loadDraft(doc)} className="w-full rounded-lg border px-4 py-2 text-left hover:bg-muted">
                    <div className="font-medium text-foreground text-sm">{doc.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(doc.updated_at).toLocaleDateString()}</div>
                  </button>
                ))}
                {documents.length === 0 && <p className="text-sm text-muted-foreground">No saved legal drafts yet.</p>}
              </CardContent>
            </Card>
          </div>

          <Card className="no-print">
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
              
              <div className="pt-4 border-t">
                <label className="text-sm font-medium text-foreground mb-2 block">E-Signature</label>
                <div className="flex gap-2 mb-2">
                  <Button variant={!useUpload ? "default" : "outline"} size="sm" onClick={() => setUseUpload(false)}>Draw</Button>
                  <Button variant={useUpload ? "default" : "outline"} size="sm" onClick={() => setUseUpload(true)}>Upload</Button>
                </div>
                {useUpload ? (
                  <div className="border border-dashed rounded-md p-6 text-center">
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4 mr-2"/> Select Image</Button>
                    {signature && <img src={signature} alt="Signature" className="mt-2 h-16 mx-auto object-contain" />}
                  </div>
                ) : (
                  <SignaturePad onSave={setSignature} />
                )}
              </div>

              <Button onClick={saveDraft} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Editable Draft"}
              </Button>
              <Button variant="secondary" onClick={handlePrint} className="ml-2">
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="no-print">
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Generated document</CardTitle>
            </CardHeader>
            <CardContent>
              <div id="printable-document" className="bg-white text-black p-8 min-h-[800px] shadow-sm border relative">
                {/* Official Header */}
                <div className="text-center border-b pb-6 mb-6">
                  <div className="flex justify-center mb-2">
                    <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center">
                      <Scale className="h-10 w-10 text-black" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold uppercase tracking-wide">Government of India</h2>
                  <h3 className="text-sm font-medium uppercase mt-1">Ministry of Corporate Affairs / Labour / Finance</h3>
                  <p className="text-xs mt-2 italic">This document is generated via BizHive compliant with relevant acts.</p>
                </div>

                <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-justify">
                  {generatedContent || "Select a template to generate document..."}
                </div>

                {/* Signature Section */}
                <div className="mt-16 flex justify-end">
                  <div className="text-center w-48">
                    {signature && <img src={signature} alt="Signed" className="h-16 mx-auto object-contain mb-2" />}
                    <div className="border-t border-black pt-1 font-bold">Authorized Signatory</div>
                    <div className="text-xs text-gray-500">Date: {new Date().toLocaleDateString()}</div>
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
