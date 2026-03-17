import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Pencil, Trash2 } from "lucide-react";

interface AdminDocumentsTabProps {
  documents: any[];
  onRefresh: () => Promise<void>;
}

const emptyDoc = {
  title: "",
  category: "legal",
  description: "",
  tags: "",
  is_premium: false,
};

const extractStoragePath = (url: string) => {
  const marker = "/documents/";
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length);
};

const AdminDocumentsTab = ({ documents, onRefresh }: AdminDocumentsTabProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState(emptyDoc);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentFileUrl, setCurrentFileUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const sortedDocuments = useMemo(
    () => [...documents].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [documents]
  );

  const resetForm = () => {
    setForm(emptyDoc);
    setEditingId(null);
    setCurrentFileUrl("");
    setFile(null);
  };

  const editDocument = (doc: any) => {
    setEditingId(doc.id);
    setForm({
      title: doc.title ?? "",
      category: doc.category ?? "legal",
      description: doc.description ?? "",
      tags: Array.isArray(doc.tags) ? doc.tags.join(", ") : "",
      is_premium: !!doc.is_premium,
    });
    setCurrentFileUrl(doc.file_url ?? "");
    setFile(null);
  };

  const uploadFileIfNeeded = async () => {
    if (!file) return currentFileUrl || null;
    const path = `library/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from("documents").getPublicUrl(path).data.publicUrl;
  };

  const saveDocument = async () => {
    if (!form.title.trim()) {
      toast({ title: "Missing title", description: "Add a document title.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const fileUrl = await uploadFileIfNeeded();
      const payload = {
        title: form.title.trim(),
        category: form.category.trim() || "legal",
        description: form.description.trim() || null,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        is_premium: form.is_premium,
        file_url: fileUrl,
      };

      const query = editingId
        ? supabase.from("documents").update(payload).eq("id", editingId)
        : supabase.from("documents").insert(payload);

      const { error } = await query;
      if (error) throw error;

      toast({ title: editingId ? "Document updated" : "Document created" });
      resetForm();
      await onRefresh();
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteDocument = async (doc: any) => {
    const storagePath = doc.file_url ? extractStoragePath(doc.file_url) : null;
    if (storagePath) {
      await supabase.storage.from("documents").remove([storagePath]);
    }
    const { error } = await supabase.from("documents").delete().eq("id", doc.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Document deleted" });
    await onRefresh();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit document" : "Upload document"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Document title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} />
          </div>
          <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          <Input placeholder="Tags separated by commas" value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} />
          <div className="space-y-2">
            <label className="text-sm font-medium">File upload</label>
            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            {currentFileUrl && <a href={currentFileUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline-offset-4 hover:underline">View current file</a>}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_premium} onChange={(e) => setForm((prev) => ({ ...prev, is_premium: e.target.checked }))} className="h-4 w-4 rounded border-input" />
            Premium document
          </label>
          <div className="flex flex-wrap gap-3">
            <Button onClick={saveDocument} disabled={saving}>
              <FileUp className="h-4 w-4" />
              {saving ? "Saving..." : editingId ? "Update Document" : "Upload Document"}
            </Button>
            {editingId && <Button variant="outline" onClick={resetForm}>Cancel edit</Button>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Library ({sortedDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                {sortedDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-xs text-muted-foreground">{doc.description || "No description"}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge variant="outline">{doc.category}</Badge>
                        <Badge variant={doc.is_premium ? "default" : "secondary"}>{doc.is_premium ? "Premium" : "Free"}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editDocument(doc)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteDocument(doc)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedDocuments.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No documents yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDocumentsTab;
