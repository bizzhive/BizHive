import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const bySlug = await supabase.from("blog_posts").select("*").eq("slug", id).eq("published", true).maybeSingle();
      if (bySlug.data) {
        setPost(bySlug.data);
        setLoading(false);
        return;
      }

      const byId = await supabase.from("blog_posts").select("*").eq("id", id).eq("published", true).maybeSingle();
      setPost(byId.data ?? null);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading article...</div>;
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">Article Not Found</h1>
          <Button asChild><Link to="/blog">Back to Blog</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" />Back to Blog</Link>
        </Button>

        <Badge className="mb-4">{post.category}</Badge>
        <h1 className="mb-4 text-4xl font-bold text-foreground">{post.title}</h1>

        <div className="mb-8 flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center"><User className="mr-1 h-4 w-4" />{post.author_name}</div>
          <div className="flex items-center"><Calendar className="mr-1 h-4 w-4" />{new Date(post.created_at).toLocaleDateString()}</div>
          <div className="flex items-center"><Clock className="mr-1 h-4 w-4" />{post.read_time || "5 min"}</div>
        </div>

        <div className="prose max-w-none dark:prose-invert">
          {String(post.content || "").split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed text-muted-foreground">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
