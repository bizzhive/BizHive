import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, BookOpen, FileText, Lock, Mail, MessageSquare, RefreshCw, Save, Search, Shield, Users } from "lucide-react";
import BeeIcon from "@/components/BeeIcon";
import AdminBlogsTab from "@/components/admin/AdminBlogsTab";
import AdminCommunityTab from "@/components/admin/AdminCommunityTab";
import AdminDocumentsTab from "@/components/admin/AdminDocumentsTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminPanel = () => {
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);

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
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  // Hardcoded allowed emails for demo security. Use RLS in production.
  const ALLOWED_ADMINS = ["admin@bizhive.com", "bizzhive.support@gmail.com"];
  const ADMIN_PASSWORD = "admin#Tushar07"; // Restored for manual access

  useEffect(() => {
    const getSupabaseUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id);
      if (data.user?.email && ALLOWED_ADMINS.includes(data.user.email)) {
        setAuthenticated(true);
      }
    };
    getSupabaseUser();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [
      contactsRes, subscribersRes, settingsRes, blogsRes,
      groupsRes, postsRes, messagesRes, documentsRes,
      profilesRes, rolesRes, bansRes,
    ] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
      supabase.from("admin_settings").select("value").eq("key", "ai_system_prompt").maybeSingle(),
      supabase.from("blog_posts").select("*").order("updated_at", { ascending: false }),
      supabase.from("community_groups").select("*").order("created_at", { ascending: false }),
      supabase.from("community_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("community_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("documents").select("*").order("created_at", { ascending: false }),
      (supabase.from("profiles").select('user_id, full_name, users(email)') as any),
      supabase.from("user_roles").select("*"),
      supabase.from("user_bans").select("*"),
    ]);

    setContacts(contactsRes.data ?? []);
    setSubscribers(subscribersRes.data ?? []);
    setBlogs(blogsRes.data ?? []);
    setCommunityGroups(groupsRes.data ?? []);
    setCommunityPosts(postsRes.data ?? []);
    setCommunityMessages(messagesRes.data ?? []);
    setDocuments(documentsRes.data ?? []);
    if (profilesRes.data) {
        const formattedProfiles = (profilesRes.data as any[]).map(p => ({ ...p, email: p.users?.email, users: undefined }));
        setProfiles(formattedProfiles);
    }
    setRoles(rolesRes.data ?? []);
    setBans(bansRes.data ?? []);
    setAiPrompt(settingsRes.data?.value ?? "");
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      fetchData();
      const channel = supabase
        .channel('admin-realtime-all')
        .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
            console.log('Realtime change detected:', payload);
            toast({ title: `Content changed in ${payload.table}`, description: "Refreshing all data..." });
            fetchData();
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [authenticated]);

  // Analytics Data Preparation
  const contactStats = contacts.reduce((acc: any, curr) => {
    const date = new Date(curr.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  
  const contactChartData = Object.keys(contactStats).map(date => ({
    date,
    submissions: contactStats[date]
  })).slice(-7); // Last 7 days

  const postStats = communityPosts.reduce((acc: any, curr) => {
    const date = new Date(curr.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const activityChartData = Object.keys(postStats).map(date => ({
    date,
    posts: postStats[date]
  })).slice(-7);


  const handleSavePrompt = async () => {
    setSavingPrompt(true);
    const { error } = await supabase.from("admin_settings").upsert({ key: "ai_system_prompt", value: aiPrompt });
    setSavingPrompt(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "AI system prompt updated." });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("bizhive_admin", "true");
      setAuthenticated(true);
      toast({ title: "Welcome", description: "Admin access granted." });
    } else {
      toast({ title: "Access Denied", description: "Incorrect password.", variant: "destructive" });
    }
    setPasswordInput("");
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center"><div className="mx-auto mb-2"><Shield className="h-10 w-10 text-primary" /></div><CardTitle>Admin Access</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative"><Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="Enter admin password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="pl-10" required autoFocus/></div>
              <Button type="submit" className="w-full">Access Panel</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredContacts = contacts.filter(c => 
    contactSearch === "" || 
    c.name?.toLowerCase().includes(contactSearch.toLowerCase()) || 
    c.email?.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div><h1 className="text-3xl font-bold text-foreground">Admin Panel</h1><p className="text-sm text-muted-foreground">Manage content, users, and system settings.</p></div>
          </div>
          <div className="flex gap-2">
            {/* @ts-ignore */}
            <Button variant="outline" onClick={fetchData} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</Button>
            {/* @ts-ignore */}
            <Button variant="ghost" onClick={() => { sessionStorage.removeItem("bizhive_admin"); setAuthenticated(false); }}>Logout</Button>
          </div>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
            <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="h-4 w-4" />Analytics</TabsTrigger>
            <TabsTrigger value="contacts" className="gap-2"><MessageSquare className="h-4 w-4" />Messages</TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-2"><Mail className="h-4 w-4" />Subscribers</TabsTrigger>
            <TabsTrigger value="blogs" className="gap-2"><BookOpen className="h-4 w-4" />Blogs</TabsTrigger>
            <TabsTrigger value="community" className="gap-2"><Users className="h-4 w-4" />Community</TabsTrigger>
            <TabsTrigger value="documents" className="gap-2"><FileText className="h-4 w-4" />Documents</TabsTrigger>
            <TabsTrigger value="users" className="gap-2"><Shield className="h-4 w-4" />Users</TabsTrigger>
            <TabsTrigger value="ai" className="gap-2"><BeeIcon className="h-4 w-4" />AI Training</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Contact Submissions (Last 7 Days)</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contactChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="submissions" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Community Activity (Last 7 Days)</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="posts" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              {/* @ts-ignore */}
              <CardHeader><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><CardTitle>Contact submissions ({contacts.length})</CardTitle><div className="relative w-full md:w-72"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search messages..." value={contactSearch} onChange={(e) => setContactSearch(e.target.value)} className="pl-9" /></div></div></CardHeader>
              <CardContent>
                <div className="max-h-[620px] overflow-auto rounded-md border">
                  <Table>
                    <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Category</TableHead><TableHead>Subject</TableHead><TableHead>Message</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredContacts.map(c => (
                        <TableRow key={c.id}>
                          <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell>{c.email}</TableCell>
                          <TableCell><Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent">{c.category}</Badge></TableCell>
                          <TableCell>{c.subject}</TableCell>
                          <TableCell className="max-w-[360px] truncate text-sm">{c.message}</TableCell>
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
              <CardContent><div className="max-h-[620px] overflow-auto rounded-md border"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Email</TableHead></TableRow></TableHeader><TableBody>{subscribers.map(s => <TableRow key={s.id}><TableCell className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell><TableCell>{s.email}</TableCell></TableRow>)}</TableBody></Table></div></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs"><AdminBlogsTab blogs={blogs} onRefresh={fetchData} currentUserId={currentUserId} /></TabsContent>
          <TabsContent value="community"><AdminCommunityTab groups={communityGroups} posts={communityPosts} messages={communityMessages} onRefresh={fetchData} currentUserId={currentUserId} /></TabsContent>
          <TabsContent value="documents"><AdminDocumentsTab documents={documents} onRefresh={fetchData} /></TabsContent>
          <TabsContent value="users"><AdminUsersTab profiles={profiles} roles={roles} bans={bans} onRefresh={fetchData} currentUserId={currentUserId} /></TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BeeIcon className="h-5 w-5" />Train Bee AI</CardTitle></CardHeader>
              <CardContent className="space-y-4"><p className="text-sm text-muted-foreground">Customize the system prompt Bee uses to answer users.</p><Textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="min-h-[320px] font-mono text-sm" placeholder="Enter custom system prompt for Bee AI..." /><Button onClick={handleSavePrompt} disabled={savingPrompt}><Save className="h-4 w-4" />{savingPrompt ? "Saving..." : "Save Prompt"}</Button></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
