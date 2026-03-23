import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Download, FileText, Shield, Building, Users, DollarSign, Bookmark, Filter, Loader2, Home, ChevronRight, FolderOpen, PlusCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const categoryIcons: Record<string, any> = {
  legal: Shield, business: Building, financial: DollarSign, hr: Users, contracts: FileText,
};

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDesc, setRequestDesc] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const { user } = useAuth() as any;
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocs = async () => {
      const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
      if (!error && data) setDocuments(data);
      setLoading(false);
    };
    fetchDocs();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All Documents" },
    { id: "legal", name: "Legal & Compliance", icon: Shield },
    { id: "business", name: "Business Registration", icon: Building },
    { id: "financial", name: "Financial & Tax", icon: DollarSign },
    { id: "hr", name: "HR & Employment", icon: Users },
    { id: "contracts", name: "Contracts & Agreements", icon: FileText },
  ];

  const handleDownload = async (doc: any) => {
    if (doc.is_premium && !user) {
      toast({ title: "Premium Document", description: "Please log in and upgrade to access premium documents.", variant: "destructive" });
      return;
    }
    if (doc.file_url) {
      window.open(doc.file_url, "_blank");
    } else {
      toast({ title: "Coming Soon", description: "This document will be available for download shortly." });
    }
    // Increment download count
    await supabase.from("documents").update({ download_count: (doc.download_count || 0) + 1 }).eq("id", doc.id);
  };

  const handleSave = async (doc: any) => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to save documents.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("user_documents").insert({
      user_id: user.id,
      document_id: doc.id,
      title: doc.title,
    });
    if (error) {
      toast({ title: "Error", description: "Failed to save document", variant: "destructive" });
    } else {
      toast({ title: "Saved!", description: `${doc.title} saved to your library.` });
    }
  };

  const handleRequestDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to request documents.", variant: "destructive" });
      return;
    }
    setIsRequesting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: user.user_metadata?.full_name || "User",
        email: user.email,
        subject: `Document Request: ${requestTitle}`,
        message: requestDesc,
        category: "document_request"
      });
      if (error) throw error;
      toast({ title: "Request Sent", description: "We'll try to add this document soon." });
      setIsRequestOpen(false);
      setRequestTitle("");
      setRequestDesc("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary flex items-center"><Home className="h-4 w-4 mr-1" />Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/resources/learn" className="hover:text-primary">Resources</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground font-medium">Documents</span>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">Document Library</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access legal templates, business forms, and compliance documents.
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" /> Request a Document</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request a Document</DialogTitle>
                <DialogDescription>Can't find what you're looking for? Let us know.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRequestDocument} className="space-y-4 mt-4">
                <div className="space-y-2"><Label>Document Name/Type</Label><Input placeholder="e.g. Non-Disclosure Agreement" value={requestTitle} onChange={e => setRequestTitle(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Details (Optional)</Label><Textarea placeholder="Specific clauses or requirements..." value={requestDesc} onChange={e => setRequestDesc(e.target.value)} /></div>
                <Button type="submit" className="w-full" disabled={isRequesting}>{isRequesting ? "Sending..." : "Submit Request"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-8 border">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input placeholder="Search documents..." className="pl-10 text-lg h-12" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select className="px-4 py-2 border rounded-md bg-background text-foreground border-input" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {categories.slice(1).map((cat) => {
            const Icon = cat.icon!;
            return (
              <Card key={cat.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedCategory === cat.id ? "ring-2 ring-primary bg-primary/5" : ""}`} onClick={() => setSelectedCategory(cat.id)}>
                <CardContent className="p-4 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-medium text-sm text-foreground">{cat.name}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No documents found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight mb-2">{doc.title}</CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={doc.is_premium ? "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent" : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent"}>{doc.is_premium ? "Premium" : "Free"}</Badge>
                        <Badge className="text-foreground">{doc.category}</Badge>
                      </div>
                    </div>
                    <Button className="h-9 px-3 hover:bg-accent hover:text-accent-foreground" onClick={() => handleSave(doc)}><Bookmark className="h-4 w-4" /></Button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{doc.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{(doc.download_count || 0).toLocaleString()} downloads</span>
                    {doc.tags?.length > 0 && <span className="text-xs">{doc.tags.slice(0, 2).join(", ")}</span>}
                  </div>
                  <Button className="w-full h-9 px-3" onClick={() => handleDownload(doc)}>
                    <Download className="h-4 w-4 mr-2" /> {t("Download")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
