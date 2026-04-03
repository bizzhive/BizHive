import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  ChevronRight,
  Download,
  FileText,
  Filter,
  FolderOpen,
  Home,
  Loader2,
  PlusCircle,
  Search,
  Send,
  Shield,
  Building,
  DollarSign,
  Users,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { supabase } from "@/services/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const categoryIcons: Record<string, any> = {
  legal: Shield,
  business: Building,
  financial: DollarSign,
  hr: Users,
  contracts: FileText,
};

const categories = [
  { id: "all", name: "All Documents" },
  { id: "legal", name: "Legal & Compliance", icon: Shield },
  { id: "business", name: "Business Registration", icon: Building },
  { id: "financial", name: "Financial & Tax", icon: DollarSign },
  { id: "hr", name: "HR & Employment", icon: Users },
  { id: "contracts", name: "Contracts & Agreements", icon: FileText },
];

const getTemplateSlug = (tags: string[] | null | undefined) =>
  tags?.find((tag) => tag.startsWith("template:"))?.replace("template:", "") || null;

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [documents, setDocuments] = useState<any[]>([]);
  const [savedDocumentIds, setSavedDocumentIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDesc, setRequestDesc] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchDocs = async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDocuments(data);
      }

      setLoading(false);
    };

    void fetchDocs();
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedDocumentIds(new Set());
      return;
    }

    const fetchSavedDocuments = async () => {
      const { data } = await supabase
        .from("user_documents")
        .select("document_id")
        .eq("user_id", user.id);

      setSavedDocumentIds(new Set((data ?? []).map((entry) => entry.document_id).filter(Boolean)));
    };

    void fetchSavedDocuments();
  }, [user]);

  const filteredDocuments = useMemo(
    () =>
      documents.filter((doc) => {
        const matchesSearch =
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (doc.description || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [documents, searchQuery, selectedCategory]
  );

  const handleDownload = async (doc: any) => {
    if (doc.is_premium && !user) {
      toast({
        title: t("Premium Document"),
        description: t("Please log in and upgrade to access premium documents."),
        variant: "destructive",
      });
      return;
    }

    if (doc.file_url) {
      window.open(doc.file_url, "_blank");
    } else {
      toast({
        title: t("Coming Soon"),
        description: t("This document will be available for download shortly."),
      });
    }

    await supabase
      .from("documents")
      .update({ download_count: (doc.download_count || 0) + 1 })
      .eq("id", doc.id);
  };

  const handleSave = async (doc: any) => {
    if (!user) {
      toast({
        title: t("Login Required"),
        description: t("Please log in to save documents."),
        variant: "destructive",
      });
      return;
    }

    if (savedDocumentIds.has(doc.id)) {
      toast({ title: t("Already saved"), description: t("This document is already in your saved library.") });
      return;
    }

    const { error } = await supabase.from("user_documents").insert({
      user_id: user.id,
      document_id: doc.id,
      title: doc.title,
    });

    if (error) {
      toast({ title: t("Error"), description: t("Failed to save document"), variant: "destructive" });
    } else {
      setSavedDocumentIds((current) => new Set([...current, doc.id]));
      toast({ title: t("Saved!"), description: `${doc.title} ${t("saved to your library.")}` });
    }
  };

  const handleRequestDocument = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      toast({
        title: t("Login Required"),
        description: t("Please log in to request documents."),
        variant: "destructive",
      });
      return;
    }

    setIsRequesting(true);

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: user.user_metadata?.full_name || "User",
        email: user.email,
        subject: `Document Request: ${requestTitle}`,
        message: requestDesc,
        category: "document_request",
      });

      if (error) {
        throw error;
      }

      toast({ title: t("Request Sent"), description: t("We'll try to add this document soon.") });
      setIsRequestOpen(false);
      setRequestTitle("");
      setRequestDesc("");
    } catch (error: any) {
      toast({ title: t("Error"), description: error.message, variant: "destructive" });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="page-shell">
      <SiteContainer className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
            <Home className="h-4 w-4" />
            {t("Home")}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/resources/learn" className="hover:text-foreground">
            {t("Resources")}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{t("Documents")}</span>
        </div>

        <PageHeader
          eyebrow={t("Document library")}
          title={t("Structured templates, cleaner discovery, faster action")}
          description={t(
            "The document area now follows the same layout system as the rest of the product: one clear hero, one search pattern, one card language, and a stronger path into the editor."
          )}
          actions={
            <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <PlusCircle className="h-4 w-4" />
                  {t("Request a Document")}
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[28px] border-border/70 bg-background/96">
                <DialogHeader>
                  <DialogTitle>{t("Request a Document")}</DialogTitle>
                  <DialogDescription>{t("Can't find what you're looking for? Let us know.")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRequestDocument} className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>{t("Document Name/Type")}</Label>
                    <Input
                      placeholder={t("e.g. Non-Disclosure Agreement")}
                      value={requestTitle}
                      onChange={(event) => setRequestTitle(event.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("Details (Optional)")}</Label>
                    <Textarea
                      placeholder={t("Specific clauses or requirements...")}
                      value={requestDesc}
                      onChange={(event) => setRequestDesc(event.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isRequesting}>
                    {isRequesting ? t("Sending...") : t("Submit Request")}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <Surface className="space-y-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <Filter className="h-3.5 w-3.5" />
                {t("Filter documents")}
              </div>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
                {t("Find the right template faster")}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {t("Search by title, narrow by category, then jump directly into download or editing workflows.")}
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("Search documents...")}
                className="h-12 rounded-2xl border-border/70 bg-muted/35 pl-11"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-3 rounded-[22px] border px-4 py-3 text-left transition-colors ${
                      selectedCategory === category.id
                        ? "border-primary/30 bg-primary/8 text-foreground"
                        : "border-border/70 bg-background/72 text-foreground hover:bg-accent"
                    }`}
                  >
                    {Icon ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <FolderOpen className="h-4 w-4" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{t(category.name)}</div>
                      <div className="text-xs text-muted-foreground">
                        {category.id === "all" ? `${documents.length} ${t("documents")}` : t("Category view")}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Surface>

          <Surface className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center rounded-full border border-border/70 bg-muted/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {t("Results")}
                </div>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
                  {t("Document library")}
                </h2>
              </div>
              <Badge className="w-fit rounded-full border-none bg-primary/10 px-3 py-1 text-primary">
                {filteredDocuments.length} {t("results")}
              </Badge>
            </div>

            {loading ? (
              <div className="flex min-h-[340px] items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <EmptyState
                icon={<FolderOpen className="h-6 w-6" />}
                title={t("No documents found")}
                description={t("Try adjusting your search or category filter.")}
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredDocuments.map((doc) => {
                  const Icon = categoryIcons[doc.category] ?? FileText;
                  const templateSlug = getTemplateSlug(doc.tags);
                  const opensOfficialSource = doc.tags?.includes("official-source");

                  return (
                    <Card key={doc.id} className="h-full border-border/70 bg-card/88">
                      <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <CardTitle className="text-xl">{doc.title}</CardTitle>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <Badge className={doc.is_premium ? "border-none bg-primary text-primary-foreground" : "border-none bg-secondary text-secondary-foreground"}>
                                  {doc.is_premium ? t("Premium") : t("Free")}
                                </Badge>
                                <Badge variant="secondary">{t(doc.category)}</Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant={savedDocumentIds.has(doc.id) ? "default" : "outline"}
                            size="icon"
                            className="h-10 w-10 rounded-2xl"
                            onClick={() => handleSave(doc)}
                            aria-label={savedDocumentIds.has(doc.id) ? t("Document saved") : t("Save document")}
                          >
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm leading-7 text-muted-foreground">{doc.description}</p>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{(doc.download_count || 0).toLocaleString()} {t("downloads")}</span>
                          {doc.tags?.length > 0 ? (
                            <span className="truncate text-right text-xs">{doc.tags.slice(0, 2).join(", ")}</span>
                          ) : null}
                        </div>

                        <div className="grid gap-2">
                          <Button className="w-full" onClick={() => handleDownload(doc)}>
                            <Download className="h-4 w-4" />
                            {opensOfficialSource ? t("Open Official Source") : t("Download")}
                          </Button>
                          {templateSlug ? (
                            <Button asChild variant="outline" className="w-full">
                              <Link to={`/legal?template=${encodeURIComponent(templateSlug)}`}>
                                <Send className="h-4 w-4" />
                                {t("Edit Worksheet")}
                              </Link>
                            </Button>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </Surface>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Documents;
