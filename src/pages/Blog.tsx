import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false });
      setPosts(data ?? []);
    };
    fetchPosts();
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((post) => post.category)))], [posts]);
  const filtered = activeCategory === "All" ? posts : posts.filter((post) => post.category === activeCategory);
  const featuredPost = filtered[0] ?? null;
  const regularPosts = filtered.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-r from-primary to-accent py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Business Insights & Guides</h1>
          <p className="mx-auto max-w-2xl text-xl text-primary-foreground/90">Fresh articles from the BizHive CMS on launch, growth, funding, compliance, and operations.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {featuredPost && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Featured Article</h2>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="md:flex">
                <div className="flex items-center justify-center bg-muted p-12 md:w-1/2">
                  <span className="text-6xl">📝</span>
                </div>
                <div className="p-6 md:w-1/2">
                  <Badge className="mb-3">{featuredPost.category}</Badge>
                  <CardHeader className="mb-4 p-0">
                    <CardTitle className="text-xl md:text-2xl">{featuredPost.title}</CardTitle>
                    <CardDescription>{featuredPost.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="mb-4 flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center"><User className="mr-1 h-4 w-4" />{featuredPost.author_name}</div>
                      <div className="flex items-center"><Calendar className="mr-1 h-4 w-4" />{new Date(featuredPost.created_at).toLocaleDateString()}</div>
                      <div className="flex items-center"><Clock className="mr-1 h-4 w-4" />{featuredPost.read_time || "5 min"}</div>
                    </div>
                    <Button asChild><Link to={`/blog/${featuredPost.slug}`}>Read Full Article <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          </section>
        )}

        <section className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button key={category} variant={activeCategory === category ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(category)}>{category}</Button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">{activeCategory === "All" ? "Latest Articles" : `${activeCategory} Articles`}</h2>
          {regularPosts.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No articles in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative flex h-44 items-center justify-center overflow-hidden bg-muted">
                    <span className="text-4xl">📄</span>
                    <Badge className="absolute left-3 top-3">{post.category}</Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-base transition-colors group-hover:text-primary">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.author_name}</span>
                      <span>{post.read_time || "5 min"}</span>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="w-full">
                      <Link to={`/blog/${post.slug}`}>Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Blog;
