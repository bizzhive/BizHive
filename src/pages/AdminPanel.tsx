
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Shield, MessageSquare, Mail, Save, Search, RefreshCw } from "lucide-react";
import BeeIcon from "@/components/BeeIcon";

const ADMIN_EMAIL = "kaleidis.official@gmail.com";

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Contact submissions
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactSearch, setContactSearch] = useState("");

  // Newsletter
  const [subscribers, setSubscribers] = useState<any[]>([]);

  // AI prompt
  const [aiPrompt, setAiPrompt] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) { navigate("/login"); return; }
      if (user.email !== ADMIN_EMAIL) { navigate("/"); return; }
      
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const hasAdmin = data?.some((r) => r.role === "admin");
      if (!hasAdmin) { navigate("/"); return; }
      
      setIsAdmin(true);
      setLoading(false);
      fetchData();
    };
    checkAdmin();
  }, [user, navigate]);

  const fetchData = async () => {
    const [{ data: c }, { data: s }] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
    ]);
    if (c) setContacts(c);
    if (s) setSubscribers(s);
    // Fetch AI prompt via raw REST call since admin_settings isn't in generated types
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/admin_settings?key=eq.ai_system_prompt&select=value`, {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      const rows = await res.json();
      if (rows?.[0]?.value) setAiPrompt(rows[0].value);
    } catch {}
  };

  const handleSavePrompt = async () => {
    setSavingPrompt(true);
    const { error } = await supabase
      .from("admin_settings")
      .update({ value: aiPrompt, updated_at: new Date().toISOString() })
      .eq("key", "ai_system_prompt");
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "AI system prompt updated successfully." });
    }
    setSavingPrompt(false);
  };

  if (loading || !isAdmin) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  const filteredContacts = contacts.filter((c) =>
    contactSearch === "" ||
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.subject.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground text-sm">Manage BizHive platform</p>
          </div>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="contacts" className="gap-2"><MessageSquare className="h-4 w-4" /> Messages</TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-2"><Mail className="h-4 w-4" /> Subscribers</TabsTrigger>
            <TabsTrigger value="ai" className="gap-2"><BeeIcon className="w-4 h-4" /> AI Training</TabsTrigger>
          </TabsList>

          {/* Contact Submissions */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Contact Submissions ({contacts.length})</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search messages..."
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-auto max-h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="max-w-[300px]">Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacts.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(c.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell>{c.email}</TableCell>
                          <TableCell><Badge variant="secondary">{c.category}</Badge></TableCell>
                          <TableCell>{c.subject}</TableCell>
                          <TableCell className="max-w-[300px] truncate text-sm">{c.message}</TableCell>
                        </TableRow>
                      ))}
                      {filteredContacts.length === 0 && (
                        <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No submissions found</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter */}
          <TabsContent value="subscribers">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscribers ({subscribers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-auto max-h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{s.email}</TableCell>
                        </TableRow>
                      ))}
                      {subscribers.length === 0 && (
                        <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-8">No subscribers yet</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Training */}
          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BeeIcon className="w-5 h-5" />
                  Train Bee AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Customize the system prompt that Bee uses to respond to users. Leave empty to use the default prompt.
                </p>
                <Textarea
                  placeholder="Enter custom system prompt for Bee AI..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                <Button onClick={handleSavePrompt} disabled={savingPrompt} className="gap-2">
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
