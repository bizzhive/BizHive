import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { streamBizHiveChat } from "@/services/ai/chat";
import { recordAdminAudit } from "@/services/admin/audit";
import { supabase } from "@/services/supabase/client";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import type { Json, Tables } from "@/services/supabase/database.types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, BookOpen, FileText, Gauge, Loader2, Mail, MessageSquare, RefreshCw, Save, Search, Shield, Users, Ban, Send, RotateCcw, Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";
import BeeIcon from "@/components/BeeIcon";
import AdminBlogsTab from "@/components/admin/AdminBlogsTab";
import AdminCommunityTab from "@/components/admin/AdminCommunityTab";
import AdminDocumentsTab from "@/components/admin/AdminDocumentsTab";
import { slugify } from "@/lib/text";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

type AdminRole = "admin" | "moderator";
type LegalTemplate = Tables<"legal_document_templates">;
type UserRole = Tables<"user_roles">;
type UserBan = Tables<"user_bans">;
type AdminAuditLog = Tables<"admin_audit_logs">;

const EMPTY_NEWSLETTER_DRAFT = {
  body: "",
  subject: "",
};

const AdminStatCard = ({
  description,
  icon: Icon,
  title,
  value,
}: {
  description: string;
  icon: typeof Gauge;
  title: string;
  value: number | string;
}) => (
  <Surface className="h-full p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="mt-2 font-display text-3xl font-semibold tracking-[-0.045em] text-foreground">
          {value}
        </div>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
  </Surface>
);

