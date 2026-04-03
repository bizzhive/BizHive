import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import { useTranslation } from "react-i18next";
import BeeIcon from "./BeeIcon";
import { SiteContainer } from "@/components/site/SitePrimitives";

const footerColumns = [
  {
    title: "Journey",
    links: [
      { label: "Plan Your Business", href: "/plan" },
      { label: "Launch Your Business", href: "/launch" },
      { label: "Manage & Scale", href: "/manage" },
      { label: "Business Tools", href: "/tools" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Document Library", href: "/documents" },
      { label: "Legal Zone", href: "/legal" },
      { label: "Incubators & Funding", href: "/incubators" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Community", href: "/community" },
    ],
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubscribing(true);

    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: t("Already subscribed!"),
            description: t("This email is already on our list."),
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: t("Subscribed!"),
          description: t("You'll receive our latest updates."),
        });
      }

      setEmail("");
    } catch (error: unknown) {
      toast({
        title: t("Error"),
        description: (error as Error).message || t("Failed to subscribe"),
        variant: "destructive",
      });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-border/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0),_rgba(255,248,242,0.7)),linear-gradient(180deg,_rgba(37,21,12,0.04),_rgba(37,21,12,0.08))] dark:bg-[linear-gradient(180deg,_rgba(17,11,8,0),_rgba(17,11,8,0.8)),linear-gradient(180deg,_rgba(255,145,77,0.04),_rgba(255,145,77,0.02))]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <SiteContainer className="py-14 sm:py-16">
        <div className="glass-panel grid gap-8 rounded-[32px] p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 text-white shadow-[0_16px_36px_rgba(255,145,77,0.34)]">
                  <BeeIcon className="h-8 w-8" />
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
                    BizHive
                  </div>
                  <p className="text-sm text-primary">{t("Business Growth Platform")}</p>
                </div>
              </div>

              <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                {t("BizHive brings planning, launch, legal, growth, and operating tools into one founder-ready workspace built for Indian businesses.")}
              </p>

              <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    bizzhive.support@gmail.com
                  </div>
                  <p>{t("Support, partnership, and platform questions.")}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    +91 XXXXX XXXXX
                  </div>
                  <p>{t("Business hours support line for founders and teams.")}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                    {t(column.title)}
                  </h3>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                        >
                          {t(link.label)}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-45" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 rounded-[28px] border border-border/70 bg-background/70 p-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {t("Stay Updated")}
              </div>
              <h3 className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
                {t("Keep the whole team informed.")}
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">
                {t("Get product updates, founder guides, and new resource drops without hunting through the platform.")}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder={t("Enter your email")}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                required
              />
              <Button type="submit" className="h-12 w-full rounded-2xl" disabled={subscribing}>
                {subscribing ? t("Subscribing...") : t("Subscribe")}
              </Button>
            </form>

            <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {t("Admin access")}
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {t("The control panel now opens only through the protected admin route.")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 px-1 text-sm text-muted-foreground md:flex-row">
          <p>&copy; 2026 BizHive. {t("All rights reserved.")}</p>
          <p>
            {t("Designed & Developed by")}{" "}
            <a href="mailto:ghttushar2002@gmail.com" className="font-semibold text-primary hover:text-primary/80">
              Tushar Gehlot
            </a>
          </p>
        </div>
      </SiteContainer>
    </footer>
  );
};

export default Footer;
