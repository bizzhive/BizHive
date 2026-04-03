import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import i18n, { supportedLanguages } from "@/i18n";
import SignaturePad from "@/components/SignaturePad";
import { Badge } from "@/components/ui/badge";
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
import { EmptyState, PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import type { Enums, Tables } from "@/services/supabase/database.types";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  Copy,
  FileText,
  Globe2,
  Layers3,
  LineChart,
  Languages,
  MapPin,
  PenTool,
  Phone,
  PlusCircle,
  Rocket,
  Save,
  Scale,
  Sparkles,
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

const MetricCard = ({
  hint,
  icon: Icon,
  label,
  value,
}: {
  hint: string;
  icon: typeof LineChart;
  label: string;
  value: string | number;
}) => (
  <Surface className="h-full p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="font-display text-3xl font-semibold tracking-[-0.045em] text-foreground">
          {value}
        </div>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="mt-4 text-sm leading-6 text-muted-foreground">{hint}</p>
  </Surface>
);

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [savedToolsCount, setSavedToolsCount] = useState(0);
  const [savedDocuments, setSavedDocuments] = useState<any[]>([]);
  const [savedLegalDrafts, setSavedLegalDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialOnboardingData);
  const [saving, setSaving] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
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
        const [profileRes, businessRes, toolsRes, savedDocumentsRes, savedLegalDraftsRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
          supabase
            .from("businesses")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase.from("saved_tools").select("id", { count: "exact", head: true }).eq("user_id", userId),
          supabase
            .from("user_documents")
            .select("id, title, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(4),
          supabase
            .from("user_legal_documents")
            .select("id, title, status, updated_at")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false })
            .limit(4),
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
        setSavedDocuments(savedDocumentsRes.data ?? []);
        setSavedLegalDrafts(savedLegalDraftsRes.data ?? []);
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

  const persistWorkspace = useCallback(
    async (options: { completeOnboarding?: boolean } = {}) => {
      if (!user) {
        return false;
      }

      const now = new Date().toISOString();
      const profilePayload: Tables<"profiles">["Update"] = {
        full_name: onboardingData.full_name.trim(),
        phone: onboardingData.phone.trim(),
        industry: onboardingData.industry.trim(),
        state: onboardingData.state.trim(),
        business_stage: onboardingData.business_stage,
        preferred_language: onboardingData.preferred_language,
        updated_at: now,
      };

      if (options.completeOnboarding) {
        profilePayload.onboarding_completed = true;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update(profilePayload)
        .eq("user_id", user.id);

      if (profileError) {
        throw profileError;
      }

      const rawBusinessName = onboardingData.business_name.trim();
      const businessName = rawBusinessName || business?.name || "";

      if (business?.id && businessName) {
        const { error: businessError } = await supabase
          .from("businesses")
          .update({
            name: businessName,
            industry: onboardingData.industry.trim(),
            state: onboardingData.state.trim(),
            stage: onboardingData.business_stage,
            updated_at: now,
          })
          .eq("id", business.id)
          .eq("user_id", user.id);

        if (businessError) {
          throw businessError;
        }
      } else if (!business?.id && rawBusinessName) {
        const { error: businessError } = await supabase.from("businesses").insert({
          user_id: user.id,
          name: rawBusinessName,
          industry: onboardingData.industry.trim(),
          state: onboardingData.state.trim(),
          stage: onboardingData.business_stage,
        });

        if (businessError) {
          throw businessError;
        }
      }

      await i18n.changeLanguage(onboardingData.preferred_language);
      await loadDashboardData(user.id);
      return true;
    },
    [business, loadDashboardData, onboardingData, user]
  );

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
      await persistWorkspace({ completeOnboarding: true });
      setShowOnboarding(false);
      toast({ title: t("Welcome to BizHive"), description: t("dashboard.onboarding.saved") });
      localStorage.removeItem("hasSeenDashboardTour");
      startDashboardTour();
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

  const handleProfileSave = async () => {
    setProfileSaving(true);

    try {
      await persistWorkspace();
      toast({
        title: t("Profile updated"),
        description: t("Your dashboard preferences and workspace details have been saved."),
      });
    } catch (error) {
      toast({
        title: t("Error"),
        description:
          error instanceof Error ? error.message : t("Could not save your workspace details."),
        variant: "destructive",
      });
    } finally {
      setProfileSaving(false);
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

    try {
      await navigator.clipboard.writeText(user.id);
      toast({ title: t("Copied!"), description: t("User ID copied to clipboard.") });
    } catch {
      toast({
        title: t("Error"),
        description: t("Could not copy your user ID right now."),
        variant: "destructive",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="page-shell">
        <SiteContainer className="space-y-8">
          <Skeleton className="h-[220px] w-full rounded-[32px]" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-[180px] w-full rounded-[28px]" />
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Skeleton className="h-[520px] w-full rounded-[28px]" />
            <div className="space-y-6">
              <Skeleton className="h-[320px] w-full rounded-[28px]" />
              <Skeleton className="h-[220px] w-full rounded-[28px]" />
            </div>
          </div>
        </SiteContainer>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completion = profileCompletion();
  const businessStage = business?.stage || profile?.business_stage || "idea";
  const firstName = profile?.full_name?.trim()?.split(" ")[0] || t("Founder");
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("Good morning") : hour < 18 ? t("Good afternoon") : t("Good evening");
  const canCloseOnboarding = Boolean(profile?.onboarding_completed);
  const onboardingSteps = [
    t("dashboard.onboarding.stepAboutYou"),
    t("dashboard.onboarding.stepLocation"),
    t("dashboard.onboarding.stepBusiness"),
  ];
  const profileChecks = [
    {
      title: t("Identity"),
      description: t("Full name and contact details are stored for your workspace."),
      ready: Boolean(onboardingData.full_name.trim() && onboardingData.phone.trim()),
    },
    {
      title: t("Language sync"),
      description: t("Your preferred language should follow you across the interface."),
      ready: Boolean(onboardingData.preferred_language),
    },
    {
      title: t("Business profile"),
      description: t("Industry, state, and stage are used to personalize recommended tools."),
      ready: Boolean(onboardingData.industry.trim() && onboardingData.state.trim()),
    },
    {
      title: t("E-signature"),
      description: t("Save a reusable signature now so documents are ready later."),
      ready: Boolean(signaturePreview),
    },
  ];
  const recommendedSteps = profileChecks
    .filter((step) => !step.ready)
    .concat(
      profileChecks.every((step) => step.ready)
        ? [
            {
              title: t("Everything is connected"),
              description: t("Your profile, language preferences, and signature are ready for the next workflow."),
              ready: true,
            },
          ]
        : []
    );

  return (
    <div className="page-shell">
      <Dialog
        open={showOnboarding}
        onOpenChange={(nextOpen) => {
          if (canCloseOnboarding) {
            setShowOnboarding(nextOpen);
          } else if (nextOpen) {
            setShowOnboarding(true);
          }
        }}
      >
        <DialogContent className="overflow-hidden rounded-[32px] border-border/70 bg-background p-0 shadow-[0_36px_100px_rgba(16,12,8,0.26)] sm:max-w-2xl">
          <div className="border-b border-border/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,145,77,0.2),_transparent_42%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent)] px-6 py-6 sm:px-8 sm:py-8">
          <DialogHeader>
            <div className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {t("Workspace setup")}
            </div>
            <DialogTitle className="pt-4 font-display text-3xl font-semibold tracking-[-0.045em]">
              {t("dashboard.onboarding.title")}
            </DialogTitle>
            <DialogDescription className="max-w-xl text-sm leading-6">
              {t("dashboard.onboarding.description")}
            </DialogDescription>
          </DialogHeader>
          </div>

          <div className="space-y-3 px-6 pt-6 sm:px-8">
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

          <form onSubmit={handleOnboarding} className="space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
            {onboardingStep === 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t("dashboard.onboarding.fullName")}</Label>
                  <Input
                    id="full_name"
                    value={onboardingData.full_name}
                    onChange={(event) => updateOnboardingField("full_name", event.target.value)}
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred_language">{t("dashboard.onboarding.language")}</Label>
                  <Select value={onboardingData.preferred_language} onValueChange={(value) => updateOnboardingField("preferred_language", value)}>
                    <SelectTrigger id="preferred_language" className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4">
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
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
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
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
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
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">{t("dashboard.onboarding.industry")}</Label>
                  <Input
                    id="industry"
                    value={onboardingData.industry}
                    onChange={(event) => updateOnboardingField("industry", event.target.value)}
                    placeholder={t("dashboard.onboarding.industryPlaceholder")}
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_stage">{t("dashboard.onboarding.businessStage")}</Label>
                  <Select value={onboardingData.business_stage} onValueChange={(value: BusinessStage) => updateOnboardingField("business_stage", value)}>
                    <SelectTrigger id="business_stage" className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4">
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
              <Button type="submit" disabled={!isCurrentStepValid() || saving} className="min-w-[160px]">
                {saving ? t("Saving...") : onboardingStep === onboardingSteps.length - 1 ? t("dashboard.onboarding.finish") : t("common.next")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <SiteContainer className="space-y-8">
        <PageHeader
          eyebrow={
            <span className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              {t("Workspace")}
            </span>
          }
          title={`${greeting}, ${firstName}`}
          description={t("This is your operating view for profile setup, next actions, and reusable business details. Keep it current and the rest of the product stays sharper.")}
          actions={
            <>
              <Button id="new-plan-btn" onClick={() => navigate("/plan")}>
                <PlusCircle className="h-4 w-4" />
                {t("New Business Plan")}
              </Button>
              <Button variant="outline" onClick={() => setShowOnboarding(true)}>
                {t("Open setup guide")}
              </Button>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div id="business-stage-card">
            <MetricCard
              icon={Rocket}
              label={t("Business Stage")}
              value={t(`dashboard.businessStage.${businessStage}`)}
              hint={business?.name ? business.name : t("We will tailor more recommendations as your workspace fills in.")}
            />
          </div>
          <MetricCard
            icon={FileText}
            label={t("Saved Tools")}
            value={savedToolsCount}
            hint={t("Keep frequently used tools close so your dashboard stays action-oriented.")}
          />
          <MetricCard
            icon={BadgeCheck}
            label={t("Profile Completion")}
            value={`${completion}%`}
            hint={t("Profile quality drives cleaner suggestions, document defaults, and smoother onboarding across the product.")}
          />
          <MetricCard
            icon={PenTool}
            label={t("Signature status")}
            value={signaturePreview ? t("Ready") : t("Pending")}
            hint={signaturePreview ? t("Your latest e-signature is already stored for future use.") : t("Save a typed or drawn signature now so document flows feel complete later.")}
          />
        </div>

        <Surface className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow={t("Quick actions")}
              title={t("Jump into the next important workflow")}
              description={t("These tools are kept prominent because they are the most likely next moves after your workspace is set up.")}
            />
            <Button variant="outline" onClick={() => navigate("/tools")}>
              {t("Explore all tools")}
            </Button>
          </div>

          <div id="quick-actions" className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Market research",
                path: "/plan/market-research",
                description: "Validate demand, map competitors, and shape your first positioning decisions.",
                icon: LineChart,
              },
              {
                title: "Business canvas",
                path: "/tools/business-canvas",
                description: "Organize value proposition, channels, customer segments, and revenue logic in one place.",
                icon: Layers3,
              },
              {
                title: "Financial planning",
                path: "/tools/financial-calculator",
                description: "Estimate runway, pricing, and cash needs before you commit resources to launch.",
                icon: Calculator,
              },
              {
                title: "Legal and documents",
                path: "/documents",
                description: "Keep templates, formal documents, and compliance tasks close to the rest of your workflow.",
                icon: Scale,
              },
            ].map((action) => (
              <button
                key={action.path}
                type="button"
                onClick={() => navigate(action.path)}
                className="group rounded-[26px] border border-border/70 bg-background/70 p-5 text-left transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_36px_rgba(16,12,8,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
                  <action.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {t(action.title)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {t(action.description)}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {t("Open")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </Surface>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Surface className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow={t("Saved library")}
                title={t("Keep saved documents discoverable")}
                description={t("Saving now leads to a visible workspace area, so documents and editable legal drafts are easy to reopen instead of disappearing into the backend.")}
              />
              <Button variant="outline" onClick={() => navigate("/documents")}>
                {t("Open library")}
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-border/70 bg-background/72 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("Saved documents")}</p>
                    <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                      {savedDocuments.length}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {savedDocuments.length > 0 ? (
                    savedDocuments.map((document) => (
                      <button
                        key={document.id}
                        type="button"
                        onClick={() => navigate("/documents")}
                        className="flex w-full items-center justify-between gap-3 rounded-[18px] border border-border/70 bg-muted/20 px-4 py-3 text-left transition-colors hover:bg-muted/40"
                      >
                        <div>
                          <div className="font-medium text-foreground">{document.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(document.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </button>
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-border/70 bg-muted/12 px-4 py-6 text-sm text-muted-foreground">
                      {t("Saved documents will appear here once you bookmark items from the library.")}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-border/70 bg-background/72 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("Legal drafts")}</p>
                    <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                      {savedLegalDrafts.length}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Scale className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {savedLegalDrafts.length > 0 ? (
                    savedLegalDrafts.map((draft) => (
                      <button
                        key={draft.id}
                        type="button"
                        onClick={() => navigate("/legal")}
                        className="flex w-full items-center justify-between gap-3 rounded-[18px] border border-border/70 bg-muted/20 px-4 py-3 text-left transition-colors hover:bg-muted/40"
                      >
                        <div>
                          <div className="font-medium text-foreground">{draft.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {draft.status || t("draft")} · {new Date(draft.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </button>
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-border/70 bg-muted/12 px-4 py-6 text-sm text-muted-foreground">
                      {t("Your editable legal drafts will appear here after you save them from the legal studio.")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Surface>

          <Surface className="p-6 sm:p-8">
            <SectionHeading
              eyebrow={t("System checks")}
              title={t("What the workspace now remembers")}
              description={t("This closes a product gap from earlier phases by making saved state visible instead of only implied through counts or back-end tables.")}
            />

            <div className="mt-6 space-y-4">
              {[
                {
                  title: t("Language preference"),
                  description: t("Your chosen language now follows the interface through local storage, profile sync, and the document shell."),
                  ready: Boolean(profile?.preferred_language),
                },
                {
                  title: t("Saved content visibility"),
                  description: t("Documents and legal drafts are surfaced directly on the dashboard for a more complete return-user flow."),
                  ready: true,
                },
                {
                  title: t("Reusable signature"),
                  description: t("Your signature remains connected to future document workflows through the same workspace state."),
                  ready: Boolean(signaturePreview),
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-[22px] border border-border/70 bg-muted/22 p-4">
                  <div
                    className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                      item.ready ? "bg-emerald-500/12 text-emerald-500" : "bg-amber-500/12 text-amber-500"
                    }`}
                  >
                    {item.ready ? <BadgeCheck className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Surface id="dashboard-header" className="p-6 sm:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-primary/20 bg-primary/8 text-primary">
                      {t(`dashboard.businessStage.${businessStage}`)}
                    </Badge>
                    <Badge variant="outline">{completion}% {t("complete")}</Badge>
                  </div>
                  <div>
                    <h2 className="font-display text-3xl font-semibold tracking-[-0.045em] text-foreground">
                      {t("Profile workspace")}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {t("Edit the details that power your language preference, dashboard context, and business setup across BizHive.")}
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-border/70 bg-muted/35 px-4 py-3 text-sm leading-6 text-muted-foreground">
                  <div className="font-semibold text-foreground">{t("Need a walkthrough?")}</div>
                  <div className="mt-1">
                    {t("Restart the dashboard tour or reopen setup any time you want to revisit the guided flow.")}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        localStorage.removeItem("hasSeenDashboardTour");
                        startDashboardTour();
                      }}
                    >
                      {t("Restart tour")}
                    </Button>
                    <Button size="sm" onClick={() => setShowOnboarding(true)}>
                      {t("Open setup")}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">{t("dashboard.onboarding.fullName")}</Label>
                  <Input
                    id="workspace-name"
                    value={onboardingData.full_name}
                    onChange={(event) => updateOnboardingField("full_name", event.target.value)}
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workspace-phone">{t("dashboard.onboarding.phone")}</Label>
                  <Input
                    id="workspace-phone"
                    value={onboardingData.phone}
                    onChange={(event) => updateOnboardingField("phone", event.target.value)}
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                    placeholder={t("dashboard.onboarding.phonePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workspace-language">{t("dashboard.onboarding.language")}</Label>
                  <Select
                    value={onboardingData.preferred_language}
                    onValueChange={(value) => updateOnboardingField("preferred_language", value)}
                  >
                    <SelectTrigger id="workspace-language" className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4">
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

                <div className="space-y-2">
                  <Label htmlFor="workspace-state">{t("dashboard.onboarding.state")}</Label>
                  <Input
                    id="workspace-state"
                    value={onboardingData.state}
                    onChange={(event) => updateOnboardingField("state", event.target.value)}
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                    placeholder={t("dashboard.onboarding.statePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workspace-industry">{t("dashboard.onboarding.industry")}</Label>
                  <Input
                    id="workspace-industry"
                    value={onboardingData.industry}
                    onChange={(event) => updateOnboardingField("industry", event.target.value)}
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                    placeholder={t("dashboard.onboarding.industryPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workspace-business-name">{t("dashboard.onboarding.businessName")}</Label>
                  <Input
                    id="workspace-business-name"
                    value={onboardingData.business_name}
                    onChange={(event) => updateOnboardingField("business_name", event.target.value)}
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                    placeholder={t("dashboard.onboarding.businessNamePlaceholder")}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="workspace-stage">{t("dashboard.onboarding.businessStage")}</Label>
                  <Select
                    value={onboardingData.business_stage}
                    onValueChange={(value: BusinessStage) => updateOnboardingField("business_stage", value)}
                  >
                    <SelectTrigger id="workspace-stage" className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4">
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
              </div>

              <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm leading-6 text-muted-foreground">
                  {t("Changes here update your profile, current business context, and language preference together.")}
                </div>
                <Button onClick={handleProfileSave} disabled={profileSaving}>
                  <Save className="h-4 w-4" />
                  {profileSaving ? t("Saving...") : t("Save workspace details")}
                </Button>
              </div>
            </div>
          </Surface>

          <div className="space-y-6">
            <Surface className="p-6 sm:p-8">
              <SectionHeading
                eyebrow={t("Focus next")}
                title={t("Keep the fundamentals aligned")}
                description={t("These are the areas that still matter most before you move deeper into tools, documents, and launch flows.")}
              />

              <div className="mt-6 space-y-4">
                {recommendedSteps.map((step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className="flex items-start gap-4 rounded-[22px] border border-border/70 bg-muted/22 p-4"
                  >
                    <div
                      className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                        step.ready ? "bg-emerald-500/12 text-emerald-500" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {step.ready ? <BadgeCheck className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Surface>

            <Surface className="p-6 sm:p-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {t("Workspace details")}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t("Use this small panel for system-level details you may need during support, setup, or document workflows.")}
                  </p>
                </div>

                {[
                  { icon: UserRound, label: t("Full name"), value: profile?.full_name || t("Add your name") },
                  { icon: Phone, label: t("Phone"), value: profile?.phone || t("Add your phone number") },
                  {
                    icon: Languages,
                    label: t("Language"),
                    value: supportedLanguages.find((language) => language.code === profile?.preferred_language)?.name || profile?.preferred_language || t("Choose a language"),
                  },
                  { icon: MapPin, label: t("State"), value: business?.state || profile?.state || t("Add your state") },
                  { icon: Building2, label: t("Business"), value: business?.name || t("Add your business name") },
                  { icon: Globe2, label: t("Location data"), value: profile?.location_data || t("Location sync pending") },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 rounded-[22px] border border-border/70 bg-muted/20 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                      <div className="font-medium text-foreground">{item.value}</div>
                    </div>
                  </div>
                ))}

                <div className="rounded-[22px] border border-border/70 bg-background/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-muted-foreground">{t("User ID")}</div>
                      <div className="mt-1 break-all font-mono text-xs text-foreground">{user.id}</div>
                    </div>
                    <Button variant="outline" size="icon" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Surface>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Surface className="p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-[-0.045em] text-foreground">
                  {t("Profile health")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("This checklist makes empty states obvious so your profile system stays complete and reliable.")}
                </p>
              </div>

              <div className="space-y-4">
                {profileChecks.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-[22px] border border-border/70 bg-muted/20 p-4"
                  >
                    <div
                      className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                        item.ready ? "bg-emerald-500/12 text-emerald-500" : "bg-amber-500/12 text-amber-500"
                      }`}
                    >
                      {item.ready ? <BadgeCheck className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Surface>

          <Surface className="p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="flex items-center gap-2 font-display text-3xl font-semibold tracking-[-0.045em] text-foreground">
                  <PenTool className="h-6 w-6 text-primary" />
                  {t("E-signature")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("Save a signature once and keep it ready for future agreements, templates, and generated documents.")}
                </p>
              </div>

              <Tabs value={signatureDraft.mode} onValueChange={(value) => setSignatureDraft((current) => ({ ...current, mode: value as SignatureMode }))}>
                <TabsList className="grid h-auto w-full grid-cols-2 rounded-[20px] border border-border/70 bg-muted/35 p-1">
                  <TabsTrigger value="draw" className="rounded-2xl py-2.5">{t("Draw")}</TabsTrigger>
                  <TabsTrigger value="type" className="rounded-2xl py-2.5">{t("Type")}</TabsTrigger>
                </TabsList>

                <TabsContent value="draw" className="mt-5 space-y-4">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {t("Draw your signature below. Saving keeps the latest version attached to your profile.")}
                  </p>
                  <SignaturePad onSave={(dataUrl) => setSignatureDraft((current) => ({ ...current, dataUrl }))} />
                </TabsContent>

                <TabsContent value="type" className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signature_text">{t("Signature text")}</Label>
                    <Input
                      id="signature_text"
                      value={signatureDraft.text}
                      onChange={(event) => setSignatureDraft((current) => ({ ...current, text: event.target.value }))}
                      className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                      placeholder={t("Type your name")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signature_font">{t("Signature style")}</Label>
                    <Select value={signatureDraft.fontFamily} onValueChange={(value) => setSignatureDraft((current) => ({ ...current, fontFamily: value }))}>
                      <SelectTrigger id="signature_font" className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4">
                        <SelectValue placeholder={t("Select a signature style")} />
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
                  <div className="rounded-[22px] border border-border/70 bg-muted/24 p-6">
                    <div className="mb-2 text-sm text-muted-foreground">{t("Typed preview")}</div>
                    <div className="min-h-[96px] text-5xl text-foreground" style={{ fontFamily: signatureDraft.fontFamily }}>
                      {signatureDraft.text || t("Your name")}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <div className="text-sm font-medium text-foreground">{t("Saved signature preview")}</div>
                {signaturePreview ? (
                  <img src={signaturePreview} alt="Saved signature" className="mt-3 h-24 w-full rounded-xl border border-border/70 bg-white object-contain p-3" />
                ) : (
                  <EmptyState
                    className="mt-4 border-dashed bg-transparent py-8 shadow-none"
                    icon={<PenTool className="h-5 w-5" />}
                    title={t("No signature saved yet")}
                    description={t("Choose draw or type mode, create your signature, and save it here.")}
                  />
                )}
              </div>

              <Button onClick={saveSignature} disabled={!isSignatureReady || signatureSaving}>
                {signatureSaving ? t("Saving...") : t("Save e-signature")}
              </Button>
            </div>
          </Surface>
        </div>
      </SiteContainer>
    </div>
  );
};

export default Dashboard;
