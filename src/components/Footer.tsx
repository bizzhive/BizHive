import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import BeeIcon from "./BeeIcon";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);

    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email });

      if (error) {
        if (error.code === "23505") {
          toast({ title: t("Already subscribed!"), description: t("This email is already on our list.") });
        } else {
          throw error;
        }
      } else {
        toast({ title: t("Subscribed!"), description: t("You'll receive our latest updates.") });
      }

      setEmail("");
    } catch (error: unknown) {
      toast({ title: t("Error"), description: (error as Error).message || t("Failed to subscribe"), variant: "destructive" });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-foreground/95 text-background dark:bg-card dark:text-foreground">
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"></div>
      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <BeeIcon className="h-9 w-9" />
              <div>
                <span className="text-lg font-bold">BizHive</span>
                <p className="text-xs text-primary">{t("Business Growth Platform")}</p>
              </div>
            </div>
            <p className="mb-4 text-sm text-background/70 dark:text-muted-foreground">
              {t("Empowering Indian entrepreneurs with comprehensive resources, tools, and guidance for business success.")}
            </p>
            <div className="space-y-2 text-sm text-background/70 dark:text-muted-foreground">
              <div className="flex items-center space-x-2"><Mail className="h-4 w-4" /><span>bizzhive.support@gmail.com</span></div>
              <div className="flex items-center space-x-2"><Phone className="h-4 w-4" /><span>+91 XXXXX XXXXX</span></div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-primary">{t("Business Journey")}</h3>
            <ul className="space-y-2 text-sm text-background/70 dark:text-muted-foreground">
              <li><Link to="/plan" className="transition-colors hover:text-background dark:hover:text-foreground">{t("Plan Your Business")}</Link></li>
              <li><Link to="/launch" className="transition-colors hover:text-background dark:hover:text-foreground">{t("Launch Your Business")}</Link></li>
              <li><Link to="/manage" className="transition-colors hover:text-background dark:hover:text-foreground">{t("Manage & Scale")}</Link></li>
              <li><Link to="/tools" className="transition-colors hover:text-background dark:hover:text-foreground">{t("Business Tools")}</Link></li>
              <li><Link to="/taxation" className="transition-colors hover:text-background dark:hover:text-foreground">{t("Taxation Guide")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-primary">{t("Resources")}</h3>
            <ul className="space-y-2 text-sm text-background/70 dark:text-muted-foreground">
              <li><Link to="/legal" className="transition-colors hover:text-background dark:hover:text-foreground">{t("Legal Zone")}</Link></li>
              <li><Link to="/documents" className="transition-colors hover:text-background dark:hover:text-foreground">{t("Document Library")}</Link></li>
              <li><Link to="/incubators" className="transition-colors hover:text-background dark:hover:text-foreground">{t("Incubators & Funding")}</Link></li>
              <li><Link to="/community" className="transition-colors hover:text-background dark:hover:text-foreground">{t("Community")}</Link></li>
              <li><Link to="/blog" className="transition-colors hover:text-background dark:hover:text-foreground">{t("Blog")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-primary">{t("Stay Updated")}</h3>
            <p className="mb-4 text-sm text-background/70 dark:text-muted-foreground">{t("Subscribe for the latest business insights.")}</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder={t("Enter your email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-background/20 bg-background/10 text-background placeholder:text-background/50 dark:border-border dark:bg-muted dark:text-foreground"
                required
              />
              <Button type="submit" className="w-full" disabled={subscribing}>
                {subscribing ? t("Subscribing...") : t("Subscribe")}
              </Button>
            </form>
            <div className="mt-4 space-y-3">
              <Button asChild variant="secondary" className="w-full">
                <Link to="/admin">{t("Admin Access")}</Link>
              </Button>
              <Link to="/contact" className="block text-sm text-primary hover:text-primary/80">{t("Contact Us")} -&gt;</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-background/10 pt-8 text-center text-sm text-background/60 dark:border-border dark:text-muted-foreground">
          <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
            <p>&copy; 2026 BizHive. {t("All rights reserved.")}</p>
            <p>{t("Designed & Developed by")} <a href="mailto:ghttushar2002@gmail.com" className="text-primary transition-colors hover:text-primary/80">Tushar Gehlot</a></p>
          </div>
          <div className="mt-4 flex flex-wrap justify-center space-x-4 text-xs">
            <Link to="/privacy" className="hover:text-background dark:hover:text-foreground">{t("Privacy Policy")}</Link>
            <Link to="/terms" className="hover:text-background dark:hover:text-foreground">{t("Terms of Service")}</Link>
            <Link to="/contact" className="hover:text-background dark:hover:text-foreground">{t("Contact")}</Link>
            <Link to="/admin" className="hover:text-background dark:hover:text-foreground">{t("Admin Panel")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
