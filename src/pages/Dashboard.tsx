import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import i18n, { supportedLanguages } from "@/i18n";
import SignaturePad from "@/components/SignaturePad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import type { Enums, Tables } from "@/services/supabase/database.types";
import { useTranslation } from "react-i18next";
import {
  Activity,
  ArrowRight,
  Building2,
  Copy,
  FileText,
  Languages,
  MapPin,
  PenTool,
  Phone,
  PlusCircle,
  UserRound,
} from "lucide-react";

type Profile = Tables<"profiles">;
type Business = Tables<"businesses">;
type BusinessStage = Enums<"business_stage">;
type SignatureMode = "draw" | "type";

type OnboardingData = {
  full_name: string;
  phone: string;
  industry: string;
  state: string;
  business_name: string;
  business_stage: BusinessStage;
  preferred_language: string;
};

type SignatureDraft = {
  dataUrl: string;
  fontFamily: string;
  mode: SignatureMode;
  text: string;
};

const initialOnboardingData: OnboardingData = {
  full_name: "",
  phone: "",
  industry: "",
  state: "",
  business_name: "",
  business_stage: "idea",
  preferred_language: supportedLanguages[0].code,
};

const signatureFontOptions = [
  { label: "Classic Script", value: '"Brush Script MT", "Segoe Script", cursive' },
  { label: "Elegant Serif", value: 'Georgia, "Times New Roman", serif' },
  { label: "Modern Signature", value: '"Trebuchet MS", "Gill Sans", sans-serif' },
];

const initialSignatureDraft: SignatureDraft = {
  dataUrl: "",
  fontFamily: signatureFontOptions[0].value,
  mode: "draw",
  text: "",
};

const stageOptions: BusinessStage[] = ["idea", "planning", "launching", "growing", "scaling"];

