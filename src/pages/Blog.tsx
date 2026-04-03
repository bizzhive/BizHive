import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, Clock, Search, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";
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

const getBlogImage = (post: BlogPost) =>
  post.thumbnail_image || post.cover_image || "/placeholder.svg";

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
  const [searchQuery, setSearchQuery] = useState("");
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
    () => [
      "All",
      ...Array.from(new Set(posts.map((post) => post.category))).sort((left, right) =>
        left.localeCompare(right)
      ),
    ],
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      if (!normalizedQuery) {
        return matchesCategory;
      }

      const haystack = [
        post.title,
        post.excerpt,
        post.category,
        post.author_name,
        post.content,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && haystack.includes(normalizedQuery);
    });
  }, [activeCategory, posts, searchQuery]);

  const featuredPost = useMemo(
    () => filteredPosts.find((post) => post.featured) ?? filteredPosts[0] ?? null,
    [filteredPosts]
  );

  const regularPosts = useMemo(
    () => filteredPosts.filter((post) => post.id !== featuredPost?.id),
    [featuredPost?.id, filteredPosts]
  );

  const totalReads = regularPosts.length + (featuredPost ? 1 : 0);

  return (
    <div className="page-shell">
      <SiteContainer className="space-y-8">
        <PageHeader
          eyebrow="Editorial library"
          title="Articles built for founder decisions"
          description="Browse clearer guides on strategy, launch, compliance, operations, and growth. The blog now follows the same shell, search pattern, and card system as the rest of BizHive."
          actions={
            <>
              <Button asChild size="lg">
                <Link to="/dashboard">Back to dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/resources/learn">Open learning hub</Link>
              </Button>
            </>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <Surface className="space-y-5">
            <SectionHeading
              eyebrow="Blog search"
              title="Find the right article faster"
              description="Search by topic, category, author, or excerpt. This gives the blog the same discovery pattern already introduced on the tools page."
            />

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search guides, topics, or authors..."
                className="h-12 rounded-2xl border-border/70 bg-muted/35 pl-11"
                aria-label="Search blog articles"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
                    activeCategory === category
                      ? "border-primary/30 bg-primary text-primary-foreground"
                      : "border-border/70 bg-background/70 text-foreground hover:bg-accent"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {[
                {
                  title: "One card system",
                  description:
                    "The editorial pages now use the same visual hierarchy and content framing as the core product screens.",
                },
                {
                  title: "Cleaner scanning",
                  description:
                    "Search, categories, and article metadata are aligned so the library feels more deliberate as it grows.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] border border-border/70 bg-background/72 p-4">
                  <div className="font-display text-lg font-semibold tracking-[-0.04em] text-foreground">
                    {item.title}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Editorial overview"
                title="A more structured founder reading experience"
                description="Featured reads stay prominent, while the rest of the library remains easy to browse and filter."
              />
              <Badge className="w-fit rounded-full border-none bg-primary/10 px-3 py-1 text-primary">
                {totalReads} results
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Published posts", value: posts.length },
                {
                  label: "Focus areas",
                  value: categories.length > 1 ? categories.length - 1 : 0,
                },
                { label: "Matching reads", value: totalReads },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] border border-border/70 bg-background/70 p-4">
                  <div className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    {item.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </Surface>
        </section>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-[340px] animate-pulse bg-muted/40" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-6 w-6" />}
            title="No matching articles"
            description="Try a broader search term or reset the category filter to explore the full editorial library."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              >
                Reset filters
              </Button>
            }
          />
        ) : (
          <>
            {featuredPost ? (
              <section className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                      Featured article
                    </h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Start with the editor’s pick, then continue through the rest of the library.
                    </p>
                  </div>
                </div>

                <Card className="overflow-hidden border-border/70 shadow-sm transition-all hover:shadow-xl">
                  <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
                    <div className="relative min-h-[320px] overflow-hidden bg-muted">
                      <img
                        src={getBlogImage(featuredPost)}
                        alt={featuredPost.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
                    </div>
                    <div className="flex flex-col justify-between p-6 lg:p-8">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge>{featuredPost.category}</Badge>
                          {featuredPost.featured ? (
                            <Badge variant="secondary">Featured</Badge>
                          ) : null}
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-display text-4xl font-semibold tracking-[-0.045em] text-foreground">
                            {featuredPost.title}
                          </h3>
                          <CardDescription className="text-base leading-7">
                            {featuredPost.excerpt}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {featuredPost.author_name}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatBlogDate(featuredPost.created_at)}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {featuredPost.read_time || "5 min"}
                          </span>
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
            ) : null}

            <section className="space-y-5">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                  {activeCategory === "All" ? "Latest reads" : `${activeCategory} articles`}
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Structured previews, clear metadata, and a consistent reading path across the library.
                </p>
              </div>

              {regularPosts.length === 0 ? (
                <EmptyState
                  icon={<BookOpen className="h-6 w-6" />}
                  title="No more articles in this set"
                  description="The featured article is the only match right now. Reset the filters to browse more from the full library."
                  action={
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("All");
                      }}
                    >
                      Browse all articles
                    </Button>
                  }
                />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {regularPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="group overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
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
                        <CardTitle className="line-clamp-2 text-xl transition-colors group-hover:text-primary">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-sm leading-6">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {post.author_name}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {post.read_time || "5 min"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatBlogDate(post.created_at)}
                          </span>
                        </div>
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-between px-0 text-primary hover:bg-transparent hover:text-primary"
                        >
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
      </SiteContainer>
    </div>
  );
};

export default Blog;
