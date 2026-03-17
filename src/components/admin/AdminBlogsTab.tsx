import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/text";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface AdminBlogsTabProps {
  blogs: any[];
  onRefresh: () => Promise<void>;
  currentUserId?: string;
}

const emptyBlog = {
  title: "",
  slug: "",
  category: "general",
  excerpt: "",
  cover_image: "",
  read_time: "5 min",
  content: "",
  published: false,
};

const AdminBlogsTab = ({ blogs, onRefresh, currentUserId }: AdminBlogsTabProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState(emptyBlog);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const sortedBlogs = useMemo(
    () => [...blogs].sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at)),
    [blogs]
  );

  const handleChange = (key: keyof typeof emptyBlog, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "title" && !editingId ? { slug: slugify(String(value)) } : {}),
    }));
  };

  const resetForm = () => {
    setForm(emptyBlog);
    setEditingId(null);
  };

  const handleEdit = (blog: any) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title ?? "",
      slug: blog.slug ?? "",
      category: blog.category ?? "general",
      excerpt: blog.excerpt ?? "",
      cover_image: blog.cover_image ?? "",
      read_time: blog.read_time ?? "5 min",
      content: blog.content ?? "",
      published: !!blog.published,
    });
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: "Missing fields", description: "Add a title and content.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: slugify(form.slug || form.title),
      category: form.category.trim() || "general",
      excerpt: form.excerpt.trim() || form.content.trim().slice(0, 180),
      cover_image: form.cover_image.trim() || null,
      read_time: form.read_time.trim() || "5 min",
      content: form.content,
      published: form.published,
      author_id: currentUserId ?? null,
      author_name: "BizHive Team",
      updated_at: new Date().toISOString(),
    };

    const query = editingId
      ? supabase.from("blog_posts").update(payload).eq("id", editingId)
      : supabase.from("blog_posts").insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: editingId ? "Blog updated" : "Blog created" });
    resetForm();
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Blog deleted" });
    if (editingId === id) resetForm();
    await onRefresh();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit blog post" : "Create blog post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Post title" value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
            <Input placeholder="Slug" value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Input placeholder="Category" value={form.category} onChange={(e) => handleChange("category", e.target.value)} />
            <Input placeholder="Read time" value={form.read_time} onChange={(e) => handleChange("read_time", e.target.value)} />
            <Input placeholder="Cover image URL" value={form.cover_image} onChange={(e) => handleChange("cover_image", e.target.value)} />
          </div>
          <Textarea placeholder="Short excerpt" value={form.excerpt} onChange={(e) => handleChange("excerpt", e.target.value)} className="min-h-[100px]" />
          <Textarea placeholder="Full blog content" value={form.content} onChange={(e) => handleChange("content", e.target.value)} className="min-h-[320px]" />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.published} onChange={(e) => handleChange("published", e.target.checked)} className="h-4 w-4 rounded border-input" />
            Publish immediately
          </label>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} disabled={saving}>
              <Plus className="h-4 w-4" />
              {saving ? "Saving..." : editingId ? "Update Blog" : "Create Blog"}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>Cancel edit</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing posts ({sortedBlogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[700px] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{blog.title}</div>
                        <div className="text-xs text-muted-foreground">/{blog.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={blog.published ? "default" : "secondary"}>
                        {blog.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(blog.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedBlogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                      No blogs yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogsTab;
