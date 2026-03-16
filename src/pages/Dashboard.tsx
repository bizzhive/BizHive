import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Activity, FileText, ArrowRight, User, Building } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [savedToolsCount, setSavedToolsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [onboardingData, setOnboardingData] = useState({
    full_name: "",
    phone: "",
    industry: "",
    state: "",
    business_name: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, businessRes, toolsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
        supabase.from("saved_tools").select("id", { count: "exact" }).eq("user_id", user.id),
      ]);
      
      setProfile(profileRes.data);
      setBusiness(businessRes.data?.[0] || null);
      setSavedToolsCount(toolsRes.count || 0);
      
      if (profileRes.data && !profileRes.data.onboarding_completed) {
        setOnboardingData(prev => ({
          ...prev,
          full_name: profileRes.data.full_name || user.user_metadata?.full_name || "",
        }));
        setShowOnboarding(true);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const profileCompletion = () => {
    if (!profile) return 0;
    const fields = ["full_name", "phone", "industry", "state", "business_stage"];
    const filled = fields.filter((f) => profile[f]).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("profiles").update({
        full_name: onboardingData.full_name,
        phone: onboardingData.phone,
        industry: onboardingData.industry,
        state: onboardingData.state,
        onboarding_completed: true,
      }).eq("user_id", user.id);

      if (onboardingData.business_name) {
        await supabase.from("businesses").insert({
          user_id: user.id,
          name: onboardingData.business_name,
          industry: onboardingData.industry,
          state: onboardingData.state,
        });
      }

      setShowOnboarding(false);
      // Refetch
      const [p, b] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
      ]);
      setProfile(p.data);
      setBusiness(b.data?.[0] || null);
      toast({ title: "Welcome!", description: "Your profile has been set up." });
    } catch {
      toast({ title: "Error", description: "Failed to save profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const completion = profileCompletion();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Onboarding Dialog */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to BizHive! 🎉</DialogTitle>
            <DialogDescription>Tell us about yourself so we can personalize your experience.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOnboarding} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={onboardingData.full_name} onChange={(e) => setOnboardingData({ ...onboardingData, full_name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={onboardingData.phone} onChange={(e) => setOnboardingData({ ...onboardingData, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={onboardingData.industry} onChange={(e) => setOnboardingData({ ...onboardingData, industry: e.target.value })} placeholder="e.g. Technology, Food, Retail" />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input value={onboardingData.state} onChange={(e) => setOnboardingData({ ...onboardingData, state: e.target.value })} placeholder="e.g. Maharashtra" />
            </div>
            <div className="space-y-2">
              <Label>Business Name (optional)</Label>
              <Input value={onboardingData.business_name} onChange={(e) => setOnboardingData({ ...onboardingData, business_name: e.target.value })} placeholder="Your business name" />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Get Started"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}! Here's your business overview.
          </p>
        </div>
        <Button onClick={() => navigate("/plan")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Business Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Business Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              {business?.stage
                ? business.stage.charAt(0).toUpperCase() + business.stage.slice(1)
                : profile?.business_stage
                ? profile.business_stage.charAt(0).toUpperCase() + profile.business_stage.slice(1)
                : "Idea Phase"}
            </div>
            {business?.name && <p className="text-sm text-muted-foreground mt-1">{business.name}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground flex items-center">
              <FileText className="mr-2 h-5 w-5 text-green-500" />
              {savedToolsCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{completion}%</div>
            <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
              <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${completion}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Market Research", path: "/plan/market-research", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
          { title: "Business Canvas", path: "/tools/business-canvas", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
          { title: "Financial Calc", path: "/tools/financial-calculator", color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
          { title: "AI Assistant", path: "/ai-assistant", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
        ].map((action, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(action.path)}>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-4 ${action.color}`}>
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
              <div className="text-sm text-primary flex items-center">
                Start <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
