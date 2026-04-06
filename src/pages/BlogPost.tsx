import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { getBlogPostBySlug } from "@/services/site-content";

const BlogPost = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [post, setPost] = useState<Awaited<ReturnType<typeof getBlogPostBySlug>> | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    void getBlogPostBySlug(id).then((result) => {
      setPost(result);
      if (result) {
        document.title = result.metaTitle;
      }
    });
  }, [id]);

  if (!post) {
    return (
      <div className="page-shell">
        <SiteContainer>
          <Surface>{t("blog.articleNotFound")}</Surface>
        </SiteContainer>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow={post.category}
          title={post.title}
          description={`${post.authorName} · ${post.readTime}`}
          actions={
            <Button asChild variant="ghost" className="h-12 rounded-2xl border border-border/80 px-5">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("blog.backToBlog")}
              </Link>
            </Button>
          }
        />
        <Surface className="max-w-4xl whitespace-pre-wrap text-sm leading-8 text-foreground">
          {post.content}
        </Surface>
      </SiteContainer>
    </div>
  );
};

export default BlogPost;
