import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import {
  BadgeCheck,
  Bookmark,
  Crown,
  FileSignature,
  FileText,
  Languages,
  Pencil,
  Phone,
  PlayCircle,
  Save,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClayGraphic } from "@/components/ClayGraphic";
import { LoadingState, PageHeader, ScrollSurface, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { PremiumModal } from "@/components/PremiumModal";
import SignaturePad from "@/components/SignaturePad";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supportedLanguages } from "@/i18n";
import { onboardingSetupSteps } from "@/content/product";
import { supabase } from "@/services/supabase/client";
import type { Enums, Tables } from "@/services/supabase/database.types";
import { useTranslation } from "react-i18next";

type Profile = Tables<"profiles">;
type Business = Tables<"businesses">;
type BusinessStage = Enums<"business_stage">;

type WorkspaceForm = {
  business_name: string;
  business_stage: BusinessStage;
  full_name: string;
  industry: string;
  phone: string;
  preferred_language: string;
  signature_data_url: string;
  signature_mode: string;
  signature_text: string;
  state: string;
};

const defaultForm: WorkspaceForm = {
  business_name: "",
  business_stage: "idea",
  full_name: "",
  industry: "",
  phone: "",
  preferred_language: "en",
  signature_data_url: "",
  signature_mode: "draw",
  signature_text: "",
  state: "",
};

