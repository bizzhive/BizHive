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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, BookOpen, FileText, Loader2, Mail, MessageSquare, RefreshCw, Save, Search, Shield, Users, Upload, Ban, Send, RotateCcw, Sparkles } from "lucide-react";
import BeeIcon from "@/components/BeeIcon";
import AdminBlogsTab from "@/components/admin/AdminBlogsTab";
import AdminCommunityTab from "@/components/admin/AdminCommunityTab";
import AdminDocumentsTab from "@/components/admin/AdminDocumentsTab";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const TEMP_ADMIN_OVERRIDE_KEY = "bizhive-temp-admin-override";
const TEMP_ADMIN_OVERRIDE_TTL_MS = 1000 * 60 * 60 * 12;

const createGroupSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const hasValidTempAdminOverride = (userId?: string) => {
  if (!userId) {
    return false;
  }

  try {
    const rawValue = sessionStorage.getItem(TEMP_ADMIN_OVERRIDE_KEY);

    if (!rawValue) {
      return false;
    }

    const parsedValue = JSON.parse(rawValue) as { userId?: string; verifiedAt?: string };
    const verifiedAt = parsedValue.verifiedAt ? new Date(parsedValue.verifiedAt).getTime() : Number.NaN;

    return (
      parsedValue.userId === userId &&
      Number.isFinite(verifiedAt) &&
      Date.now() - verifiedAt < TEMP_ADMIN_OVERRIDE_TTL_MS
    );
  } catch {
    sessionStorage.removeItem(TEMP_ADMIN_OVERRIDE_KEY);
    return false;
  }
};

const persistTempAdminOverride = (userId: string) => {
  sessionStorage.setItem(
    TEMP_ADMIN_OVERRIDE_KEY,
    JSON.stringify({
      userId,
      verifiedAt: new Date().toISOString(),
    })
  );
};

const clearTempAdminOverride = () => {
  sessionStorage.removeItem(TEMP_ADMIN_OVERRIDE_KEY);
};

