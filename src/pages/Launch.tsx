import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Building, FileText, Users, TrendingUp, Shield, CheckCircle, Clock, DollarSign, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/services/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import FAQSection from "@/components/FAQSection";

const launchFAQs = [
  { question: "When is the right time to launch?", answer: "Launch when you have a Minimum Viable Product (MVP) that solves a core problem. Don't wait for perfection - early feedback is invaluable. Most successful startups launch with 60-70% of planned features and iterate based on customer feedback." },
  { question: "What licenses do I need before launching?", answer: "It depends on your industry. At minimum: GST registration (if turnover exceeds ₹20L), Shop & Establishment license, PAN card. Industry-specific licenses like FSSAI (food), Drug License (pharma), or RERA (real estate) may also be needed." },
  { question: "How much should I spend on my initial launch?", answer: "Follow the lean startup approach — spend minimally on launch marketing (10-15% of your initial budget). Focus on organic channels, social media, and word-of-mouth. Paid advertising should come after you've validated product-market fit." },
  { question: "Should I soft launch or go all-in?", answer: "Always soft launch first. Test with a small, friendly audience (100-500 users), collect feedback, fix critical issues, then scale. This reduces risk and helps you refine your offering before spending on broad marketing." },
  { question: "What common launch mistakes should I avoid?", answer: "Top mistakes: 1) Launching without market validation, 2) Underestimating legal compliance, 3) No customer support plan, 4) Ignoring cash flow management, 5) Trying to serve everyone instead of a niche, 6) Not having a post-launch iteration plan." },
];

const launchChecklist = [
  "Business plan finalized and approved",
  "Legal structure established",
  "All licenses and permits obtained",
  "Tax registrations completed",
  "Business bank account opened",
  "Insurance policies in place",
  "Workspace/office setup completed",
  "Technology infrastructure ready",
  "Product/service development finished",
  "Quality testing completed",
  "Pricing strategy finalized",
  "Marketing materials prepared",
  "Website and online presence ready",
  "Team hired and trained",
  "Customer support system in place",
  "Launch marketing campaign planned",
  "Financial projections validated",
  "Risk management plan in place",
];

