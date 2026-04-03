import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { supabase } from "@/services/supabase/client";
import type { Tables } from "@/services/supabase/database.types";

type BlogPostRecord = Tables<"blog_posts">;

const formatBlogDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const getBlogImage = (post: BlogPostRecord) =>
  post.cover_image || post.thumbnail_image || "/placeholder.svg";

const setPageMetadata = (title: string, description: string) => {
  document.title = title;

  let descriptionTag = document.querySelector('meta[name="description"]');
  if (!descriptionTag) {
    descriptionTag = document.createElement("meta");
    descriptionTag.setAttribute("name", "description");
    document.head.appendChild(descriptionTag);
  }

  descriptionTag.setAttribute("content", description);
};

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPostRecord | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const bySlug = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", id)
        .eq("published", true)
        .maybeSingle();

      const article = bySlug.data
        ? bySlug.data
        : (
            await supabase
              .from("blog_posts")
              .select("*")
              .eq("id", id)
              .eq("published", true)
              .maybeSingle()
          ).data ?? null;

      setPost(article);

      if (article) {
        const { data } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .eq("category", article.category)
          .neq("id", article.id)
          .order("created_at", { ascending: false })
          .limit(3);

        setRelatedPosts(data ?? []);
        setPageMetadata(
          article.meta_title || `${article.title} | BizHive Blog`,
          article.meta_description ||
            article.excerpt ||
            "Read the latest founder insights on BizHive."
        );
      } else {
        setRelatedPosts([]);
        setPageMetadata(
          "Article Not Found | BizHive Blog",
          "The requested BizHive article could not be found."
        );
      }

      setLoading(false);
    };

    void fetchPost();
  }, [id]);

  const heroImage = useMemo(
    () => (post ? getBlogImage(post) : "/placeholder.svg"),
    [post]
  );

  if (loading) {
    return (
      <div className="page-shell">
        <SiteContainer className="space-y-6">
          <div className="h-[240px] animate-pulse rounded-[32px] bg-muted/40" />
          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <div className="h-[560px] animate-pulse rounded-[28px] bg-muted/40" />
            <div className="space-y-6">
              <div className="h-[220px] animate-pulse rounded-[28px] bg-muted/40" />
              <div className="h-[260px] animate-pulse rounded-[28px] bg-muted/40" />
            </div>
          </div>
        </SiteContainer>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page-shell">
        <SiteContainer>
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="Article not found"
            description="The link may be outdated, or the article has not been published yet."
            action={
              <Button asChild>
                <Link to="/blog">Back to blog</Link>
              </Button>
            }
          />
        </SiteContainer>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <SiteContainer className="space-y-8">
        <Button asChild variant="ghost" className="-ml-3 w-fit">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <PageHeader
          eyebrow={post.category}
          title={post.title}
          description={post.excerpt || "A founder-focused BizHive article."}
          actions={
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-2">
                <User className="h-4 w-4" />
                {post.author_name}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-2">
                <Calendar className="h-4 w-4" />
                {formatBlogDate(post.created_at)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-2">
                <Clock className="h-4 w-4" />
                {post.read_time || "5 min"}
              </span>
            </div>
          }
        />

        <div className="overflow-hidden rounded-[32px] border border-border/70 bg-muted shadow-sm">
          <img src={heroImage} alt={post.title} className="h-full max-h-[480px] w-full object-cover" />
        </div>

        <section className="grid gap-8 xl:grid-cols-[1fr_320px]">
          <Surface className="p-6 md:p-10">
            <div className="prose prose-slate max-w-none text-foreground dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-p:leading-8 prose-li:leading-7 prose-strong:text-foreground">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </Surface>

          <div className="space-y-6">
            <Surface className="p-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  Article details
                </h2>
                <div>
                  <div className="font-medium text-foreground">SEO title</div>
                  <p>{post.meta_title || `${post.title} | BizHive Blog`}</p>
                </div>
                <div>
                  <div className="font-medium text-foreground">SEO description</div>
                  <p>{post.meta_description || post.excerpt || "No description available."}</p>
                </div>
                <div>
                  <div className="font-medium text-foreground">Category</div>
                  <p>{post.category}</p>
                </div>
              </div>
            </Surface>

            <Surface className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    Keep exploring
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    More reads from the same learning lane.
                  </p>
                </div>

                {relatedPosts.length === 0 ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    This is the latest article in its category.
                  </p>
                ) : (
                  relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="block rounded-[22px] border border-border/70 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline">{relatedPost.category}</Badge>
                      </div>
                      <div className="font-medium text-foreground">{relatedPost.title}</div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {relatedPost.excerpt}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
                        Read next
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </Surface>
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default BlogPost;
