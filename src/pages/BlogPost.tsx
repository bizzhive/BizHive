import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/services/supabase/client";
import type { Tables } from "@/services/supabase/database.types";

type BlogPostRecord = Tables<"blog_posts">;

const formatBlogDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const getBlogImage = (post: BlogPostRecord) => post.cover_image || post.thumbnail_image || "/placeholder.svg";

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
          article.meta_description || article.excerpt || "Read the latest founder insights on BizHive."
        );
      } else {
        setRelatedPosts([]);
        setPageMetadata("Article Not Found | BizHive Blog", "The requested BizHive article could not be found.");
      }

      setLoading(false);
    };

    void fetchPost();
  }, [id]);

  const heroImage = useMemo(() => (post ? getBlogImage(post) : "/placeholder.svg"), [post]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading article...</div>;
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-xl text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Article Not Found</CardTitle>
            <CardDescription>The link may be outdated, or the article has not been published yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl space-y-10 px-4 py-8 md:py-12">
        <Button asChild variant="ghost" className="-ml-3 w-fit">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{post.category}</Badge>
              {post.featured && <Badge variant="secondary">Featured</Badge>}
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">{post.title}</h1>
              {post.excerpt && <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{post.excerpt}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><User className="h-4 w-4" />{post.author_name}</span>
              <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" />{formatBlogDate(post.created_at)}</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{post.read_time || "5 min"}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border/70 bg-muted shadow-sm">
            <img src={heroImage} alt={post.title} className="h-full min-h-[320px] w-full object-cover" />
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1fr_320px]">
          <article className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm md:p-10">
            <div className="prose prose-slate max-w-none text-foreground dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-p:leading-8 prose-li:leading-7 prose-strong:text-foreground">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keep exploring</CardTitle>
                <CardDescription>More reads from the same learning lane.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedPosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">This is the latest article in its category.</p>
                ) : (
                  relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="block rounded-2xl border border-border/70 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline">{relatedPost.category}</Badge>
                      </div>
                      <div className="font-medium text-foreground">{relatedPost.title}</div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{relatedPost.excerpt}</p>
                      <div className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
                        Read next
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default BlogPost;
