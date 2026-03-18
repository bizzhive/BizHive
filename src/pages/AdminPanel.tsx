import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BookOpen, FileText, Mail, MessageSquare, RefreshCw, Save, Search, Shield, Users } from "lucide-react";
import BeeIcon from "@/components/BeeIcon";
import AdminBlogsTab from "@/components/admin/AdminBlogsTab";
import AdminCommunityTab from "@/components/admin/AdminCommunityTab";
import AdminDocumentsTab from "@/components/admin/AdminDocumentsTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [communityGroups, setCommunityGroups] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [communityMessages, setCommunityMessages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [bans, setBans] = useState<any[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);

  const fetchData = async () => {
    const [
      contactsRes,
      subscribersRes,
      settingsRes,
      blogsRes,
      groupsRes,
      postsRes,
      messagesRes,
      documentsRes,
      profilesRes,
      rolesRes,
      bansRes,
    ] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
      supabase.from("admin_settings").select("value").eq("key", "ai_system_prompt").maybeSingle(),
      supabase.from("blog_posts").select("*").order("updated_at", { ascending: false }),
      supabase.from("community_groups").select("*").order("created_at", { ascending: false }),
      supabase.from("community_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("community_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("documents").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*").order("role", { ascending: true }),
      supabase.from("user_bans").select("*").order("banned_at", { ascending: false }),
    ]);

    setContacts(contactsRes.data ?? []);
    setSubscribers(subscribersRes.data ?? []);
    setBlogs(blogsRes.data ?? []);
    setCommunityGroups(groupsRes.data ?? []);
    setCommunityPosts(postsRes.data ?? []);
    setCommunityMessages(messagesRes.data ?? []);
    setDocuments(documentsRes.data ?? []);
    setProfiles(profilesRes.data ?? []);
    setRoles(rolesRes.data ?? []);
    setBans(bansRes.data ?? []);
    setAiPrompt(settingsRes.data?.value ?? "");
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      const { data } = await supabase.rpc('has_role', { role: 'admin' });
      if (!data) {
        navigate("/dashboard");
        return;
      }
      setIsAdmin(true);
      await fetchData();
      setLoading(false);
    };

    checkAdmin();
  }, [navigate, user]);

  const handleSavePrompt = async () => {
    setSavingPrompt(true);
    const { error } = await supabase.from("admin_settings").upsert({
      key: "ai_system_prompt",
      value: aiPrompt,
      updated_at: new Date().toISOString(),
    });

    setSavingPrompt(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Saved", description: "AI system prompt updated." });
  };

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filteredContacts = contacts.filter((contact) =>
    contactSearch === "" ||
    contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.subject.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage content, community, files, users, and Bee.</p>
            </div>
          </div>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
            <TabsTrigger value="contacts" className="gap-2"><MessageSquare className="h-4 w-4" />Messages</TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-2"><Mail className="h-4 w-4" />Subscribers</TabsTrigger>
            <TabsTrigger value="blogs" className="gap-2"><BookOpen className="h-4 w-4" />Blogs</TabsTrigger>
            <TabsTrigger value="community" className="gap-2"><Users className="h-4 w-4" />Community</TabsTrigger>
            <TabsTrigger value="documents" className="gap-2"><FileText className="h-4 w-4" />Documents</TabsTrigger>
            <TabsTrigger value="users" className="gap-2"><Shield className="h-4 w-4" />Users</TabsTrigger>
            <TabsTrigger value="ai" className="gap-2"><BeeIcon className="h-4 w-4" />AI Training</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle>Contact submissions ({contacts.length})</CardTitle>
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." value={contactSearch} onChange={(e) => setContactSearch(e.target.value)} className="pl-9" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-[620px] overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell><Badge variant="secondary">{contact.category}</Badge></TableCell>
                          <TableCell>{contact.subject}</TableCell>
                          <TableCell className="max-w-[360px] truncate text-sm">{contact.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers">
            <Card>
              <CardHeader><CardTitle>Newsletter subscribers ({subscribers.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="max-h-[620px] overflow-auto rounded-md border">
                  <Table>
                    <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Email</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {subscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell className="text-xs text-muted-foreground">{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{subscriber.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs"><AdminBlogsTab blogs={blogs} onRefresh={fetchData} currentUserId={user?.id} /></TabsContent>
          <TabsContent value="community"><AdminCommunityTab groups={communityGroups} posts={communityPosts} messages={communityMessages} onRefresh={fetchData} currentUserId={user?.id} /></TabsContent>
          <TabsContent value="documents"><AdminDocumentsTab documents={documents} onRefresh={fetchData} /></TabsContent>
          <TabsContent value="users"><AdminUsersTab profiles={profiles} roles={roles} bans={bans} onRefresh={fetchData} currentUserId={user?.id} /></TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BeeIcon className="h-5 w-5" />Train Bee AI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Customize the system prompt Bee uses to answer users.</p>
                <Textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="min-h-[320px] font-mono text-sm" placeholder="Enter custom system prompt for Bee AI..." />
                <Button onClick={handleSavePrompt} disabled={savingPrompt}>
                  <Save className="h-4 w-4" />
                  {savingPrompt ? "Saving..." : "Save Prompt"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;