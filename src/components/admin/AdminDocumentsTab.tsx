import { useEffect, useMemo, useState } from "react";
import { FileUp, Pencil, Trash2 } from "lucide-react";
import { slugify } from "@/lib/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import type { Json, Tables } from "@/services/supabase/database.types";

type DocumentRecord = Tables<"documents">;
type LegalTemplate = Tables<"legal_document_templates">;

type AuditLogger = (entry: {
  action: string;
  details?: Json;
  entityId?: string | null;
  entityType: string;
  summary: string;
}) => Promise<void>;

interface AdminDocumentsTabProps {
  canEdit?: boolean;
  documents: DocumentRecord[];
  legalTemplates?: LegalTemplate[];
  onAudit?: AuditLogger;
  onRefresh: () => Promise<void>;
}

const PAGE_SIZE = 8;

const emptyDocument = {
  title: "",
  category: "legal",
  description: "",
  tags: "",
  is_premium: false,
};

const emptyTemplate = {
  title: "",
  slug: "",
  category: "legal",
  summary: "",
  jurisdiction: "India",
  published: true,
  field_schema: "[]",
  template_content: "",
};

const extractStoragePath = (url: string) => {
  const marker = "/documents/";
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length);
};

const noopAudit: AuditLogger = async () => {};

const AdminDocumentsTab = ({ canEdit = true, documents, legalTemplates = [], onAudit = noopAudit, onRefresh }: AdminDocumentsTabProps) => {
  const { toast } = useToast();
  const [documentForm, setDocumentForm] = useState(emptyDocument);
  const [templateForm, setTemplateForm] = useState(emptyTemplate);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [currentFileUrl, setCurrentFileUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [savingDocument, setSavingDocument] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [documentPage, setDocumentPage] = useState(1);
  const [templatePage, setTemplatePage] = useState(1);

  const filteredDocuments = useMemo(() => {
    return [...documents]
      .sort((left, right) => +new Date(right.created_at) - +new Date(left.created_at))
      .filter((document) => {
        const matchesSearch =
          !search ||
          document.title.toLowerCase().includes(search.toLowerCase()) ||
          (document.description || "").toLowerCase().includes(search.toLowerCase()) ||
          document.category.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "all" || document.category === categoryFilter;
        return matchesSearch && matchesCategory;
      });
  }, [categoryFilter, documents, search]);

  const filteredTemplates = useMemo(() => {
    return [...legalTemplates]
      .sort((left, right) => +new Date(right.updated_at) - +new Date(left.updated_at))
      .filter((template) => {
        const matchesSearch =
          !search ||
          template.title.toLowerCase().includes(search.toLowerCase()) ||
          template.slug.toLowerCase().includes(search.toLowerCase()) ||
          template.category.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
        return matchesSearch && matchesCategory;
      });
  }, [categoryFilter, legalTemplates, search]);

  const totalDocumentPages = Math.max(1, Math.ceil(filteredDocuments.length / PAGE_SIZE));
  const totalTemplatePages = Math.max(1, Math.ceil(filteredTemplates.length / PAGE_SIZE));
  const paginatedDocuments = filteredDocuments.slice((documentPage - 1) * PAGE_SIZE, documentPage * PAGE_SIZE);
  const paginatedTemplates = filteredTemplates.slice((templatePage - 1) * PAGE_SIZE, templatePage * PAGE_SIZE);

  useEffect(() => {
    setDocumentPage(1);
    setTemplatePage(1);
  }, [categoryFilter, search]);

  useEffect(() => {
    if (documentPage > totalDocumentPages) {
      setDocumentPage(totalDocumentPages);
    }
  }, [documentPage, totalDocumentPages]);

  useEffect(() => {
    if (templatePage > totalTemplatePages) {
      setTemplatePage(totalTemplatePages);
    }
  }, [templatePage, totalTemplatePages]);

  const resetDocumentForm = () => {
    setDocumentForm(emptyDocument);
    setEditingDocumentId(null);
    setCurrentFileUrl("");
    setFile(null);
  };

  const resetTemplateForm = () => {
    setTemplateForm(emptyTemplate);
    setEditingTemplateId(null);
  };

  const editDocument = (document: DocumentRecord) => {
    setEditingDocumentId(document.id);
    setDocumentForm({
      title: document.title ?? "",
      category: document.category ?? "legal",
      description: document.description ?? "",
      tags: Array.isArray(document.tags) ? document.tags.join(", ") : "",
      is_premium: !!document.is_premium,
    });
    setCurrentFileUrl(document.file_url ?? "");
    setFile(null);
  };

  const editTemplate = (template: LegalTemplate) => {
    setEditingTemplateId(template.id);
    setTemplateForm({
      title: template.title ?? "",
      slug: template.slug ?? "",
      category: template.category ?? "legal",
      summary: template.summary ?? "",
      jurisdiction: template.jurisdiction ?? "India",
      published: !!template.published,
      field_schema: JSON.stringify(template.field_schema ?? [], null, 2),
      template_content: template.template_content ?? "",
    });
  };

  const uploadFileIfNeeded = async () => {
    if (!file) {
      return currentFileUrl || null;
    }

    const path = `library/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
    if (error) {
      throw error;
    }

    return supabase.storage.from("documents").getPublicUrl(path).data.publicUrl;
  };

  const saveDocument = async () => {
    if (!canEdit || !documentForm.title.trim()) {
      return;
    }

    setSavingDocument(true);
    try {
      const fileUrl = await uploadFileIfNeeded();
      const payload = {
        title: documentForm.title.trim(),
        category: documentForm.category.trim() || "legal",
        description: documentForm.description.trim() || null,
        tags: documentForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        is_premium: documentForm.is_premium,
        file_url: fileUrl,
      };

      const mutation = editingDocumentId
        ? supabase.from("documents").update(payload).eq("id", editingDocumentId).select("id").single()
        : supabase.from("documents").insert(payload).select("id").single();

      const { data, error } = await mutation;
      if (error) {
        throw error;
      }

      await onAudit({
        action: editingDocumentId ? "document.updated" : "document.created",
        details: { title: payload.title, category: payload.category, is_premium: payload.is_premium },
        entityId: data?.id ?? editingDocumentId,
        entityType: "documents",
        summary: editingDocumentId ? `Updated document \"${payload.title}\"` : `Created document \"${payload.title}\"`,
      });

      toast({ title: editingDocumentId ? "Document updated" : "Document created" });
      resetDocumentForm();
      await onRefresh();
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } finally {
      setSavingDocument(false);
    }
  };

  const saveTemplate = async () => {
    if (!canEdit || !templateForm.title.trim() || !templateForm.template_content.trim()) {
      return;
    }

    setSavingTemplate(true);
    try {
      const fieldSchema = JSON.parse(templateForm.field_schema || "[]");
      const payload = {
        title: templateForm.title.trim(),
        slug: slugify(templateForm.slug || templateForm.title),
        category: templateForm.category.trim() || "legal",
        summary: templateForm.summary.trim() || null,
        jurisdiction: templateForm.jurisdiction.trim() || "India",
        published: templateForm.published,
        field_schema: fieldSchema,
        template_content: templateForm.template_content,
        updated_at: new Date().toISOString(),
      };

      const mutation = editingTemplateId
        ? supabase.from("legal_document_templates").update(payload).eq("id", editingTemplateId).select("id").single()
        : supabase.from("legal_document_templates").insert(payload).select("id").single();

      const { data, error } = await mutation;
      if (error) {
        throw error;
      }

      await onAudit({
        action: editingTemplateId ? "legal-template.updated" : "legal-template.created",
        details: { title: payload.title, category: payload.category, published: payload.published },
        entityId: data?.id ?? editingTemplateId,
        entityType: "legal_document_templates",
        summary: editingTemplateId ? `Updated legal template \"${payload.title}\"` : `Created legal template \"${payload.title}\"`,
      });

      toast({ title: editingTemplateId ? "Template updated" : "Template created" });
      resetTemplateForm();
      await onRefresh();
    } catch (error: any) {
      toast({ title: "Template save failed", description: error.message || "Invalid JSON in field schema.", variant: "destructive" });
    } finally {
      setSavingTemplate(false);
    }
  };

  const deleteDocument = async (document: DocumentRecord) => {
    if (!canEdit) {
      return;
    }

    const storagePath = document.file_url ? extractStoragePath(document.file_url) : null;
    if (storagePath) {
      await supabase.storage.from("documents").remove([storagePath]);
    }

    const { error } = await supabase.from("documents").delete().eq("id", document.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }

    await onAudit({
      action: "document.deleted",
      details: { title: document.title, category: document.category },
      entityId: document.id,
      entityType: "documents",
      summary: `Deleted document \"${document.title}\"`,
    });

    toast({ title: "Document deleted" });
    await onRefresh();
  };

  const deleteTemplate = async (template: LegalTemplate) => {
    if (!canEdit) {
      return;
    }

    const { error } = await supabase.from("legal_document_templates").delete().eq("id", template.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }

    await onAudit({
      action: "legal-template.deleted",
      details: { title: template.title, slug: template.slug },
      entityId: template.id,
      entityType: "legal_document_templates",
      summary: `Deleted legal template \"${template.title}\"`,
    });

    toast({ title: "Template deleted" });
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      {!canEdit && (
        <Card>
          <CardContent className="py-4 text-sm text-muted-foreground">
            Your current role can review documents and templates, but edit actions are disabled.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_220px]">
          <Input placeholder="Search documents and templates..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <Input placeholder="Category filter (or leave blank)" value={categoryFilter === "all" ? "" : categoryFilter} onChange={(event) => setCategoryFilter(event.target.value ? event.target.value : "all")} />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingDocumentId ? "Edit library document" : "Upload library document"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Document title" value={documentForm.title} onChange={(event) => setDocumentForm((previous) => ({ ...previous, title: event.target.value }))} disabled={!canEdit} />
              <Input placeholder="Category" value={documentForm.category} onChange={(event) => setDocumentForm((previous) => ({ ...previous, category: event.target.value }))} disabled={!canEdit} />
            </div>
            <Textarea placeholder="Description" value={documentForm.description} onChange={(event) => setDocumentForm((previous) => ({ ...previous, description: event.target.value }))} disabled={!canEdit} />
            <Input placeholder="Tags separated by commas" value={documentForm.tags} onChange={(event) => setDocumentForm((previous) => ({ ...previous, tags: event.target.value }))} disabled={!canEdit} />
            <div className="space-y-2">
              <label className="text-sm font-medium">File upload</label>
              <Input type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} disabled={!canEdit} />
              {currentFileUrl && <a href={currentFileUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline-offset-4 hover:underline">View current file</a>}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={documentForm.is_premium} onChange={(event) => setDocumentForm((previous) => ({ ...previous, is_premium: event.target.checked }))} className="h-4 w-4 rounded border-input" disabled={!canEdit} />
              Premium document
            </label>
            <div className="flex flex-wrap gap-3">
              <Button onClick={saveDocument} disabled={savingDocument || !canEdit}>
                <FileUp className="h-4 w-4" />
                {savingDocument ? "Saving..." : editingDocumentId ? "Update Document" : "Upload Document"}
              </Button>
              {editingDocumentId && <Button variant="outline" onClick={resetDocumentForm}>Cancel edit</Button>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{editingTemplateId ? "Edit legal template" : "Create legal template"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Template title" value={templateForm.title} onChange={(event) => setTemplateForm((previous) => ({ ...previous, title: event.target.value, slug: !previous.slug ? slugify(event.target.value) : previous.slug }))} disabled={!canEdit} />
              <Input placeholder="Slug" value={templateForm.slug} onChange={(event) => setTemplateForm((previous) => ({ ...previous, slug: event.target.value }))} disabled={!canEdit} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Input placeholder="Category" value={templateForm.category} onChange={(event) => setTemplateForm((previous) => ({ ...previous, category: event.target.value }))} disabled={!canEdit} />
              <Input placeholder="Jurisdiction" value={templateForm.jurisdiction} onChange={(event) => setTemplateForm((previous) => ({ ...previous, jurisdiction: event.target.value }))} disabled={!canEdit} />
              <label className="flex items-center gap-2 rounded-md border px-3 text-sm">
                <input type="checkbox" checked={templateForm.published} onChange={(event) => setTemplateForm((previous) => ({ ...previous, published: event.target.checked }))} className="h-4 w-4 rounded border-input" disabled={!canEdit} />
                Published
              </label>
            </div>
            <Textarea placeholder="Template summary" value={templateForm.summary} onChange={(event) => setTemplateForm((previous) => ({ ...previous, summary: event.target.value }))} disabled={!canEdit} />
            <Textarea placeholder="Field schema JSON" value={templateForm.field_schema} onChange={(event) => setTemplateForm((previous) => ({ ...previous, field_schema: event.target.value }))} className="min-h-[120px] font-mono text-xs" disabled={!canEdit} />
            <Textarea placeholder="Template content" value={templateForm.template_content} onChange={(event) => setTemplateForm((previous) => ({ ...previous, template_content: event.target.value }))} className="min-h-[220px]" disabled={!canEdit} />
            <div className="flex flex-wrap gap-3">
              <Button onClick={saveTemplate} disabled={savingTemplate || !canEdit}>
                <FileUp className="h-4 w-4" />
                {savingTemplate ? "Saving..." : editingTemplateId ? "Update Template" : "Create Template"}
              </Button>
              {editingTemplateId && <Button variant="outline" onClick={resetTemplateForm}>Cancel edit</Button>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Library ({filteredDocuments.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-[720px] overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{document.title}</div>
                          <div className="text-xs text-muted-foreground">{document.description || "No description"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Badge variant="outline">{document.category}</Badge>
                          <Badge variant={document.is_premium ? "default" : "secondary"}>{document.is_premium ? "Premium" : "Free"}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => editDocument(document)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteDocument(document)} disabled={!canEdit}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedDocuments.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No documents matched the current filters.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Page {documentPage} of {totalDocumentPages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setDocumentPage((current) => Math.max(1, current - 1))} disabled={documentPage === 1}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setDocumentPage((current) => Math.min(totalDocumentPages, current + 1))} disabled={documentPage === totalDocumentPages}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legal templates ({filteredTemplates.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-[720px] overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{template.title}</div>
                          <div className="text-xs text-muted-foreground">/{template.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Badge variant="outline">{template.category}</Badge>
                          <Badge variant={template.published ? "default" : "secondary"}>{template.published ? "Published" : "Draft"}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => editTemplate(template)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteTemplate(template)} disabled={!canEdit}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedTemplates.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No legal templates matched the current filters.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Page {templatePage} of {totalTemplatePages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setTemplatePage((current) => Math.max(1, current - 1))} disabled={templatePage === 1}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setTemplatePage((current) => Math.min(totalTemplatePages, current + 1))} disabled={templatePage === totalTemplatePages}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDocumentsTab;
