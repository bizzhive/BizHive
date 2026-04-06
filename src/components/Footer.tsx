import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import { AdminAccessDialog } from "@/components/admin/AdminAccessDialog";
import BeeIcon from "@/components/BeeIcon";
import { useTranslation } from "react-i18next";

const footerGroups = [
  {
    titleKey: "footer.product",
    links: [
      { href: "/plan", labelKey: "nav.plan" },
      { href: "/launch", labelKey: "nav.launch" },
      { href: "/manage", labelKey: "nav.grow" },
      { href: "/tools", labelKey: "nav.tools" },
    ],
  },
  {
    titleKey: "footer.library",
    links: [
      { href: "/documents", labelKey: "nav.library" },
      { href: "/community", labelKey: "nav.community" },
      { href: "/blog", labelKey: "nav.blog" },
      { href: "/contact", labelKey: "nav.contact" },
    ],
  },
  {
    titleKey: "footer.legal",
    links: [
      { href: "/privacy", labelKey: "legal.privacy.title" },
      { href: "/terms", labelKey: "legal.terms.title" },
      { href: "/cookies", labelKey: "legal.cookies.title" },
      { href: "/disclaimer", labelKey: "legal.disclaimer.title" },
    ],
  },
];

const Footer = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubscribing(true);

    const { error } = await supabase.from("newsletter_subscribers").insert({ email });

    if (error && error.code !== "23505") {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({
        title: error?.code === "23505" ? t("footer.alreadySubscribed") : t("footer.subscribed"),
        description:
          error?.code === "23505" ? t("footer.alreadySubscribedNote") : t("footer.subscribedNote"),
      });
      setEmail("");
    }

    setSubscribing(false);
  };

  return (
    <footer className="border-t border-border/70 py-10 sm:py-12">
      <SiteContainer className="space-y-6">
        <Surface className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <BeeIcon className="h-7 w-7" />
                </div>
                <div>
                  <div className="font-display text-2xl font-semibold text-foreground">BizHive</div>
                  <div className="text-sm text-muted-foreground">{t("brand.description")}</div>
                </div>
              </div>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                {t("footer.description")}
              </p>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                bizzhive.support@gmail.com
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              {footerGroups.map((group) => (
                <div key={group.titleKey}>
                  <div className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {t(group.titleKey)}
                  </div>
                  <div className="grid gap-2">
                    {group.links.map((link) => (
                      <Link key={link.href} to={link.href} className="text-sm font-medium text-foreground hover:text-primary">
                        {t(link.labelKey)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t("footer.updates")}
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                {t("footer.ctaTitle")}
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">{t("footer.ctaBody")}</p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("footer.emailPlaceholder")}
                className="h-12 rounded-2xl border-border/80 bg-muted/40"
                required
              />
              <Button type="submit" className="h-12 w-full rounded-2xl" disabled={subscribing}>
                {subscribing ? t("common.saving") : t("footer.subscribe")}
              </Button>
            </form>

            <AdminAccessDialog
              title={t("footer.adminTitle")}
              description={t("footer.adminBody")}
              onSuccess={() => navigate("/admin")}
              trigger={
                <Button variant="ghost" className="h-12 w-full justify-between rounded-2xl border border-border/80">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    {t("footer.adminTitle")}
                  </span>
                  {t("footer.adminAction")}
                </Button>
              }
            />
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
