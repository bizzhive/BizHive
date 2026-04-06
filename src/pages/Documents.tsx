import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, FolderSearch, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getDocumentLibrary } from "@/services/site-content";
import { supabase } from "@/services/supabase/client";
import { useTranslation } from "react-i18next";

type DocumentRecord = Awaited<ReturnType<typeof getDocumentLibrary>>[number];

const Documents = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [savedDocumentIds, setSavedDocumentIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    void getDocumentLibrary().then(setDocuments);
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedDocumentIds(new Set());
      return;
    }

    void supabase
      .from("user_documents")
      .select("document_id")
      .eq("user_id", user.id)
      .then(({ data }) => setSavedDocumentIds(new Set((data ?? []).map((row) => row.document_id).filter(Boolean))));
  }, [user]);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(documents.map((document) => document.category)))],
    [documents]
  );

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return documents.filter((document) => {
      const matchesCategory = category === "all" || document.category === category;
      const haystack = [document.title, document.description || "", document.category, ...(document.tags || [])]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [category, documents, search]);

  const handleSave = async (document: DocumentRecord) => {
    if (!user) {
      toast({
        title: t("documents.loginRequiredTitle"),
        description: t("documents.loginRequiredBody"),
        variant: "destructive",
      });
      return;
    }

    if (savedDocumentIds.has(document.id)) {
      toast({ title: t("documents.alreadySavedTitle"), description: t("documents.alreadySavedBody") });
      return;
    }

    const { error } = await supabase.from("user_documents").insert({
      user_id: user.id,
      document_id: document.id,
      title: document.title,
    });

    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
      return;
    }

    setSavedDocumentIds((current) => new Set(current).add(document.id));
    toast({ title: t("documents.savedTitle"), description: t("documents.savedBody", { title: document.title }) });
  };

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow={t("documents.eyebrow")}
          title={t("documents.title")}
          description={t("documents.description")}
          actions={
            <Button asChild size="lg" className="h-12 rounded-2xl px-5">
              <Link to="/legal">{t("documents.requestAction")}</Link>
            </Button>
          }
        />

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <Surface className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("documents.searchPlaceholder")}
                className="h-12 rounded-2xl pl-11"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold ${
                    category === item ? "bg-foreground text-background" : "border border-border/80 bg-muted/35 text-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="panel-muted p-4 text-sm leading-7 text-muted-foreground">
              {t("documents.libraryNote")}
            </div>
          </Surface>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredDocuments.length ? (
              filteredDocuments.map((document) => (
                <Surface key={document.id} className="flex h-full flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{document.category}</div>
                      {document.is_premium ? (
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                          Premium
                        </span>
                      ) : null}
                    </div>
                    <div className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
                      {document.title}
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">{document.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {document.file_url ? (
                      <Button asChild className="rounded-2xl">
                        <a href={document.file_url} target="_blank" rel="noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          {t("documents.openFile")}
                        </a>
                      </Button>
                    ) : (
                      <Button variant="ghost" className="rounded-2xl border border-border/80" disabled>
                        {t("documents.linkSoon")}
                      </Button>
                    )}
                    <Button variant="ghost" className="rounded-2xl border border-border/80" onClick={() => handleSave(document)}>
                      <Star className="mr-2 h-4 w-4" />
                      {t("documents.saveFile")}
                    </Button>
                  </div>
                </Surface>
              ))
            ) : (
              <EmptyState
                icon={<FolderSearch className="h-5 w-5" />}
                title={t("documents.emptyTitle")}
                description={t("documents.emptyBody")}
              />
            )}
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Documents;
