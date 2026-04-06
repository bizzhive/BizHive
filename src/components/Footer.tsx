import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useToast } from "@/hooks/use-toast";
import { AdminAccessDialog } from "@/components/admin/AdminAccessDialog";
import BeeIcon from "@/components/BeeIcon";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { getFeedbackForUser, saveFeedbackForUser } from "@/services/feedback";
import { PremiumModal } from "@/components/PremiumModal";

const footerGroups = [
  {
    titleKey: "footer.product",
    links: [
      { href: "/plan", labelKey: "nav.plan" },
      { href: "/launch", labelKey: "nav.launch" },
      { href: "/manage", labelKey: "nav.grow" },
      { href: "/tools", labelKey: "nav.tools" },
      { href: "/incubators", labelKey: "nav.incubators" },
    ],
  },
  {
    titleKey: "footer.explore",
    links: [
      { href: "/documents", labelKey: "nav.library" },
      { href: "/community", labelKey: "nav.community" },
      { href: "/blog", labelKey: "nav.blog" },
      { href: "/ai-assistant", labelKey: "nav.bee" },
      { href: "/contact", labelKey: "nav.contact" },
    ],
  },
  {
    titleKey: "footer.legal",
    links: [
      { href: "/privacy", labelKey: "legal.privacy.title" },
      { href: "/terms", labelKey: "legal.terms.title" },
      { href: "/cookies", labelKey: "legal.cookies.title" },
      { href: "/refund-policy", labelKey: "legal.refund.title" },
      { href: "/disclaimer", labelKey: "legal.disclaimer.title" },
    ],
  },
] as const;

const defaultFeedback = {
  display_name: "",
  profession: "",
  rating: 5,
  feedback: "",
};

const Footer = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState(defaultFeedback);
  const [saving, setSaving] = useState(false);
  const [locked, setLocked] = useState(false);
  const [hasExistingFeedback, setHasExistingFeedback] = useState(false);

  useEffect(() => {
    if (!user) {
      setFeedback(defaultFeedback);
      setLocked(false);
      setHasExistingFeedback(false);
      return;
    }

    void getFeedbackForUser(user.id).then((entry) => {
      if (!entry) {
        setFeedback({
          display_name: user.user_metadata?.full_name || "",
          profession: "",
          rating: 5,
          feedback: "",
        });
        setLocked(false);
        setHasExistingFeedback(false);
        return;
      }

      setFeedback({
        display_name: entry.display_name,
        profession: entry.profession,
        rating: entry.rating,
        feedback: entry.feedback,
      });
      setLocked(entry.is_locked);
      setHasExistingFeedback(true);
    });
  }, [user]);

  const handleFeedbackSave = async () => {
    if (!user) {
      toast({ title: t("feedback.loginTitle"), description: t("feedback.loginBody"), variant: "destructive" });
      return;
    }

    if (!feedback.display_name.trim() || !feedback.profession.trim() || !feedback.feedback.trim()) {
      toast({ title: t("feedback.missingTitle"), description: t("feedback.missingBody"), variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const result = await saveFeedbackForUser(user.id, feedback);
      setLocked(result.is_locked);
      setHasExistingFeedback(true);
      toast({
        title: t("feedback.savedTitle"),
        description: result.is_locked ? t("feedback.lockedBody") : t("feedback.savedBody"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : t("feedback.failedBody"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <footer className="border-t border-border/60 py-8 sm:py-10">
      <SiteContainer className="space-y-5">
        <Surface className="grid gap-5 xl:grid-cols-[0.85fr_0.75fr_0.75fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="brand-mark">
                <BeeIcon className="h-7 w-7" />
              </div>
              <div>
                <div className="font-display text-2xl font-semibold text-foreground">BizHive</div>
                <div className="text-sm text-muted-foreground">{t("brand.description")}</div>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-muted-foreground">{t("footer.description")}</p>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              bizzhive.support@gmail.com
            </div>

            <div className="flex flex-wrap gap-3">
              <PremiumModal
                trigger={
                  <Button variant="ghost" className="glass-button h-11">
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    {t("premium.cta")}
                  </Button>
                }
              />
              <AdminAccessDialog
                title={t("footer.adminTitle")}
                description={t("footer.adminBody")}
                onSuccess={() => navigate("/admin")}
                trigger={
                  <Button variant="ghost" className="glass-button h-11">
                    <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                    {t("footer.adminTitle")}
                  </Button>
                }
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 xl:col-span-1">
            {footerGroups.map((group) => (
              <div key={group.titleKey}>
                <div className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t(group.titleKey)}
                </div>
                <div className="grid gap-2">
                  {group.links.map((link) => (
                    <Link key={link.href} to={link.href} className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                      {t(link.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="panel-muted space-y-4 p-5">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("feedback.eyebrow")}</div>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">{t("feedback.title")}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{t("feedback.description")}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={feedback.display_name}
                onChange={(event) => setFeedback((current) => ({ ...current, display_name: event.target.value }))}
                placeholder={t("feedback.fields.name")}
                className="h-11 rounded-2xl"
                disabled={locked}
              />
              <Input
                value={feedback.profession}
                onChange={(event) => setFeedback((current) => ({ ...current, profession: event.target.value }))}
                placeholder={t("feedback.fields.profession")}
                className="h-11 rounded-2xl"
                disabled={locked}
              />
            </div>

            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1;
                const active = value <= feedback.rating;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => !locked && setFeedback((current) => ({ ...current, rating: value }))}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background/70 transition-colors hover:bg-accent/70 disabled:cursor-not-allowed"
                    disabled={locked}
                  >
                    <Star className={active ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-muted-foreground"} />
                  </button>
                );
              })}
            </div>

            <Textarea
              value={feedback.feedback}
              onChange={(event) => setFeedback((current) => ({ ...current, feedback: event.target.value }))}
              placeholder={t("feedback.fields.feedback")}
              className="min-h-[120px] rounded-[22px]"
              disabled={locked}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs leading-5 text-muted-foreground">
                {locked
                  ? t("feedback.lockedNote")
                  : hasExistingFeedback
                    ? t("feedback.editNote")
                    : t("feedback.firstNote")}
              </p>
              <Button className="h-11 rounded-2xl px-4" disabled={saving || locked} onClick={handleFeedbackSave}>
                {saving ? t("common.saving") : hasExistingFeedback ? t("feedback.updateAction") : t("feedback.submitAction")}
              </Button>
            </div>
          </div>
        </Surface>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{t("footer.copyright")}</span>
          <span>{t("footer.builder")}</span>
        </div>
      </SiteContainer>
    </footer>
  );
};

export default Footer;