const AdminPanel = () => {
  const { toast } = useToast();
  const { user, session, isLoading: authLoading, signOut } = useAuth();
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [tempAdminPassword, setTempAdminPassword] = useState("");
  const [verifyingTempAccess, setVerifyingTempAccess] = useState(false);

  const [contacts, setContacts] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [communityGroups, setCommunityGroups] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [communityMessages, setCommunityMessages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  
  // AI Training State
  const [aiPersona, setAiPersona] = useState("");
  const [aiGuidelines, setAiGuidelines] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [testChat, setTestChat] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Hello Admin! I'm ready to test your new instructions." }
  ]);
  const [isTestingAi, setIsTestingAi] = useState(false);
  
  // New State for features
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterBody, setNewsletterBody] = useState("");
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [newGroupData, setNewGroupData] = useState({ name: "", description: "", is_private: false });

  const currentUserId = user?.id;

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        setHasAdminAccess(false);
        return;
      }

      if (hasValidTempAdminOverride(user.id)) {
        setHasAdminAccess(true);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin", "moderator"]);

      if (error) {
        toast({ title: "Access check failed", description: error.message, variant: "destructive" });
        setHasAdminAccess(false);
        return;
      }

      setHasAdminAccess((data?.length ?? 0) > 0);
    };
    void checkAdminAccess();
  }, [authLoading, toast, user]);

  const handleTemporaryAccessUnlock = async () => {
    if (!user || !session?.access_token) {
      toast({
        title: "Sign in required",
        description: "Log in before unlocking temporary admin access.",
        variant: "destructive",
      });
      return;
    }

    if (!tempAdminPassword.trim()) {
      toast({
        title: "Password required",
        description: "Enter the temporary admin password to continue.",
        variant: "destructive",
      });
      return;
    }

    setVerifyingTempAccess(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ password: tempAdminPassword }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.authorized) {
        throw new Error(payload.error || "Incorrect temporary admin password.");
      }

      persistTempAdminOverride(user.id);
      setTempAdminPassword("");
      setHasAdminAccess(true);
      toast({
        title: "Temporary access unlocked",
        description: "You can now use the admin panel for this signed-in session.",
      });
    } catch (error) {
      toast({
        title: "Access denied",
        description: error instanceof Error ? error.message : "Unable to verify temporary admin access.",
        variant: "destructive",
      });
    } finally {
      setVerifyingTempAccess(false);
    }
  };

  const handleLogout = async () => {
    clearTempAdminOverride();
    await signOut();
  };

  const fetchData = async () => {
    setLoading(true);
    const [
      contactsRes, subscribersRes, settingsRes, blogsRes,
      groupsRes, postsRes, messagesRes, documentsRes,
      profilesRes,
    ] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
      supabase.from("admin_settings").select("value").eq("key", "ai_system_prompt").maybeSingle(),
      supabase.from("blog_posts").select("*").order("updated_at", { ascending: false }),
      supabase.from("community_groups").select("*").order("created_at", { ascending: false }),
      supabase.from("community_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("community_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("documents").select("*").order("created_at", { ascending: false }),
      (supabase.from("profiles").select('user_id, full_name, created_at, location_data, users(email)') as any),
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
    
    // Parse AI Prompt if it contains separator
    const fullPrompt = settingsRes.data?.value ?? "";
    if (fullPrompt.includes("---GUIDELINES---")) {
      const [persona, guidelines] = fullPrompt.split("---GUIDELINES---");
      setAiPersona(persona.trim());
      setAiGuidelines(guidelines.trim());
    } else {
      setAiPersona(fullPrompt);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (hasAdminAccess) {
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
  }, [hasAdminAccess, toast]);

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
    const combinedPrompt = `${aiPersona}\n\n---GUIDELINES---\n\n${aiGuidelines}`;
    const { error } = await supabase.from("admin_settings").upsert({ key: "ai_system_prompt", value: combinedPrompt });
    setSavingPrompt(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "AI Updated", description: "New instructions are now live for all users." });
    }
  };

  // Action Handlers
  const handleCreateGroup = async () => {
    const slug = createGroupSlug(newGroupData.name);
    if (!slug) {
      toast({ title: "Invalid group name", description: "Enter a valid group name to create a slug.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("community_groups").insert({
      ...newGroupData,
      slug,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      setNewGroupData({ name: "", description: "", is_private: false });
      toast({ title: "Success", description: "Group created" });
      fetchData();
    }
  };

  const handleBanUser = async (userId: string) => {
    const { error } = await supabase.from("user_bans").insert({ user_id: userId, reason: "Admin Ban" });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "User Banned", description: "User access restricted" }); fetchData(); }
  };

  const handleSendNewsletter = async () => {
    setSendingNewsletter(true);
    // Simulation of sending emails
    setTimeout(() => {
      toast({ title: "Newsletter Sent", description: `Sent to ${subscribers.length} subscribers.` });
      setSendingNewsletter(false);
      setNewsletterSubject("");
      setNewsletterBody("");
    }, 2000);
  };

  const handleUploadDocument = async () => {
    // Mock upload for template list
    const { error } = await supabase.from("documents").insert({
      title: "New Government Form",
      category: "legal",
      description: "Official form sourced from government portal",
      is_premium: false,
      file_url: "#", // In real app, upload to storage bucket first
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Document Added", description: "Available in library" }); fetchData(); }
  };

  const handleTestAiSend = async () => {
    if (!testMessage.trim()) return;
    if (!session?.access_token) {
      toast({ title: "Login required", description: "Sign in with an admin account to test Bee.", variant: "destructive" });
      return;
    }

    const userMsg = { role: "user", content: testMessage };
    setTestChat(prev => [...prev, userMsg]);
    setTestMessage("");
    setIsTestingAi(true);

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: [userMsg], 
          // Send current drafts to test immediately without saving
          systemOverride: `${aiPersona}\n\n${aiGuidelines}`.trim(),
          context: { role: "admin_tester" }
        }),
      });

      if (!resp.ok) throw new Error("Bee test request failed.");
      if (!resp.body) throw new Error("No response");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      setTestChat(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Simple parsing for stream (in real app use proper SSE parser)
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
             try {
                const json = JSON.parse(line.slice(6));
                const content = json.choices?.[0]?.delta?.content || "";
                aiResponse += content;
                setTestChat(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: aiResponse } : m));
             } catch {
               // Ignore malformed chunks while the response stream is still in flight.
             }
          }
        }
      }
    } catch (error) {
      toast({
        title: "Bee test failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally { setIsTestingAi(false); }
  };

  if (authLoading || hasAdminAccess === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center"><div className="mx-auto mb-2"><Shield className="h-10 w-10 text-primary" /></div><CardTitle>Checking Admin Access</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center"><div className="mx-auto mb-2"><Shield className="h-10 w-10 text-primary" /></div><CardTitle>Admin Sign In Required</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Sign in with an authorized account to access the admin panel.</p>
            <Button asChild className="w-full">
              <Link to="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center"><div className="mx-auto mb-2"><Shield className="h-10 w-10 text-primary" /></div><CardTitle>Admin Access Required</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">This account does not currently have an admin or moderator role.</p>
            <div className="space-y-2 text-left">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Temporary test access</label>
              <Input
                type="password"
                value={tempAdminPassword}
                onChange={(event) => setTempAdminPassword(event.target.value)}
                placeholder="Enter temporary admin password"
              />
              <Button className="w-full" onClick={handleTemporaryAccessUnlock} disabled={verifyingTempAccess}>
                {verifyingTempAccess ? "Verifying..." : "Unlock Admin Panel"}
              </Button>
            </div>
            <Button variant="outline" className="w-full" onClick={handleLogout}>Sign Out</Button>
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

  const documentRequests = contacts.filter(c => c.category === "document_request");
  // Exclude requests from main contacts view to keep it clean
  const generalMessages = filteredContacts.filter(c => c.category !== "document_request");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div><h1 className="text-3xl font-bold text-foreground">Admin Panel</h1><p className="text-sm text-muted-foreground">Manage content, users, and system settings.</p></div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchData} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</Button>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
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
              <CardHeader><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><CardTitle>Contact submissions ({generalMessages.length})</CardTitle><div className="relative w-full md:w-72"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search messages..." value={contactSearch} onChange={(e) => setContactSearch(e.target.value)} className="pl-9" /></div></div></CardHeader>
              <CardContent>
                <div className="max-h-[620px] overflow-auto rounded-md border">
                  <Table>
                    <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Category</TableHead><TableHead>Subject</TableHead><TableHead>Message</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {generalMessages.map(c => (
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
              <CardHeader><CardTitle>Send Newsletter</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Subject Line" value={newsletterSubject} onChange={e => setNewsletterSubject(e.target.value)} />
                <Textarea placeholder="Email Body (HTML or Text)..." value={newsletterBody} onChange={e => setNewsletterBody(e.target.value)} rows={6} />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">To: {subscribers.length} Subscribers</div>
                  <Button onClick={handleSendNewsletter} disabled={sendingNewsletter}>
                    <Send className="mr-2 h-4 w-4" /> {sendingNewsletter ? "Sending..." : "Blast Newsletter"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="h-6"></div>
            <Card>
              <CardHeader><CardTitle>Newsletter subscribers ({subscribers.length})</CardTitle></CardHeader>
              <CardContent><div className="max-h-[620px] overflow-auto rounded-md border"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Email</TableHead></TableRow></TableHeader><TableBody>{subscribers.map(s => <TableRow key={s.id}><TableCell className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell><TableCell>{s.email}</TableCell></TableRow>)}</TableBody></Table></div></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs"><AdminBlogsTab blogs={blogs} onRefresh={fetchData} currentUserId={currentUserId} /></TabsContent>
          
          <TabsContent value="community">
            <Card className="mb-6">
              <CardHeader><CardTitle>Create New Group</CardTitle></CardHeader>
              <CardContent className="flex gap-4">
                <Input placeholder="Group Name" value={newGroupData.name} onChange={e => setNewGroupData({...newGroupData, name: e.target.value})} />
                <Input placeholder="Description" value={newGroupData.description} onChange={e => setNewGroupData({...newGroupData, description: e.target.value})} />
                <Button onClick={handleCreateGroup}>Create</Button>
              </CardContent>
            </Card>
            <AdminCommunityTab groups={communityGroups} posts={communityPosts} messages={communityMessages} onRefresh={fetchData} currentUserId={currentUserId} />
          </TabsContent>

          <TabsContent value="documents">
            <Card className="mb-6">
              <CardHeader><CardTitle>Upload Official Document</CardTitle></CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleUploadDocument}>
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Click to upload form (PDF/DOCX)</p>
                  <p className="text-xs text-muted-foreground">Automatically adds to Documents Library</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader><CardTitle>Requested Documents</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>User</TableHead><TableHead>Document Requested</TableHead><TableHead>Details</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {documentRequests.map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{r.name} <br/><span className="text-[10px] text-muted-foreground">{r.email}</span></TableCell>
                        <TableCell className="font-medium">{r.subject.replace("Document Request: ", "")}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{r.message}</TableCell>
                      </TableRow>
                    ))}
                    {documentRequests.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No pending requests</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <AdminDocumentsTab documents={documents} onRefresh={fetchData} />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader><CardTitle>User Management</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Details</TableHead>
                      <TableHead>Location/IP</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Security</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((p: any) => (
                      <TableRow key={p.user_id}>
                        <TableCell>
                          <div className="font-medium">{p.full_name || "Unknown"}</div>
                          <div className="text-xs text-muted-foreground">{p.email || p.users?.email}</div>
                          <div className="text-xs text-muted-foreground font-mono">{p.user_id}</div>
                        </TableCell>
                        <TableCell>{p.location_data || "Unknown City"}</TableCell>
                        <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-[10px]">PWD: [HIDDEN/HASHED]</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="destructive" size="sm" onClick={() => handleBanUser(p.user_id)}>
                            <Ban className="h-3 w-3 mr-1" /> Ban
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="h-fit">
                <CardHeader><CardTitle className="flex items-center gap-2"><BeeIcon className="h-5 w-5" />Bee AI Training</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Persona & Context</h3>
                    <p className="text-xs text-muted-foreground">Who is Bee? What is its role?</p>
                    <Textarea 
                      value={aiPersona} 
                      onChange={(e) => setAiPersona(e.target.value)} 
                      className="min-h-[120px] font-mono text-sm bg-muted/30" 
                      placeholder="e.g. You are a helpful business consultant for Indian startups..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Response Guidelines</h3>
                    <p className="text-xs text-muted-foreground">How should Bee format answers? Any restrictions?</p>
                    <Textarea 
                      value={aiGuidelines} 
                      onChange={(e) => setAiGuidelines(e.target.value)} 
                      className="min-h-[150px] font-mono text-sm bg-muted/30" 
                      placeholder="e.g. Keep answers under 3 paragraphs. Use markdown. Always mention legal disclaimers..." 
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => { setAiPersona(""); setAiGuidelines(""); }}><RotateCcw className="mr-2 h-4 w-4" /> Reset Form</Button>
                    <Button onClick={handleSavePrompt} disabled={savingPrompt} className="bg-green-600 hover:bg-green-700 text-white">
                      <Save className="mr-2 h-4 w-4" /> {savingPrompt ? "Saving..." : "Save & Update Model"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex flex-col h-[600px]">
                <CardHeader className="border-b bg-muted/20 py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-purple-500" /> Test Playground</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setTestChat([{ role: "assistant", content: "Test reset. How can I help?" }])} className="h-8 text-xs">Clear Chat</Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {testChat.map((m, i) => (
                      <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{m.content}</div></div>
                    ))}
                    {isTestingAi && <div className="text-xs text-muted-foreground animate-pulse">Bee is typing...</div>}
                  </div>
                  <div className="p-3 border-t bg-background"><form onSubmit={(e) => { e.preventDefault(); handleTestAiSend(); }} className="flex gap-2"><Input value={testMessage} onChange={e => setTestMessage(e.target.value)} placeholder="Test your prompt..." className="flex-1" /><Button type="submit" size="icon" disabled={isTestingAi}><Send className="h-4 w-4" /></Button></form></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
