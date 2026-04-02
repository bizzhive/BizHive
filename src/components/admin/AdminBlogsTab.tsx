import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
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

type BlogPost = Tables<"blog_posts">;

type AuditLogger = (entry: {
  action: string;
  details?: Json;
  entityId?: string | null;
  entityType: string;
  summary: string;
}) => Promise<void>;

interface AdminBlogsTabProps {
  blogs: BlogPost[];
  canEdit?: boolean;
  currentUserId?: string;
  onAudit?: AuditLogger;
  onRefresh: () => Promise<void>;
}

const PAGE_SIZE = 8;

const emptyBlog = {
  title: "",
  slug: "",
  category: "general",
  excerpt: "",
  cover_image: "",
  thumbnail_image: "",
  read_time: "5 min",
  meta_title: "",
  meta_description: "",
  content: "",
  published: false,
  featured: false,
};

const noopAudit: AuditLogger = async () => {};

const AdminBlogsTab = ({ blogs, canEdit = true, currentUserId, onAudit = noopAudit, onRefresh }: AdminBlogsTabProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState(emptyBlog);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const sortedBlogs = useMemo(
    () => [...blogs].sort((left, right) => +new Date(right.updated_at) - +new Date(left.updated_at)),
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    return sortedBlogs.filter((blog) => {
      const matchesSearch =
        !search ||
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.slug.toLowerCase().includes(search.toLowerCase()) ||
        blog.category.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) {
        return false;
      }

      if (statusFilter === "published") {
        return blog.published;
      }

      if (statusFilter === "draft") {
        return !blog.published;
      }

      if (statusFilter === "featured") {
        return blog.featured;
      }

      return true;
    });
  }, [search, sortedBlogs, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));
  const paginatedBlogs = filteredBlogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleChange = (key: keyof typeof emptyBlog, value: string | boolean) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
      ...(key === "title" && !editingId ? { slug: slugify(String(value)) } : {}),
    }));
  };

  const resetForm = () => {
    setForm(emptyBlog);
    setEditingId(null);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title ?? "",
      slug: blog.slug ?? "",
      category: blog.category ?? "general",
      excerpt: blog.excerpt ?? "",
      cover_image: blog.cover_image ?? "",
      thumbnail_image: blog.thumbnail_image ?? "",
      read_time: blog.read_time ?? "5 min",
      meta_title: blog.meta_title ?? "",
      meta_description: blog.meta_description ?? "",
      content: blog.content ?? "",
      published: !!blog.published,
      featured: !!blog.featured,
    });
  };

  const handleSave = async () => {
    if (!canEdit) {
      return;
    }

    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: "Missing fields", description: "Add a title and content.", variant: "destructive" });
      return;
    }

    setSaving(true);

    const excerpt = form.excerpt.trim() || form.content.trim().slice(0, 180);
    const thumbnail = form.thumbnail_image.trim() || form.cover_image.trim() || null;
    const cover = form.cover_image.trim() || form.thumbnail_image.trim() || null;

    const payload = {
      title: form.title.trim(),
      slug: slugify(form.slug || form.title),
      category: form.category.trim() || "general",
      excerpt,
      cover_image: cover,
      thumbnail_image: thumbnail,
      read_time: form.read_time.trim() || "5 min",
      meta_title: form.meta_title.trim() || `${form.title.trim()} | BizHive Blog`,
      meta_description: form.meta_description.trim() || excerpt,
      content: form.content,
      published: form.published,
      featured: form.featured,
      author_id: currentUserId ?? null,
      author_name: "BizHive Team",
      updated_at: new Date().toISOString(),
    };

    const mutation = editingId
      ? supabase.from("blog_posts").update(payload).eq("id", editingId).select("id").single()
      : supabase.from("blog_posts").insert(payload).select("id").single();

    const { data, error } = await mutation;
    setSaving(false);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    await onAudit({
      action: editingId ? "blog.updated" : "blog.created",
      details: { title: payload.title, category: payload.category, published: payload.published },
      entityId: data?.id ?? editingId,
      entityType: "blog_posts",
      summary: editingId ? `Updated blog \"${payload.title}\"` : `Created blog \"${payload.title}\"`,
    });

    toast({ title: editingId ? "Blog updated" : "Blog created" });
    resetForm();
    await onRefresh();
  };

  const handleDelete = async (blog: BlogPost) => {
    if (!canEdit) {
      return;
    }

    const { error } = await supabase.from("blog_posts").delete().eq("id", blog.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }

    await onAudit({
      action: "blog.deleted",
      details: { title: blog.title, slug: blog.slug },
      entityId: blog.id,
      entityType: "blog_posts",
      summary: `Deleted blog \"${blog.title}\"`,
    });

    toast({ title: "Blog deleted" });
    if (editingId === blog.id) {
      resetForm();
    }
    await onRefresh();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit blog post" : "Create blog post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!canEdit && (
            <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
              Your current role can review blogs but cannot create, edit, or delete them.
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Post title" value={form.title} onChange={(event) => handleChange("title", event.target.value)} disabled={!canEdit} />
            <Input placeholder="Slug" value={form.slug} onChange={(event) => handleChange("slug", event.target.value)} disabled={!canEdit} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Input placeholder="Category" value={form.category} onChange={(event) => handleChange("category", event.target.value)} disabled={!canEdit} />
            <Input placeholder="Read time" value={form.read_time} onChange={(event) => handleChange("read_time", event.target.value)} disabled={!canEdit} />
            <Input placeholder="Thumbnail image URL" value={form.thumbnail_image} onChange={(event) => handleChange("thumbnail_image", event.target.value)} disabled={!canEdit} />
          </div>
          <Input placeholder="Cover image URL" value={form.cover_image} onChange={(event) => handleChange("cover_image", event.target.value)} disabled={!canEdit} />
          <Textarea placeholder="Short excerpt" value={form.excerpt} onChange={(event) => handleChange("excerpt", event.target.value)} className="min-h-[100px]" disabled={!canEdit} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="SEO title" value={form.meta_title} onChange={(event) => handleChange("meta_title", event.target.value)} disabled={!canEdit} />
            <Input placeholder="SEO description" value={form.meta_description} onChange={(event) => handleChange("meta_description", event.target.value)} disabled={!canEdit} />
          </div>
          <Textarea placeholder="Full blog content" value={form.content} onChange={(event) => handleChange("content", event.target.value)} className="min-h-[320px]" disabled={!canEdit} />
          <div className="flex flex-wrap gap-6 text-sm text-foreground">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.published} onChange={(event) => handleChange("published", event.target.checked)} className="h-4 w-4 rounded border-input" disabled={!canEdit} />
              Publish immediately
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(event) => handleChange("featured", event.target.checked)} className="h-4 w-4 rounded border-input" disabled={!canEdit} />
              Mark as featured
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} disabled={saving || !canEdit}>
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
          <CardTitle>Existing posts ({filteredBlogs.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <Input placeholder="Search blogs..." value={search} onChange={(event) => setSearch(event.target.value)} />
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="featured">Featured</option>
            </select>
          </div>
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
                {paginatedBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-medium">
                          {blog.title}
                          {blog.featured && <Star className="h-4 w-4 text-amber-500" />}
                        </div>
                        <div className="text-xs text-muted-foreground">/{blog.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={blog.published ? "default" : "secondary"}>{blog.published ? "Published" : "Draft"}</Badge>
                        {blog.featured && <Badge variant="outline">Featured</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(blog)} disabled={!canEdit}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedBlogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                      No blogs matched the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogsTab;
