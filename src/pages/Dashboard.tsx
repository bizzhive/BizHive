import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Bookmark, FileText, Languages, Phone, Save, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingState, PageHeader, ScrollSurface, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import { supportedLanguages } from "@/i18n";
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
  state: string;
};

const defaultForm: WorkspaceForm = {
  business_name: "",
  business_stage: "idea",
  full_name: "",
  industry: "",
  phone: "",
  preferred_language: "en",
  state: "",
};

const stageOptions: BusinessStage[] = ["idea", "planning", "launching", "growing", "scaling"];

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      });
      setLoading(false);
    };

    void loadData();
  }, [i18n.resolvedLanguage, user]);

  const completion = useMemo(() => {
    const values = [form.full_name, form.phone, form.state, form.industry, form.business_name];
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
        title: t("common.error"),
        description: profileResult.error?.message || businessResult.error?.message || "Unable to save workspace.",
        variant: "destructive",
      });
    } else {
      await i18n.changeLanguage(form.preferred_language);
      toast({ title: "Workspace saved", description: "Your dashboard details are up to date." });
    }

    setSaving(false);
  };

  if (!isLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading || loading) {
    return (
      <div className="page-shell">
        <SiteContainer>
          <LoadingState title={t("common.loading")} description="Preparing your saved workspace." />
        </SiteContainer>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow={t("dashboard.eyebrow")}
          title={t("dashboard.title")}
          description={t("dashboard.description")}
          actions={
            <Button className="h-12 rounded-2xl px-5" onClick={saveWorkspace} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? t("common.saving") : t("dashboard.saveAction")}
            </Button>
          }
        />

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <ScrollSurface className="lg:h-[34rem]">
            <div className="space-y-5 compact-scroll">
              <div className="space-y-2">
                <div className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
                  {t("dashboard.profileTitle")}
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{t("dashboard.profileBody")}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="font-semibold text-foreground">Full name</span>
                  <Input value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} className="h-12 rounded-2xl" />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-semibold text-foreground">Phone</span>
                  <Input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="h-12 rounded-2xl" />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-semibold text-foreground">Preferred language</span>
                  <Select value={form.preferred_language} onValueChange={(value) => setForm((current) => ({ ...current, preferred_language: value }))}>
                    <SelectTrigger className="h-12 rounded-2xl">
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
                  <Input value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} className="h-12 rounded-2xl" />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-semibold text-foreground">Industry</span>
                  <Input value={form.industry} onChange={(event) => setForm((current) => ({ ...current, industry: event.target.value }))} className="h-12 rounded-2xl" />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-semibold text-foreground">Business name</span>
                  <Input value={form.business_name} onChange={(event) => setForm((current) => ({ ...current, business_name: event.target.value }))} className="h-12 rounded-2xl" />
                </label>
                <label className="space-y-2 text-sm sm:col-span-2">
                  <span className="font-semibold text-foreground">Current business stage</span>
                  <Select value={form.business_stage} onValueChange={(value) => setForm((current) => ({ ...current, business_stage: value as BusinessStage }))}>
                    <SelectTrigger className="h-12 rounded-2xl">
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
            </div>
          </ScrollSurface>

          <div className="grid gap-5">
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

            <ScrollSurface className="lg:h-[16rem]">
              <div className="space-y-4 compact-scroll">
                <div>
                  <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{t("dashboard.savedTitle")}</div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("dashboard.savedBody")}</p>
                </div>
                <div className="grid gap-3">
                  {savedDocuments.length ? (
                    savedDocuments.map((document) => (
                      <div key={document.id} className="panel-muted flex items-center gap-3 p-3">
                        <FileText className="h-4 w-4 text-primary" />
                        <div className="min-w-0">
                          <div className="truncate font-medium text-foreground">{document.title}</div>
                          <div className="text-sm text-muted-foreground">Saved document</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No saved documents yet.</div>
                  )}
                </div>
              </div>
            </ScrollSurface>

            <ScrollSurface className="lg:h-[16rem]">
              <div className="space-y-4 compact-scroll">
                <div>
                  <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{t("dashboard.profileSnapshotTitle")}</div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("dashboard.profileSnapshotBody")}</p>
                </div>
                <div className="grid gap-3">
                  <div className="panel-muted flex items-center gap-3 p-3">
                    <UserRound className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Founder</div>
                      <div className="font-medium text-foreground">{form.full_name || "Not set"}</div>
                    </div>
                  </div>
                  <div className="panel-muted flex items-center gap-3 p-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Phone</div>
                      <div className="font-medium text-foreground">{form.phone || "Not set"}</div>
                    </div>
                  </div>
                  <div className="panel-muted flex items-center gap-3 p-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Legal drafts</div>
                      <div className="font-medium text-foreground">{savedLegalDrafts.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollSurface>
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Dashboard;
