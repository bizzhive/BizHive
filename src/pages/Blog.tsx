import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { getPublishedBlogs } from "@/services/site-content";
import { useTranslation } from "react-i18next";

type BlogIndexPost = Awaited<ReturnType<typeof getPublishedBlogs>>[number];

const Blog = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogIndexPost[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    document.title = "BizHive Blog";
    void getPublishedBlogs().then(setPosts);
  }, []);

  const categories = useMemo(() => ["all", ...Array.from(new Set(posts.map((post) => post.category)))], [posts]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === "all" || post.category === category;
      const haystack = [post.title, post.excerpt, post.content, post.category].join(" ").toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [category, posts, search]);

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader eyebrow={t("blog.eyebrow")} title={t("blog.title")} description={t("blog.description")} />

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <Surface className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search articles" className="h-12 rounded-2xl pl-11" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold ${
                    item === category ? "bg-foreground text-background" : "border border-border/80 bg-muted/35 text-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="panel-muted p-4 text-sm leading-7 text-muted-foreground">
              The blog now stays public and useful even when live CMS content is still being rebuilt. If there are no published database posts, curated editorial fallbacks fill the gap.
            </div>
          </Surface>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredPosts.length ? (
              filteredPosts.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`}>
                  <Surface className="h-full transition-colors hover:bg-accent/70">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{post.category}</div>
                    <div className="mt-3 font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">{post.title}</div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
                    <div className="mt-4 text-sm text-muted-foreground">
                      {post.authorName} · {post.readTime}
                    </div>
                  </Surface>
                </Link>
              ))
            ) : (
              <EmptyState title={t("blog.emptyTitle")} description={t("blog.emptyBody")} />
            )}
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Blog;
