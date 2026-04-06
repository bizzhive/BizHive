import { supabase } from "@/services/supabase/client";
import { legalTemplateFallbacks, type LegalTemplateSeed } from "@/content/legal";
import { seedBlogPosts, type SeedBlogPost } from "@/content/blogs";

type RemoteBlogPost = {
  author_name?: string | null;
  category?: string | null;
  content?: string | null;
  created_at?: string | null;
  excerpt?: string | null;
  id: string;
  meta_description?: string | null;
  meta_title?: string | null;
  published?: boolean | null;
  read_time?: string | null;
  slug: string;
  title: string;
};

type RemoteDocument = {
  category: string;
  description: string | null;
  file_url: string | null;
  id: string;
  is_premium: boolean | null;
  tags: string[] | null;
  title: string;
};

type RemoteLegalTemplate = {
  category: string;
  field_schema: Array<{ label: string; name: string; placeholder?: string; type?: string }> | null;
  id: string;
  published: boolean;
  slug: string;
  summary: string | null;
  template_content: string;
  title: string;
};

export const getPublishedBlogs = async (): Promise<SeedBlogPost[]> => {
  const query = supabase
    .from("blog_posts")
    .select("id, slug, title, category, excerpt, content, author_name, read_time, meta_title, meta_description, published, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error || !data?.length) {
    return seedBlogPosts;
  }

  return (data as RemoteBlogPost[]).map((post) => ({
    slug: post.slug,
    title: post.title,
    category: post.category || "General",
    excerpt: post.excerpt || post.content?.slice(0, 160) || "",
    content: post.content || "",
    authorName: post.author_name || "BizHive Editorial",
    publishedAt: post.created_at || new Date().toISOString(),
    readTime: post.read_time || "5 min",
    metaTitle: post.meta_title || `${post.title} | BizHive`,
    metaDescription: post.meta_description || post.excerpt || "",
  }));
};

export const getBlogPostBySlug = async (slug: string): Promise<SeedBlogPost | null> => {
  const fallback = seedBlogPosts.find((post) => post.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, category, excerpt, content, author_name, read_time, meta_title, meta_description, published, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return fallback;
  }

  const post = data as RemoteBlogPost;
  return {
    slug: post.slug,
    title: post.title,
    category: post.category || "General",
    excerpt: post.excerpt || post.content?.slice(0, 160) || "",
    content: post.content || "",
    authorName: post.author_name || "BizHive Editorial",
    publishedAt: post.created_at || new Date().toISOString(),
    readTime: post.read_time || "5 min",
    metaTitle: post.meta_title || `${post.title} | BizHive`,
    metaDescription: post.meta_description || post.excerpt || "",
  };
};

export const getDocumentLibrary = async (): Promise<RemoteDocument[]> => {
  const { data } = await supabase
    .from("documents")
    .select("id, title, category, description, file_url, tags, is_premium")
    .order("created_at", { ascending: false });

  return (data as RemoteDocument[] | null) ?? [];
};

export const getLegalTemplates = async (): Promise<LegalTemplateSeed[]> => {
  const { data, error } = await supabase
    .from("legal_document_templates")
    .select("id, title, slug, category, summary, field_schema, template_content, published")
    .eq("published", true)
    .order("created_at", { ascending: true });

  if (error || !data?.length) {
    return legalTemplateFallbacks;
  }

  return (data as RemoteLegalTemplate[]).map((template) => ({
    slug: template.slug,
    title: template.title,
    category: template.category,
    summary: template.summary || "",
    fieldSchema: Array.isArray(template.field_schema) ? template.field_schema : [],
    templateContent: template.template_content,
  }));
};