const AdminPanel = () => {
  const { toast } = useToast();
  const { user, session, isLoading: authLoading, signOut } = useAuth();
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean | null>(null);
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(false);

  const [contacts, setContacts] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [communityGroups, setCommunityGroups] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [communityMessages, setCommunityMessages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [legalTemplates, setLegalTemplates] = useState<LegalTemplate[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userBans, setUserBans] = useState<UserBan[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [auditSearch, setAuditSearch] = useState("");
  
  // AI Training State
  const [aiPersona, setAiPersona] = useState("");
  const [aiGuidelines, setAiGuidelines] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [testChat, setTestChat] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Hello Admin! I'm ready to test your new instructions." }
  ]);
  const [isTestingAi, setIsTestingAi] = useState(false);
  
  const [newsletterDraft, setNewsletterDraft] = useState(EMPTY_NEWSLETTER_DRAFT);
  const [newGroupData, setNewGroupData] = useState({
    name: "",
    description: "",
    is_private: false,
  });

  const currentUserId = user?.id;
  const isAdmin = adminRoles.includes("admin");
  const isModerator = adminRoles.includes("moderator");

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        setAdminRoles([]);
        setHasAdminAccess(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin", "moderator"]);

      if (error) {
        toast({ title: "Access check failed", description: error.message, variant: "destructive" });
        setAdminRoles([]);
        setHasAdminAccess(false);
        return;
      }

      const nextRoles = (data ?? []).map((row) => row.role as AdminRole);
      setAdminRoles(nextRoles);
      setHasAdminAccess(nextRoles.length > 0);
    };
    void checkAdminAccess();
  }, [authLoading, toast, user]);

  const handleLogout = async () => {
    await signOut();
  };

  const recordAudit = async (action: string, entityType: string, summary: string, entityId?: string, details?: Json) => {
    if (!user || !hasAdminAccess) {
      return;
    }

    await recordAdminAudit(supabase, {
      action,
      actorName: user.user_metadata?.full_name || user.email || "Admin",
      actorRole: isAdmin ? "admin" : "moderator",
      details,
      entityId: entityId ?? null,
      entityType,
      summary,
      userId: user.id,
    });
  };

  const fetchData = async () => {
    setLoading(true);

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
      templatesRes,
      rolesRes,
      bansRes,
      auditRes,
    ] = await Promise.all([
      isAdmin ? supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }) : Promise.resolve({ data: [], error: null }),
      isAdmin ? supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }) : Promise.resolve({ data: [], error: null }),
      isAdmin ? supabase.from("admin_settings").select("value").eq("key", "ai_system_prompt").maybeSingle() : Promise.resolve({ data: null, error: null }),
      isAdmin ? supabase.from("blog_posts").select("*").order("updated_at", { ascending: false }) : Promise.resolve({ data: [], error: null }),
      supabase.from("community_groups").select("*").order("created_at", { ascending: false }),
      supabase.from("community_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("community_messages").select("*").order("created_at", { ascending: false }),
      isAdmin ? supabase.from("documents").select("*").order("created_at", { ascending: false }) : Promise.resolve({ data: [], error: null }),
      isAdmin ? (supabase.from("profiles").select('user_id, full_name, created_at, location_data, preferred_language, onboarding_completed, signature_mode, users(email)') as any) : Promise.resolve({ data: [], error: null }),
      isAdmin ? supabase.from("legal_document_templates").select("*").order("updated_at", { ascending: false }) : Promise.resolve({ data: [], error: null }),
      (isAdmin || isModerator) ? supabase.from("user_roles").select("*").order("user_id", { ascending: true }) : Promise.resolve({ data: [], error: null }),
      (isAdmin || isModerator) ? supabase.from("user_bans").select("*").order("banned_at", { ascending: false }) : Promise.resolve({ data: [], error: null }),
      isAdmin ? supabase.from("admin_audit_logs").select("*").order("created_at", { ascending: false }).limit(200) : Promise.resolve({ data: [], error: null }),
    ]);

    const firstError = [
      contactsRes.error,
      subscribersRes.error,
      settingsRes.error,
      blogsRes.error,
      groupsRes.error,
      postsRes.error,
      messagesRes.error,
      documentsRes.error,
      profilesRes.error,
      templatesRes.error,
      rolesRes.error,
      bansRes.error,
      auditRes.error,
    ].find(Boolean);

    if (firstError) {
      toast({ title: "Admin data failed to load", description: firstError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    setContacts(contactsRes.data ?? []);
    setSubscribers(subscribersRes.data ?? []);
    setBlogs(blogsRes.data ?? []);
    setCommunityGroups(groupsRes.data ?? []);
    setCommunityPosts(postsRes.data ?? []);
    setCommunityMessages(messagesRes.data ?? []);
    setDocuments(documentsRes.data ?? []);
    setLegalTemplates(templatesRes.data ?? []);
    setUserRoles(rolesRes.data ?? []);
    setUserBans(bansRes.data ?? []);
    setAuditLogs(auditRes.data ?? []);
    if (profilesRes.data) {
      const formattedProfiles = (profilesRes.data as any[]).map((profile) => ({ ...profile, email: profile.users?.email, users: undefined }));
      setProfiles(formattedProfiles);
    } else {
      setProfiles([]);
    }
    
    const fullPrompt = settingsRes.data?.value ?? "";
    if (fullPrompt.includes("---GUIDELINES---")) {
      const [persona, guidelines] = fullPrompt.split("---GUIDELINES---");
      setAiPersona(persona.trim());
      setAiGuidelines(guidelines.trim());
    } else {
      setAiPersona(fullPrompt);
      setAiGuidelines("");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!hasAdminAccess) {
      return;
    }

    void fetchData();

    const scheduleRefresh = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(() => {
        void fetchData();
      }, 250);
    };

    const channel = supabase
      .channel("admin-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "admin_settings" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "blog_posts" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "community_groups" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "community_messages" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_submissions" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "documents" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "legal_document_templates" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "newsletter_subscribers" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "user_bans" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "admin_audit_logs" }, scheduleRefresh)
      .subscribe();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      void supabase.removeChannel(channel);
    };
  }, [hasAdminAccess, isAdmin, isModerator]);

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
    if (!isAdmin) {
      return;
    }

    setSavingPrompt(true);
    const combinedPrompt = `${aiPersona}\n\n---GUIDELINES---\n\n${aiGuidelines}`;
    const { error } = await supabase.from("admin_settings").upsert({ key: "ai_system_prompt", value: combinedPrompt });
    setSavingPrompt(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await recordAudit("ai.prompt.updated", "admin_settings", "Updated Bee AI system instructions", "ai_system_prompt", {
        guidelinesLength: aiGuidelines.length,
        personaLength: aiPersona.length,
      });
      toast({ title: "AI Updated", description: "New instructions are now live for all users." });
    }
  };

  // Action Handlers
  const handleCreateGroup = async () => {
    if (!isAdmin && !isModerator) {
      return;
    }

    const slug = slugify(newGroupData.name);
    if (!slug) {
      toast({ title: "Invalid group name", description: "Enter a valid group name to create a slug.", variant: "destructive" });
      return;
    }

    const payload = {
      ...newGroupData,
      slug,
    };
    const { data, error } = await supabase.from("community_groups").insert(payload).select("id").single();
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      await recordAudit("community.group.created", "community_groups", `Created community group "${payload.name}"`, data?.id, payload);
      setNewGroupData({ name: "", description: "", is_private: false });
      toast({ title: "Success", description: "Group created" });
      void fetchData();
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!isAdmin && !isModerator) {
      return;
    }

    await supabase.from("user_bans").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_bans").insert({ user_id: userId, reason: "Admin Ban" });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    await recordAudit("user.banned", "user_bans", `Banned user ${userId.slice(0, 8)}`, userId, { targetUserId: userId });
    toast({ title: "User Banned", description: "User access restricted" });
    void fetchData();
  };

  const toggleUserRole = async (userId: string, role: UserRole["role"]) => {
    if (!isAdmin || !user) {
      return;
    }

    const hasRole = (userRoles ?? []).some((row) => row.user_id === userId && row.role === role);
    if (userId === user.id && role === "admin" && hasRole) {
      toast({ title: "Action blocked", description: "You cannot remove your own admin role.", variant: "destructive" });
      return;
    }

    const mutation = hasRole
      ? supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role)
      : supabase.from("user_roles").insert({ user_id: userId, role });

    const { error } = await mutation;
    if (error) {
      toast({ title: "Role update failed", description: error.message, variant: "destructive" });
      return;
    }

    await recordAudit(hasRole ? "user-role.removed" : "user-role.added", "user_roles", `${hasRole ? "Removed" : "Granted"} ${role} role ${hasRole ? "from" : "to"} user ${userId.slice(0, 8)}`, userId, { role, targetUserId: userId });
    toast({ title: "Role updated", description: `${hasRole ? "Removed" : "Granted"} ${role} role.` });
    void fetchData();
  };

  const handleTestAiSend = async () => {
    if (!testMessage.trim()) return;
    if (!session?.access_token) {
      toast({ title: "Login required", description: "Sign in with an admin account to test Bee.", variant: "destructive" });
      return;
    }

    const userMsg = { role: "user", content: testMessage };
    setTestChat(prev => [...prev, userMsg, { role: "assistant", content: "" }]);
    setTestMessage("");
    setIsTestingAi(true);

    try {
      await streamBizHiveChat({
        accessToken: session.access_token,
        messages: [userMsg],
        systemOverride: `${aiPersona}\n\n${aiGuidelines}`.trim(),
        context: { role: "admin_tester" },
        onChunk: (_chunk, fullResponse) => {
          setTestChat(prev =>
            prev.map((message, index) =>
              index === prev.length - 1 ? { ...message, content: fullResponse } : message
            )
          );
        },
        errorMessages: {
          default: "Bee test request failed.",
        },
      });
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
      <div className="page-shell">
        <SiteContainer>
          <Surface className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
              <Shield className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                Checking admin access
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Verifying the current account before the control panel loads.
              </p>
            </div>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </Surface>
        </SiteContainer>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-shell">
        <SiteContainer>
          <Surface className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
              <Shield className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                Admin sign-in required
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Sign in with an authorized account before opening the control room.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to="/login">Go to Login</Link>
            </Button>
          </Surface>
        </SiteContainer>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="page-shell">
        <SiteContainer>
          <Surface className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                Admin access required
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                This account still needs an admin or moderator role assigned inside the platform.
              </p>
            </div>
            <Button variant="outline" className="w-full" onClick={handleLogout}>Sign Out</Button>
          </Surface>
        </SiteContainer>
      </div>
    );
  }

  const filteredContacts = contacts.filter(c => 
    contactSearch === "" || 
    c.name?.toLowerCase().includes(contactSearch.toLowerCase()) || 
    c.email?.toLowerCase().includes(contactSearch.toLowerCase())
  );
  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriberSearch === "" || subscriber.email?.toLowerCase().includes(subscriberSearch.toLowerCase())
  );
  const filteredProfiles = profiles.filter((profile) =>
    userSearch === "" ||
    profile.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    profile.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    profile.user_id?.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredAuditLogs = auditLogs.filter((log) =>
    auditSearch === "" ||
    log.summary?.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.action?.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.entity_type?.toLowerCase().includes(auditSearch.toLowerCase())
  );
  const rolesByUser = userRoles.reduce<Record<string, string[]>>((accumulator, role) => {
    accumulator[role.user_id] = [...(accumulator[role.user_id] ?? []), role.role];
    return accumulator;
  }, {});
  const bannedUserIds = new Set(userBans.map((ban) => ban.user_id));
  const summaryStats = [
    {
      title: "Users",
      value: profiles.length,
      description: "Profiles synced into the current Supabase workspace.",
      icon: Users,
    },
    {
      title: "Community activity",
      value: communityPosts.length + communityMessages.length,
      description: "Posts and messages that currently need moderation visibility.",
      icon: MessageSquare,
    },
    {
      title: "Content objects",
      value: blogs.length + documents.length + legalTemplates.length,
      description: "Blogs, documents, and legal templates under active admin control.",
      icon: FileText,
    },
    {
      title: "Security flags",
      value: userBans.length,
      description: "Accounts currently banned or restricted by the admin team.",
      icon: AlertTriangle,
    },
  ];

  const documentRequests = contacts.filter(c => c.category === "document_request");
  // Exclude requests from main contacts view to keep it clean
  const generalMessages = filteredContacts.filter(c => c.category !== "document_request");

  return (
    <div className="page-shell">
      <SiteContainer className="space-y-8">
        <PageHeader
          eyebrow="Operations"
          title="BizHive control room"
          description="Manage users, content, moderation, and system-level settings from one consistent admin workspace."
          actions={
            <>
              <Badge variant="outline">{isAdmin ? "Admin" : "Moderator"}</Badge>
              <Button variant="outline" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryStats.map((item) => (
            <AdminStatCard
              key={item.title}
              title={item.title}
              value={item.value}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>

        <Tabs defaultValue="analytics" className="space-y-8">
          <div className="overflow-x-auto pb-1">
            <TabsList className="h-auto min-w-max justify-start gap-2 rounded-[24px] border border-border/70 bg-muted/30 p-2">
              <TabsTrigger value="analytics" className="gap-2 rounded-2xl"><BarChart3 className="h-4 w-4" />Analytics</TabsTrigger>
              {isAdmin && <TabsTrigger value="contacts" className="gap-2 rounded-2xl"><MessageSquare className="h-4 w-4" />Messages</TabsTrigger>}
              {isAdmin && <TabsTrigger value="subscribers" className="gap-2 rounded-2xl"><Mail className="h-4 w-4" />Subscribers</TabsTrigger>}
              {isAdmin && <TabsTrigger value="blogs" className="gap-2 rounded-2xl"><BookOpen className="h-4 w-4" />Blogs</TabsTrigger>}
              <TabsTrigger value="community" className="gap-2 rounded-2xl"><Users className="h-4 w-4" />Community</TabsTrigger>
              {isAdmin && <TabsTrigger value="documents" className="gap-2 rounded-2xl"><FileText className="h-4 w-4" />Documents</TabsTrigger>}
              {isAdmin && <TabsTrigger value="users" className="gap-2 rounded-2xl"><Shield className="h-4 w-4" />Users</TabsTrigger>}
              {isAdmin && <TabsTrigger value="ai" className="gap-2 rounded-2xl"><BeeIcon className="h-4 w-4" />AI Training</TabsTrigger>}
              {isAdmin && <TabsTrigger value="audit" className="gap-2 rounded-2xl"><FileText className="h-4 w-4" />Audit</TabsTrigger>}
            </TabsList>
          </div>

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

          {isAdmin && <TabsContent value="contacts">
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
          </TabsContent>}

          {isAdmin && <TabsContent value="subscribers">
            <Card>
              <CardHeader><CardTitle>Subscriber Tools</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <Input placeholder="Draft subject (optional)" value={newsletterDraft.subject} onChange={(e) => setNewsletterDraft((current) => ({ ...current, subject: e.target.value }))} />
                <Textarea placeholder="Notes for your email provider or CRM workflow..." value={newsletterDraft.body} onChange={(e) => setNewsletterDraft((current) => ({ ...current, body: e.target.value }))} rows={6} />
                <div className="rounded-lg border border-dashed p-4">
                  Newsletter delivery is no longer faked in-app. Use this panel to manage the list, then send through your real email provider.
                </div>
                <Button onClick={() => navigator.clipboard.writeText(filteredSubscribers.map((subscriber) => subscriber.email).join(", "))} disabled={filteredSubscribers.length === 0}>
                  <Send className="mr-2 h-4 w-4" /> Copy Recipient List
                </Button>
              </CardContent>
            </Card>
            <div className="h-6"></div>
            <Card>
              <CardHeader><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><CardTitle>Newsletter subscribers ({filteredSubscribers.length})</CardTitle><div className="relative w-full md:w-72"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search subscribers..." value={subscriberSearch} onChange={(e) => setSubscriberSearch(e.target.value)} className="pl-9" /></div></div></CardHeader>
              <CardContent><div className="max-h-[620px] overflow-auto rounded-md border"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Email</TableHead></TableRow></TableHeader><TableBody>{filteredSubscribers.map(s => <TableRow key={s.id}><TableCell className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell><TableCell>{s.email}</TableCell></TableRow>)}</TableBody></Table></div></CardContent>
            </Card>
          </TabsContent>}

          {isAdmin && <TabsContent value="blogs"><AdminBlogsTab blogs={blogs} canEdit={isAdmin} onAudit={({ action, details, entityId, entityType, summary }) => recordAudit(action, entityType, summary, entityId, details)} onRefresh={fetchData} currentUserId={currentUserId} /></TabsContent>}
          
          <TabsContent value="community">
            <Card className="mb-6">
              <CardHeader><CardTitle>Create New Group</CardTitle></CardHeader>
              <CardContent className="flex gap-4">
                <Input placeholder="Group Name" value={newGroupData.name} onChange={e => setNewGroupData({...newGroupData, name: e.target.value})} />
                <Input placeholder="Description" value={newGroupData.description} onChange={e => setNewGroupData({...newGroupData, description: e.target.value})} />
                <Button onClick={handleCreateGroup}>Create</Button>
              </CardContent>
            </Card>
            <AdminCommunityTab groups={communityGroups} posts={communityPosts} messages={communityMessages} canModerate={isAdmin || isModerator} onAudit={({ action, details, entityId, entityType, summary }) => recordAudit(action, entityType, summary, entityId, details)} onRefresh={fetchData} currentUserId={currentUserId} />
          </TabsContent>

          {isAdmin && <TabsContent value="documents">
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
            <AdminDocumentsTab documents={documents} legalTemplates={legalTemplates} canEdit={isAdmin} onAudit={({ action, details, entityId, entityType, summary }) => recordAudit(action, entityType, summary, entityId, details)} onRefresh={fetchData} />
          </TabsContent>}

          {isAdmin && <TabsContent value="users">
            <Card>
              <CardHeader><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><CardTitle>User Management</CardTitle><div className="relative w-full md:w-72"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="pl-9" /></div></div></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Details</TableHead>
                      <TableHead>Location/IP</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Security</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfiles.map((p: any) => (
                      <TableRow key={p.user_id}>
                        <TableCell>
                          <div className="font-medium">{p.full_name || "Unknown"}</div>
                          <div className="text-xs text-muted-foreground">{p.email || p.users?.email}</div>
                          <div className="text-xs text-muted-foreground font-mono">{p.user_id}</div>
                        </TableCell>
                        <TableCell>{p.location_data || "Unknown City"}</TableCell>
                        <TableCell><div className="flex flex-wrap gap-2">{(rolesByUser[p.user_id] ?? ["user"]).map((role) => <Badge key={role} variant={role === "admin" ? "default" : "secondary"}>{role}</Badge>)}</div></TableCell>
                        <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="font-mono text-[10px]">PWD: [HIDDEN/HASHED]</Badge>
                            {bannedUserIds.has(p.user_id) && <Badge variant="destructive">Banned</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap gap-2">
                              {(["premium", "moderator", "admin"] as UserRole["role"][]).map((role) => {
                                const hasRole = (rolesByUser[p.user_id] ?? ["user"]).includes(role);
                                return (
                                  <Button key={role} variant={hasRole ? "default" : "outline"} size="sm" onClick={() => toggleUserRole(p.user_id, role)}>
                                    {hasRole ? `Remove ${role}` : `Add ${role}`}
                                  </Button>
                                );
                              })}
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => handleBanUser(p.user_id)}>
                              <Ban className="h-3 w-3 mr-1" /> Ban
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>}

          {isAdmin && <TabsContent value="ai">
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
          </TabsContent>}

          {isAdmin && <TabsContent value="audit">
            <Card>
              <CardHeader><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><CardTitle>Audit Log ({filteredAuditLogs.length})</CardTitle><div className="relative w-full md:w-72"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search audit events..." value={auditSearch} onChange={(e) => setAuditSearch(e.target.value)} className="pl-9" /></div></div></CardHeader>
              <CardContent><div className="max-h-[620px] overflow-auto rounded-md border"><Table><TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Action</TableHead><TableHead>Entity</TableHead><TableHead>Summary</TableHead></TableRow></TableHeader><TableBody>{filteredAuditLogs.map((log) => <TableRow key={log.id}><TableCell className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</TableCell><TableCell><Badge variant="outline">{log.action}</Badge></TableCell><TableCell>{log.entity_type}</TableCell><TableCell>{log.summary}</TableCell></TableRow>)}</TableBody></Table></div></CardContent>
            </Card>
          </TabsContent>}
        </Tabs>
      </SiteContainer>
    </div>
  );
};

export default AdminPanel;