const stageOptions: BusinessStage[] = ["idea", "planning", "launching", "growing", "scaling"];

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [form, setForm] = useState<WorkspaceForm>(defaultForm);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [savedToolsCount, setSavedToolsCount] = useState(0);
  const [savedDocuments, setSavedDocuments] = useState<Array<{ id: string; title: string; updated_at?: string | null }>>([]);
  const [savedLegalDrafts, setSavedLegalDrafts] = useState<Array<{ id: string; title: string; updated_at?: string | null }>>([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      const [profileRes, businessRes, toolsRes, documentsRes, legalRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("saved_tools").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("user_documents").select("id,title,updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(6),
        supabase.from("user_legal_documents").select("id,title,updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(6),
      ]);

      const nextProfile = profileRes.data ?? null;
      const nextBusiness = businessRes.data ?? null;

      setProfile(nextProfile);
      setBusiness(nextBusiness);
      setSavedToolsCount(toolsRes.count ?? 0);
      setSavedDocuments(documentsRes.data ?? []);
      setSavedLegalDrafts(legalRes.data ?? []);
      setForm({
        full_name: nextProfile?.full_name || user.user_metadata?.full_name || "",
        phone: nextProfile?.phone || "",
        preferred_language: nextProfile?.preferred_language || i18n.resolvedLanguage || "en",
        state: nextProfile?.state || nextBusiness?.state || "",
        industry: nextProfile?.industry || nextBusiness?.industry || "",
        business_name: nextBusiness?.name || "",
        business_stage: nextProfile?.business_stage || nextBusiness?.stage || "idea",
        signature_data_url: nextProfile?.signature_data_url || "",
        signature_mode: nextProfile?.signature_mode || "draw",
        signature_text: nextProfile?.signature_text || nextProfile?.full_name || "",
      });
      setLoading(false);
    };

    void loadData();
  }, [i18n.resolvedLanguage, user]);

  const completion = useMemo(() => {
    const values = [form.full_name, form.phone, form.state, form.industry, form.business_name, form.signature_data_url || form.signature_text];
    const completed = values.filter((value) => value.trim().length > 0).length;
    return Math.round((completed / values.length) * 100);
  }, [form]);

  const saveWorkspace = async () => {
    if (!user) {
      return;
    }

    setSaving(true);

    const profilePayload = {
      user_id: user.id,
      full_name: form.full_name,
      phone: form.phone,
      preferred_language: form.preferred_language,
      state: form.state,
      industry: form.industry,
      business_stage: form.business_stage,
      onboarding_completed: true,
      signature_data_url: form.signature_mode === "draw" ? form.signature_data_url || null : null,
      signature_mode: form.signature_mode,
      signature_text: form.signature_mode === "type" ? form.signature_text : null,
      updated_at: new Date().toISOString(),
    };

    const businessPayload = {
      user_id: user.id,
      name: form.business_name || "My business",
      state: form.state || null,
      industry: form.industry || null,
      stage: form.business_stage,
      updated_at: new Date().toISOString(),
    };

    const profileQuery = profile?.id
      ? supabase.from("profiles").update(profilePayload).eq("id", profile.id)
      : supabase.from("profiles").insert(profilePayload);

    const businessQuery = business?.id
      ? supabase.from("businesses").update(businessPayload).eq("id", business.id)
      : supabase.from("businesses").insert(businessPayload);

    const [profileResult, businessResult] = await Promise.all([profileQuery, businessQuery]);

    if (profileResult.error || businessResult.error) {
      toast({
        title: "Save failed",
        description: profileResult.error?.message || businessResult.error?.message || "Unable to save workspace.",
        variant: "destructive",
      });
    } else {
      await i18n.changeLanguage(form.preferred_language);
      setEditing(false);
      toast({ title: "Workspace updated", description: "Your profile, signature, and business context are up to date." });
    }

    setSaving(false);
  };

  const openWalkthrough = () => {
    const walkthrough = driver({
      showProgress: true,
      steps: [
        {
          element: "[data-tour='profile-summary']",
          popover: {
            title: "Profile summary",
            description: "This is your view-first workspace card. Use the edit toggle only when you actually want to change details.",
          },
        },
        {
          element: "[data-tour='saved-library']",
          popover: {
            title: "Saved library",
            description: "Your latest saved tools, documents, and legal drafts should always be easy to reopen from here.",
          },
        },
        {
          element: "[data-tour='signature-panel']",
          popover: {
            title: "Signature panel",
            description: "Save a typed or drawn signature once and reuse it across legal workflows later.",
          },
        },
        {
          element: "[data-tour='premium-preview']",
          popover: {
            title: "Premium preview",
            description: "This shows future premium value without blocking the free learning and workflow experience.",
          },
        },
      ],
    });

    walkthrough.drive();
  };

  if (!isLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading || loading) {
    return (
      <div className="page-shell">
        <SiteContainer>
          <LoadingState title="Loading workspace" description="Preparing your founder dashboard, signature panel, and saved library." />
        </SiteContainer>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Founder workspace"
          title="Run the business from one compact dashboard"
          description="Your profile, signature, saved work, premium preview, and next steps stay together in one dashboard so you can return and continue quickly."
          icon={UserRound}
          visual={<ClayGraphic className="h-full min-h-[320px] xl:min-h-[400px]" variant="workspace" />}
          actions={
            <>
              <Button variant="ghost" className="glass-button h-12" onClick={() => setGuideOpen(true)}>
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                Setup guide
              </Button>
              <Button variant="ghost" className="glass-button h-12" onClick={openWalkthrough}>
                <PlayCircle className="mr-2 h-4 w-4 text-primary" />
                Walkthrough
              </Button>
              <Button className="h-12 rounded-2xl px-5" onClick={saveWorkspace} disabled={saving || !editing}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : editing ? "Save workspace" : "Saved"}
              </Button>
            </>
          }
        />

        <section className="workspace-grid">
          <ScrollSurface className="xl:max-h-[calc(100vh-9.5rem)]" data-tour="profile-summary">
            <div className="compact-scroll space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">Profile workspace</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    View your founder details by default, then enter edit mode only when you want to make a deliberate change.
                  </p>
                </div>
                <Button variant="ghost" className="glass-button h-11" onClick={() => setEditing((current) => !current)}>
                  <Pencil className="mr-2 h-4 w-4 text-primary" />
                  {editing ? "Close edit" : "Edit profile"}
                </Button>
              </div>

              {editing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-foreground">Full name</span>
                    <Input value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} className="h-12 rounded-[22px]" />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-foreground">Phone</span>
                    <Input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="h-12 rounded-[22px]" />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-foreground">Preferred language</span>
                    <Select value={form.preferred_language} onValueChange={(value) => setForm((current) => ({ ...current, preferred_language: value }))}>
                      <SelectTrigger className="h-12 rounded-[22px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedLanguages.map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            {language.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-foreground">State</span>
                    <Input value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} className="h-12 rounded-[22px]" />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-foreground">Industry</span>
                    <Input value={form.industry} onChange={(event) => setForm((current) => ({ ...current, industry: event.target.value }))} className="h-12 rounded-[22px]" />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-foreground">Business name</span>
                    <Input value={form.business_name} onChange={(event) => setForm((current) => ({ ...current, business_name: event.target.value }))} className="h-12 rounded-[22px]" />
                  </label>
                  <label className="space-y-2 text-sm sm:col-span-2">
                    <span className="font-semibold text-foreground">Current business stage</span>
                    <Select value={form.business_stage} onValueChange={(value) => setForm((current) => ({ ...current, business_stage: value as BusinessStage }))}>
                      <SelectTrigger className="h-12 rounded-[22px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stageOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Full name", value: form.full_name || "Not set", icon: UserRound },
                    { label: "Phone", value: form.phone || "Not set", icon: Phone },
                    { label: "Language", value: (form.preferred_language || "en").toUpperCase(), icon: Languages },
                    { label: "State", value: form.state || "Not set", icon: BadgeCheck },
                    { label: "Industry", value: form.industry || "Not set", icon: Sparkles },
                    { label: "Business", value: form.business_name || "Not set", icon: Bookmark },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="panel-muted p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-primary/12 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{item.label}</div>
                            <div className="mt-1 font-medium text-foreground">{item.value}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="panel-muted p-4" data-tour="signature-panel">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                    <FileSignature className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">E-signature</div>
                    <p className="mt-1 text-sm leading-7 text-muted-foreground">
                      Save one typed or drawn signature now, then reuse it in legal and document workflows later.
                    </p>
                  </div>
                </div>

                {editing ? (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant={form.signature_mode === "draw" ? "default" : "ghost"}
                        className="rounded-2xl"
                        onClick={() => setForm((current) => ({ ...current, signature_mode: "draw" }))}
                      >
                        Draw
                      </Button>
                      <Button
                        variant={form.signature_mode === "type" ? "default" : "ghost"}
                        className="rounded-2xl"
                        onClick={() => setForm((current) => ({ ...current, signature_mode: "type" }))}
                      >
                        Type
                      </Button>
                    </div>

                    {form.signature_mode === "draw" ? (
                      <SignaturePad onSave={(dataUrl) => setForm((current) => ({ ...current, signature_data_url: dataUrl }))} />
                    ) : (
                      <Input
                        value={form.signature_text}
                        onChange={(event) => setForm((current) => ({ ...current, signature_text: event.target.value }))}
                        placeholder="Type your name as a signature"
                        className="h-12 rounded-[22px]"
                      />
                    )}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[22px] border border-border/70 bg-background/60 p-4">
                    {form.signature_mode === "draw" && form.signature_data_url ? (
                      <img src={form.signature_data_url} alt="Saved signature" className="h-28 w-full rounded-[18px] object-contain bg-white" />
                    ) : (
                      <div className="flex min-h-[112px] items-center rounded-[18px] bg-background/70 px-4 text-3xl italic text-foreground">
                        {form.signature_text || form.full_name || "Signature not saved"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
                <div className="panel-muted p-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Keep everything together
                  </div>
                  <div className="mt-4 font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
                    Keep the founder identity, signature, and saved work in one visible loop.
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Update your workspace when needed, reopen your recent work, and keep your signature ready for documents and compliance tasks.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      "Edit only when needed so the default view stays calm and readable.",
                      "Store your signature once and reuse it across document workflows.",
                      "Reopen your latest work directly from the saved library panel.",
                      "Use the setup guide and walkthrough to onboard without external help.",
                    ].map((item) => (
                      <div key={item} className="rounded-[20px] border border-border/70 bg-background/55 p-4 text-sm leading-7 text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <ClayGraphic className="h-full min-h-[320px]" compact variant="workspace" />
              </div>
            </div>
          </ScrollSurface>

          <div className="grid gap-4">
            <Surface>
              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="panel-muted flex items-center gap-3 p-4">
                  <UserRound className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Profile completion</div>
                    <div className="font-display text-2xl font-semibold text-foreground">{completion}%</div>
                  </div>
                </div>
                <div className="panel-muted flex items-center gap-3 p-4">
                  <Bookmark className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Saved tools</div>
                    <div className="font-display text-2xl font-semibold text-foreground">{savedToolsCount}</div>
                  </div>
                </div>
                <div className="panel-muted flex items-center gap-3 p-4">
                  <Languages className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Language</div>
                    <div className="font-display text-2xl font-semibold text-foreground">{form.preferred_language.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            </Surface>

            <ScrollSurface className="xl:max-h-[19rem]" data-tour="saved-library">
              <div className="compact-scroll space-y-4">
                <div>
                  <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">Saved library</div>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    Reopen your latest tools, documents, and legal drafts without hunting across the product.
                  </p>
                </div>
                <div className="grid gap-3">
                  {savedDocuments.length ? (
                    savedDocuments.map((document) => (
                      <div key={document.id} className="panel-muted flex items-center gap-3 p-4">
                        <FileText className="h-4 w-4 text-primary" />
                        <div className="min-w-0">
                          <div className="truncate font-medium text-foreground">{document.title}</div>
                          <div className="text-sm text-muted-foreground">Saved document</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="panel-muted p-4 text-sm leading-7 text-muted-foreground">
                      Save a document or tool once and it will start appearing here.
                    </div>
                  )}
                </div>
              </div>
            </ScrollSurface>

            <Surface className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">Setup guide</div>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    New users should understand the product quickly without needing an external explanation.
                  </p>
                </div>
                <Button variant="ghost" className="glass-button h-10" onClick={() => setGuideOpen(true)}>
                  Open
                </Button>
              </div>
              <div className="grid gap-3">
                {onboardingSetupSteps.slice(0, 2).map((step, index) => (
                  <div key={step.title} className="panel-muted p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Step {index + 1}</div>
                    <div className="mt-2 font-semibold text-foreground">{step.title}</div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.body}</p>
                  </div>
                ))}
              </div>
            </Surface>

            <div data-tour="premium-preview">
              <PremiumModal
                trigger={
                  <Button variant="ghost" className="glass-button h-14 w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-primary" />
                      Buy premium
                    </span>
                    <span>Preview features</span>
                  </Button>
                }
              />
            </div>

            <ScrollSurface className="xl:max-h-[16rem]">
              <div className="compact-scroll space-y-3">
                <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">Business context</div>
                <div className="panel-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Founder</div>
                  <div className="mt-1 font-medium text-foreground">{form.full_name || "Not set"}</div>
                </div>
                <div className="panel-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Legal drafts</div>
                  <div className="mt-1 font-medium text-foreground">{savedLegalDrafts.length}</div>
                </div>
              </div>
            </ScrollSurface>
          </div>
        </section>

        <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
          <DialogContent className="rounded-[28px] border-border/80 bg-card sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl tracking-[-0.04em]">Setup guide</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 md:grid-cols-2">
              {onboardingSetupSteps.map((step, index) => (
                <div key={step.title} className="panel-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Step {index + 1}</div>
                  <div className="mt-2 font-semibold text-foreground">{step.title}</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </SiteContainer>
    </div>
  );
};

export default Dashboard;
