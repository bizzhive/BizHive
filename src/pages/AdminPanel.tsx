import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/services/supabase/client";
import AdminBlogsTab from "@/components/admin/AdminBlogsTab";
import AdminCommunityTab from "@/components/admin/AdminCommunityTab";
import AdminDocumentsTab from "@/components/admin/AdminDocumentsTab";

const AdminPanel = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [communityGroups, setCommunityGroups] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [communityMessages, setCommunityMessages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [legalTemplates, setLegalTemplates] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    const [blogsRes, groupsRes, postsRes, messagesRes, documentsRes, templatesRes] = await Promise.all([
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("community_groups").select("*").order("created_at", { ascending: true }),
      supabase.from("community_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("community_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("documents").select("*").order("created_at", { ascending: false }),
      supabase.from("legal_document_templates").select("*").order("created_at", { ascending: true }),
    ]);

    setBlogs(blogsRes.data ?? []);
    setCommunityGroups(groupsRes.data ?? []);
    setCommunityPosts(postsRes.data ?? []);
    setCommunityMessages(messagesRes.data ?? []);
    setDocuments(documentsRes.data ?? []);
    setLegalTemplates(templatesRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader eyebrow={t("admin.eyebrow")} title={t("admin.title")} description={t("admin.description")} />

        <section className="grid gap-4 md:grid-cols-4">
          <Surface>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Blogs</div>
            <div className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">{blogs.length}</div>
          </Surface>
          <Surface>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Documents</div>
            <div className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">{documents.length}</div>
          </Surface>
          <Surface>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Legal templates</div>
            <div className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">{legalTemplates.length}</div>
          </Surface>
          <Surface>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Community posts</div>
            <div className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">{communityPosts.length}</div>
          </Surface>
        </section>

        <Tabs defaultValue="blogs" className="space-y-4">
          <TabsList className="h-auto rounded-2xl border border-border/80 bg-muted/40 p-1">
            <TabsTrigger value="blogs" className="rounded-2xl">Blogs</TabsTrigger>
            <TabsTrigger value="documents" className="rounded-2xl">Documents</TabsTrigger>
            <TabsTrigger value="community" className="rounded-2xl">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="blogs">
            {loading ? (
              <Surface>Loading admin content…</Surface>
            ) : (
              <AdminBlogsTab blogs={blogs} currentUserId={user?.id} onRefresh={loadData} />
            )}
          </TabsContent>
          <TabsContent value="documents">
            {loading ? (
              <Surface>Loading admin content…</Surface>
            ) : (
              <AdminDocumentsTab documents={documents} legalTemplates={legalTemplates} onRefresh={loadData} />
            )}
          </TabsContent>
          <TabsContent value="community">
            {loading ? (
              <Surface>Loading admin content…</Surface>
            ) : (
              <AdminCommunityTab
                groups={communityGroups}
                posts={communityPosts}
                messages={communityMessages}
                currentUserId={user?.id}
                canModerate={Boolean(user)}
                onRefresh={loadData}
              />
            )}
          </TabsContent>
        </Tabs>
      </SiteContainer>
    </div>
  );
};

export default AdminPanel;