const createTypedSignatureDataUrl = (value: string, fontFamily: string) => {
  const text = value.trim();
  if (!text) {
    return "";
  }

  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 220;

  const context = canvas.getContext("2d");
  if (!context) {
    return "";
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#111827";
  context.font = `64px ${fontFamily}`;
  context.textBaseline = "middle";
  context.fillText(text, 36, canvas.height / 2);

  return canvas.toDataURL("image/png");
};

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [savedToolsCount, setSavedToolsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialOnboardingData);
  const [saving, setSaving] = useState(false);
  const [signatureDraft, setSignatureDraft] = useState<SignatureDraft>(initialSignatureDraft);
  const [signatureSaving, setSignatureSaving] = useState(false);

  const typedSignaturePreview = useMemo(
    () => createTypedSignatureDataUrl(signatureDraft.text, signatureDraft.fontFamily),
    [signatureDraft.fontFamily, signatureDraft.text]
  );

  const signaturePreview = signatureDraft.mode === "type" ? typedSignaturePreview : signatureDraft.dataUrl;
  const isSignatureReady = signatureDraft.mode === "type" ? Boolean(signatureDraft.text.trim()) : Boolean(signatureDraft.dataUrl);

  const startDashboardTour = useCallback(() => {
    if (localStorage.getItem("hasSeenDashboardTour")) {
      return;
    }

    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#dashboard-header",
          popover: {
            title: t("dashboard.tour.welcomeTitle"),
            description: t("dashboard.tour.welcomeDescription"),
          },
        },
        {
          element: "#business-stage-card",
          popover: {
            title: t("dashboard.tour.stageTitle"),
            description: t("dashboard.tour.stageDescription"),
          },
        },
        {
          element: "#quick-actions",
          popover: {
            title: t("dashboard.tour.actionsTitle"),
            description: t("dashboard.tour.actionsDescription"),
          },
        },
        {
          element: "#new-plan-btn",
          popover: {
            title: t("dashboard.tour.planTitle"),
            description: t("dashboard.tour.planDescription"),
          },
        },
      ],
      onDestroyStarted: () => {
        if (!driverObj.hasNextStep() || window.confirm(t("dashboard.tour.confirmExit"))) {
          driverObj.destroy();
          localStorage.setItem("hasSeenDashboardTour", "true");
        }
      },
    });

    window.setTimeout(() => driverObj.drive(), 500);
  }, [t]);

  const hydrateOnboardingData = useCallback(
    (currentProfile: Profile | null, currentBusiness: Business | null) => {
      setOnboardingData({
        full_name: currentProfile?.full_name || user?.user_metadata?.full_name || "",
        phone: currentProfile?.phone || "",
        industry: currentBusiness?.industry || currentProfile?.industry || "",
        state: currentBusiness?.state || currentProfile?.state || "",
        business_name: currentBusiness?.name || "",
        business_stage: currentBusiness?.stage || currentProfile?.business_stage || "idea",
        preferred_language:
          currentProfile?.preferred_language || i18n.resolvedLanguage || supportedLanguages[0].code,
      });
    },
    [user]
  );

  const hydrateSignatureDraft = useCallback((currentProfile: Profile | null) => {
    setSignatureDraft({
      dataUrl: currentProfile?.signature_data_url || "",
      fontFamily: currentProfile?.signature_font_family || signatureFontOptions[0].value,
      mode: currentProfile?.signature_mode === "type" ? "type" : "draw",
      text: currentProfile?.signature_text || currentProfile?.full_name || "",
    });
  }, []);

  const loadDashboardData = useCallback(
    async (userId: string, options?: { runTour?: boolean }) => {
      setLoading(true);

      try {
        const [profileRes, businessRes, toolsRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
          supabase
            .from("businesses")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase.from("saved_tools").select("id", { count: "exact", head: true }).eq("user_id", userId),
        ]);

        let currentProfile = profileRes.data;
        const currentBusiness = businessRes.data ?? null;

        if (currentProfile && !currentProfile.location_data) {
          await supabase
            .from("profiles")
            .update({
              location_data: "Mumbai, Maharashtra",
              last_seen: new Date().toISOString(),
            })
            .eq("user_id", userId);
        }

        if (!currentProfile) {
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert([
              {
                user_id: userId,
                full_name: user?.user_metadata?.full_name || "Entrepreneur",
                preferred_language: i18n.resolvedLanguage || supportedLanguages[0].code,
              },
            ])
            .select("*")
            .single();

          currentProfile = newProfile;
        }

        setProfile(currentProfile ?? null);
        setBusiness(currentBusiness);
        setSavedToolsCount(toolsRes.count || 0);
        hydrateSignatureDraft(currentProfile ?? null);

        if (currentProfile && !currentProfile.onboarding_completed) {
          hydrateOnboardingData(currentProfile, currentBusiness);
          setOnboardingStep(0);
          setShowOnboarding(true);
        } else {
          setShowOnboarding(false);
          if (options?.runTour) {
            startDashboardTour();
          }
        }
      } catch {
        toast({
          title: t("Error"),
          description: t("Failed to load dashboard data."),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [hydrateOnboardingData, hydrateSignatureDraft, startDashboardTour, t, toast, user]
  );

  useEffect(() => {
    const isAuthRedirect =
      window.location.hash.includes("access_token") ||
      window.location.hash.includes("type=recovery") ||
      window.location.search.includes("code=");

    if (!authLoading && !user && !isAuthRedirect) {
      navigate("/login");
    }
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    void loadDashboardData(user.id, { runTour: true });
  }, [loadDashboardData, user]);

  const profileCompletion = () => {
    if (!profile) {
      return 0;
    }

    const fields: Array<keyof Profile> = [
      "full_name",
      "phone",
      "industry",
      "state",
      "business_stage",
      "preferred_language",
      "signature_data_url",
    ];

    const filled = fields.filter((field) => profile[field]).length;
    return Math.round((filled / fields.length) * 100);
  };

  const updateOnboardingField = <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    setOnboardingData((current) => ({ ...current, [field]: value }));
  };

  const isCurrentStepValid = () => {
    if (onboardingStep === 0) {
      return Boolean(onboardingData.full_name.trim() && onboardingData.preferred_language);
    }

    if (onboardingStep === 1) {
      return Boolean(onboardingData.phone.trim() && onboardingData.state.trim());
    }

    return Boolean(onboardingData.industry.trim() && onboardingData.business_stage);
  };

  const handleOnboarding = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    if (onboardingStep < 2) {
      if (isCurrentStepValid()) {
        setOnboardingStep((current) => current + 1);
      }
      return;
    }

    setSaving(true);

    try {
      const payload = {
        full_name: onboardingData.full_name.trim(),
        phone: onboardingData.phone.trim(),
        industry: onboardingData.industry.trim(),
        state: onboardingData.state.trim(),
        business_stage: onboardingData.business_stage,
        preferred_language: onboardingData.preferred_language,
        onboarding_completed: true,
      };

      const { error: profileError } = await supabase.from("profiles").update(payload).eq("user_id", user.id);
      if (profileError) {
        throw profileError;
      }

      const businessPayload = {
        name: onboardingData.business_name.trim(),
        industry: onboardingData.industry.trim(),
        state: onboardingData.state.trim(),
        stage: onboardingData.business_stage,
      };

      if (businessPayload.name) {
        const businessMutation = business?.id
          ? supabase.from("businesses").update(businessPayload).eq("id", business.id).eq("user_id", user.id)
          : supabase.from("businesses").insert({ user_id: user.id, ...businessPayload });

        const { error: businessError } = await businessMutation;
        if (businessError) {
          throw businessError;
        }
      }

      await i18n.changeLanguage(onboardingData.preferred_language);
      setShowOnboarding(false);
      await loadDashboardData(user.id, { runTour: true });
      toast({ title: t("Welcome to BizHive"), description: t("dashboard.onboarding.saved") });
    } catch {
      toast({
        title: t("Error"),
        description: t("dashboard.onboarding.error"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveSignature = async () => {
    if (!user) {
      return;
    }

    const nextDataUrl = signatureDraft.mode === "type" ? typedSignaturePreview : signatureDraft.dataUrl;
    if (!nextDataUrl) {
      return;
    }

    setSignatureSaving(true);

    const payload = {
      signature_data_url: nextDataUrl,
      signature_mode: signatureDraft.mode,
      signature_text: signatureDraft.mode === "type" ? signatureDraft.text.trim() : null,
      signature_font_family: signatureDraft.mode === "type" ? signatureDraft.fontFamily : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").update(payload).eq("user_id", user.id);
    setSignatureSaving(false);

    if (error) {
      toast({ title: "Could not save signature", description: error.message, variant: "destructive" });
      return;
    }

    setProfile((current) => (current ? { ...current, ...payload } : current));
    setSignatureDraft((current) => ({ ...current, dataUrl: nextDataUrl }));
    toast({ title: "Signature saved", description: "Your e-signature is ready for future document flows." });
  };

  const copyToClipboard = async () => {
    if (!user?.id) {
      return;
    }

    await navigator.clipboard.writeText(user.id);
    toast({ title: "Copied!", description: "User ID copied to clipboard." });
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completion = profileCompletion();
  const onboardingSteps = [
    t("dashboard.onboarding.stepAboutYou"),
    t("dashboard.onboarding.stepLocation"),
    t("dashboard.onboarding.stepBusiness"),
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Dialog open={showOnboarding}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("dashboard.onboarding.title")}</DialogTitle>
            <DialogDescription>{t("dashboard.onboarding.description")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t("dashboard.onboarding.progress", { current: onboardingStep + 1, total: onboardingSteps.length })}</span>
              <span>{onboardingSteps[onboardingStep]}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${((onboardingStep + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleOnboarding} className="space-y-4">
            {onboardingStep === 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t("dashboard.onboarding.fullName")}</Label>
                  <Input id="full_name" value={onboardingData.full_name} onChange={(event) => updateOnboardingField("full_name", event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred_language">{t("dashboard.onboarding.language")}</Label>
                  <Select value={onboardingData.preferred_language} onValueChange={(value) => updateOnboardingField("preferred_language", value)}>
                    <SelectTrigger id="preferred_language">
                      <SelectValue placeholder={t("dashboard.onboarding.language")} />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedLanguages.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {onboardingStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("dashboard.onboarding.phone")}</Label>
                  <Input
                    id="phone"
                    value={onboardingData.phone}
                    onChange={(event) => updateOnboardingField("phone", event.target.value)}
                    placeholder={t("dashboard.onboarding.phonePlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">{t("dashboard.onboarding.state")}</Label>
                  <Input
                    id="state"
                    value={onboardingData.state}
                    onChange={(event) => updateOnboardingField("state", event.target.value)}
                    placeholder={t("dashboard.onboarding.statePlaceholder")}
                    required
                  />
                </div>
              </>
            )}

            {onboardingStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="business_name">{t("dashboard.onboarding.businessName")}</Label>
                  <Input
                    id="business_name"
                    value={onboardingData.business_name}
                    onChange={(event) => updateOnboardingField("business_name", event.target.value)}
                    placeholder={t("dashboard.onboarding.businessNamePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">{t("dashboard.onboarding.industry")}</Label>
                  <Input
                    id="industry"
                    value={onboardingData.industry}
                    onChange={(event) => updateOnboardingField("industry", event.target.value)}
                    placeholder={t("dashboard.onboarding.industryPlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_stage">{t("dashboard.onboarding.businessStage")}</Label>
                  <Select value={onboardingData.business_stage} onValueChange={(value: BusinessStage) => updateOnboardingField("business_stage", value)}>
                    <SelectTrigger id="business_stage">
                      <SelectValue placeholder={t("dashboard.onboarding.businessStage")} />
                    </SelectTrigger>
                    <SelectContent>
                      {stageOptions.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {t(`dashboard.businessStage.${stage}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOnboardingStep((current) => Math.max(0, current - 1))}
                disabled={onboardingStep === 0 || saving}
              >
                {t("common.previous")}
              </Button>
              <Button type="submit" disabled={!isCurrentStepValid() || saving}>
                {saving ? t("Saving...") : onboardingStep === onboardingSteps.length - 1 ? t("dashboard.onboarding.finish") : t("common.next")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div id="dashboard-header" className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{profile?.full_name || t("My Profile")}</h1>
          <p className="mt-1 text-muted-foreground">{t("Welcome back! Here's your business overview.")}</p>
        </div>
        <Button id="new-plan-btn" onClick={() => navigate("/plan")} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("New Business Plan")}
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card id="business-stage-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("Business Stage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-2xl font-bold text-foreground">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              {t(`dashboard.businessStage.${business?.stage || profile?.business_stage || "idea"}`)}
            </div>
            {business?.name && <p className="mt-1 text-sm text-muted-foreground">{business.name}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("Saved Tools")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-2xl font-bold text-foreground">
              <FileText className="mr-2 h-5 w-5 text-green-500" />
              {savedToolsCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("Profile Completion")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{completion}%</div>
            <div className="mt-2 h-2.5 w-full rounded-full bg-secondary">
              <div className="h-2.5 rounded-full bg-primary transition-all" style={{ width: `${completion}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("User ID")}</CardTitle>
            <Button onClick={copyToClipboard} className="h-6 w-6 hover:bg-accent hover:text-accent-foreground">
              <Copy className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="break-all text-xs font-mono text-muted-foreground">{user.id}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-xl font-bold text-foreground">{t("Quick Actions")}</h2>
      <div id="quick-actions" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Market Research", path: "/plan/market-research", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
          { title: "Business Canvas", path: "/tools/business-canvas", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
          { title: "Financial Calc", path: "/tools/financial-calculator", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
          { title: "AI Assistant", path: "/ai-assistant", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
        ].map((action) => (
          <Card key={action.path} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => navigate(action.path)}>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className={`mb-4 rounded-full p-3 ${action.color}`}>
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{t(action.title)}</h3>
              <div className="flex items-center text-sm text-primary">
                {t("Start")} <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: UserRound, label: "Full name", value: profile?.full_name || "Add your name" },
              { icon: Phone, label: "Phone", value: profile?.phone || "Add your phone number" },
              { icon: Languages, label: "Language", value: supportedLanguages.find((language) => language.code === profile?.preferred_language)?.name || profile?.preferred_language || "Choose a language" },
              { icon: MapPin, label: "State", value: business?.state || profile?.state || "Add your state" },
              { icon: Building2, label: "Business", value: business?.name || onboardingData.business_name || "Add your business name" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-border/70 p-4">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="font-medium text-foreground">{item.value}</div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-border/70 p-4 text-sm leading-6 text-muted-foreground">
              Your saved signature lives on your profile so it can be reused in upcoming document and workflow features.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              E-signature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={signatureDraft.mode} onValueChange={(value) => setSignatureDraft((current) => ({ ...current, mode: value as SignatureMode }))}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="draw">Draw</TabsTrigger>
                <TabsTrigger value="type">Type</TabsTrigger>
              </TabsList>

              <TabsContent value="draw" className="space-y-4">
                <p className="text-sm text-muted-foreground">Draw your signature below. Saving will keep the latest version on your profile.</p>
                <SignaturePad onSave={(dataUrl) => setSignatureDraft((current) => ({ ...current, dataUrl }))} />
              </TabsContent>

              <TabsContent value="type" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signature_text">Signature text</Label>
                  <Input
                    id="signature_text"
                    value={signatureDraft.text}
                    onChange={(event) => setSignatureDraft((current) => ({ ...current, text: event.target.value }))}
                    placeholder="Type your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signature_font">Signature style</Label>
                  <Select value={signatureDraft.fontFamily} onValueChange={(value) => setSignatureDraft((current) => ({ ...current, fontFamily: value }))}>
                    <SelectTrigger id="signature_font">
                      <SelectValue placeholder="Select a signature style" />
                    </SelectTrigger>
                    <SelectContent>
                      {signatureFontOptions.map((font) => (
                        <SelectItem key={font.label} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-6">
                  <div className="mb-2 text-sm text-muted-foreground">Typed preview</div>
                  <div className="min-h-[90px] text-5xl text-foreground" style={{ fontFamily: signatureDraft.fontFamily }}>
                    {signatureDraft.text || "Your name"}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
              <div className="text-sm font-medium text-foreground">Saved signature preview</div>
              {signaturePreview ? (
                <img src={signaturePreview} alt="Saved signature" className="h-24 w-full rounded-xl border border-border/70 bg-white object-contain p-3" />
              ) : (
                <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border/70 text-sm text-muted-foreground">
                  No signature saved yet.
                </div>
              )}
            </div>

            <Button onClick={saveSignature} disabled={!isSignatureReady || signatureSaving}>
              {signatureSaving ? "Saving signature..." : "Save e-signature"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