const Launch = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("launch_checklist").select("checklist_data").eq("user_id", user.id).single();
      if (data?.checklist_data) setCheckedItems(data.checklist_data as Record<string, boolean>);
    };
    load();
  }, [user]);

  const toggleItem = async (item: string) => {
    const updated = { ...checkedItems, [item]: !checkedItems[item] };
    setCheckedItems(updated);
    if (!user) return;
    const { error } = await supabase.from("launch_checklist").upsert({
      user_id: user.id,
      checklist_data: updated,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) toast({ title: "Error", description: "Failed to save checklist", variant: "destructive" });
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = Math.round((completedCount / launchChecklist.length) * 100);

  const launchPhases = [
    { phase: "Pre-Launch", title: "Foundation Setup", description: "Complete legal formalities and operational setup", icon: Building, color: "blue", tasks: ["Business registration & incorporation", "Tax registrations (GST, PAN, etc.)", "Banking setup & accounts", "Insurance & legal compliance", "Workspace setup", "Technology infrastructure"], timeframe: "4-8 weeks" },
    { phase: "Soft Launch", title: "Market Testing", description: "Test your product/service with limited audience", icon: Target, color: "green", tasks: ["Beta testing with select customers", "Feedback collection & analysis", "Product/service refinement", "Initial marketing campaigns", "Team hiring & training", "Operational process optimization"], timeframe: "2-4 weeks" },
    { phase: "Official Launch", title: "Go-to-Market", description: "Full-scale market entry and promotion", icon: Rocket, color: "purple", tasks: ["Marketing campaign execution", "PR & media outreach", "Customer acquisition activities", "Sales process implementation", "Customer support setup", "Performance monitoring"], timeframe: "2-3 weeks" },
    { phase: "Post-Launch", title: "Growth & Optimization", description: "Scale operations and optimize performance", icon: TrendingUp, color: "orange", tasks: ["Performance analysis & reporting", "Customer feedback implementation", "Process improvements", "Team expansion", "Market expansion planning", "Investor relations"], timeframe: "Ongoing" },
  ];

  const colors: Record<string, string> = { blue: "bg-blue-500 text-blue-50", green: "bg-green-500 text-green-50", purple: "bg-purple-500 text-purple-50", orange: "bg-orange-500 text-orange-50" };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">Launch Your Business</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Step-by-step guidance to successfully launch your business
          </p>
        </div>

        {/* Launch Phases */}
        <div className="mb-16 space-y-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Launch Phases</h2>
          {launchPhases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${colors[phase.color]}`}><Icon className="h-6 w-6" /></div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline">{t(phase.phase)}</Badge>
                        <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />{t(phase.timeframe)}</Badge>
                      </div>
                      <CardTitle className="text-xl">{t(phase.title)}</CardTitle>
                      <CardDescription>{t(phase.description)}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {phase.tasks.map((task, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{t(task)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Checklist with persistence */}
        <Card className="mb-16">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  {t("Pre-Launch Checklist")}
                </CardTitle>
                <CardDescription>{t("Track your progress")} - {completedCount}/{launchChecklist.length} {t("completed")}</CardDescription>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{progress}%</span>
                <div className="w-24 bg-secondary rounded-full h-2 mt-1">
                  <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {launchChecklist.map((item, index) => (
                <label key={index} className="flex items-start space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    checked={!!checkedItems[item]}
                    onChange={() => toggleItem(item)}
                    className="mt-1 h-4 w-4 text-primary border-input rounded focus:ring-primary"
                  />
                  <span className={`text-sm ${checkedItems[item] ? "line-through text-muted-foreground" : "text-foreground"}`}>{t(item)}</span>
                </label>
              ))}
            </div>
            {!user && <p className="text-sm text-muted-foreground mt-4 text-center">{t("Log in to save your checklist progress.")}</p>}
          </CardContent>
        </Card>

        {/* Launch Resources */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader><div className="flex items-center space-x-2"><FileText className="h-5 w-5 text-primary" /><CardTitle className="text-lg">{t("Document Templates")}</CardTitle></div></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground mb-4">{t("Download ready-to-use templates")}</p><Button asChild className="w-full"><Link to="/documents">{t("Access Templates")}</Link></Button></CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader><div className="flex items-center space-x-2"><Shield className="h-5 w-5 text-green-600" /><CardTitle className="text-lg">{t("Legal Compliance")}</CardTitle></div></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground mb-4">{t("Ensure legal requirements are met")}</p><Button asChild className="w-full"><Link to="/legal">{t("Check Compliance")}</Link></Button></CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader><div className="flex items-center space-x-2"><DollarSign className="h-5 w-5 text-purple-600" /><CardTitle className="text-lg">{t("Funding Support")}</CardTitle></div></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground mb-4">{t("Explore funding options")}</p><Button asChild className="w-full"><Link to="/incubators">{t("Find Funding")}</Link></Button></CardContent>
          </Card>
        </div>

        {/* Why Launch Right */}
        <div className="bg-muted/50 rounded-2xl p-8 mb-8 border">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t("Why Getting Your Launch Right Matters")}</h2>
          <p className="text-muted-foreground mb-4">{t("Your launch sets the tone for everything that follows. A well-executed launch builds momentum, attracts early customers, and establishes credibility in the market. According to research, startups that follow a structured launch process are 2.7x more likely to succeed in their first year.")}</p>
          <p className="text-muted-foreground">{t("Use the checklist above to track every critical step, from legal compliance to marketing readiness. Each item represents a common failure point that can be avoided with proper preparation.")}</p>
        </div>

        {/* FAQ */}
        <FAQSection items={launchFAQs} />
      </div>
    </div>
  );
};

export default Launch;
