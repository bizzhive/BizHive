import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/services/supabase/client";
import type { Tables } from "@/services/supabase/database.types";

type BlogPost = Tables<"blog_posts">;

const BLOG_INDEX_TITLE = "BizHive Blog | Startup Guides, Playbooks, and Founder Insights";
const BLOG_INDEX_DESCRIPTION =
  "Explore founder-focused articles on strategy, launch, growth, funding, compliance, sales, and operations.";

const formatBlogDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const getBlogImage = (post: BlogPost) => post.thumbnail_image || post.cover_image || "/placeholder.svg";

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

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageMetadata(BLOG_INDEX_TITLE, BLOG_INDEX_DESCRIPTION);

    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      setPosts(data ?? []);
      setLoading(false);
    };

    void fetchPosts();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((post) => post.category))).sort((left, right) => left.localeCompare(right))],
    [posts]
  );

  const filteredPosts = useMemo(
    () => (activeCategory === "All" ? posts : posts.filter((post) => post.category === activeCategory)),
    [activeCategory, posts]
  );

  const featuredPost = useMemo(
    () => filteredPosts.find((post) => post.featured) ?? filteredPosts[0] ?? null,
    [filteredPosts]
  );

  const regularPosts = useMemo(
    () => filteredPosts.filter((post) => post.id !== featuredPost?.id),
    [featuredPost?.id, filteredPosts]
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground">
        <div className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <Badge className="border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/10">
              Editorial Library
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
                Founder-ready articles for launch, growth, operations, and scale.
              </h1>
              <p className="max-w-2xl text-lg text-primary-foreground/85 md:text-xl">
                Browse practical playbooks, operator notes, and business explainers built for entrepreneurs who need clear answers and useful next steps.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Published posts", value: posts.length },
                { label: "Focus areas", value: categories.length > 1 ? categories.length - 1 : 0 },
                { label: "Fresh reads", value: regularPosts.length + (featuredPost ? 1 : 0) },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-sm text-primary-foreground/80">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden border-white/15 bg-white/10 text-primary-foreground shadow-2xl backdrop-blur">
            <div className="relative h-full min-h-[280px] overflow-hidden">
              <img
                src={getBlogImage(featuredPost ?? posts[0] ?? ({ thumbnail_image: "/placeholder.svg", cover_image: null } as BlogPost))}
                alt={featuredPost?.title || "BizHive Blog"}
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-6">
                <Badge className="mb-3 w-fit border-0 bg-white/15 text-white hover:bg-white/15">
                  {featuredPost?.category || "Latest Guide"}
                </Badge>
                <h2 className="text-2xl font-semibold leading-tight">
                  {featuredPost?.title || "Fresh startup guides, ready for your next move."}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm text-primary-foreground/80">
                  {featuredPost?.excerpt || BLOG_INDEX_DESCRIPTION}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <div className="container mx-auto space-y-10 px-4 py-12">
        <section className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </section>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-[340px] animate-pulse bg-muted/40" />
            ))}
          </div>
        ) : (
          <>
            {featuredPost && (
              <section className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Featured article</h2>
                    <p className="text-sm text-muted-foreground">Start with the editor's pick, then explore by topic.</p>
                  </div>
                </div>

                <Card className="overflow-hidden border-border/70 shadow-sm transition-all hover:shadow-xl">
                  <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="relative min-h-[320px] overflow-hidden bg-muted">
                      <img
                        src={getBlogImage(featuredPost)}
                        alt={featuredPost.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-between p-6 lg:p-8">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge>{featuredPost.category}</Badge>
                          {featuredPost.featured && <Badge variant="secondary">Featured</Badge>}
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-3xl font-bold tracking-tight text-foreground">{featuredPost.title}</h3>
                          <CardDescription className="text-base leading-relaxed">{featuredPost.excerpt}</CardDescription>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-2"><User className="h-4 w-4" />{featuredPost.author_name}</span>
                          <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" />{formatBlogDate(featuredPost.created_at)}</span>
                          <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{featuredPost.read_time || "5 min"}</span>
                        </div>

                        <Button asChild className="w-fit">
                          <Link to={`/blog/${featuredPost.slug}`}>
                            Read full article
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </section>
            )}

            <section className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {activeCategory === "All" ? "Latest reads" : `${activeCategory} articles`}
                </h2>
                <p className="text-sm text-muted-foreground">Clean previews, structured metadata, and consistent article pages across the full library.</p>
              </div>

              {regularPosts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No articles are available in this category yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {regularPosts.map((post) => (
                    <Card key={post.id} className="group overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative h-52 overflow-hidden bg-muted">
                        <img
                          src={getBlogImage(post)}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
                        <Badge className="absolute left-4 top-4">{post.category}</Badge>
                      </div>
                      <CardHeader className="space-y-3 pb-3">
                        <CardTitle className="line-clamp-2 text-xl transition-colors group-hover:text-primary">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-3 text-sm leading-6">{post.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" />{post.author_name}</span>
                          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.read_time || "5 min"}</span>
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatBlogDate(post.created_at)}</span>
                        </div>
                        <Button asChild variant="ghost" className="w-full justify-between px-0 text-primary hover:bg-transparent hover:text-primary">
                          <Link to={`/blog/${post.slug}`}>
                            Read article
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
