import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Bot,
  BookOpen,
  Building2,
  FileText,
  Grid2X2,
  House,
  Mail,
  Menu,
  Moon,
  Rocket,
  Sun,
  TrendingUp,
  UserRound,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import BeeIcon from "@/components/BeeIcon";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SiteContainer } from "@/components/site/SitePrimitives";
import { useTranslation } from "react-i18next";

const navLinks = [
  { href: "/", key: "nav.home", icon: House },
  { href: "/plan", key: "nav.plan", icon: Workflow },
  { href: "/launch", key: "nav.launch", icon: Rocket },
  { href: "/manage", key: "nav.grow", icon: TrendingUp },
  { href: "/tools", key: "nav.tools", icon: Grid2X2 },
  { href: "/incubators", key: "nav.incubators", icon: Building2 },
  { href: "/documents", key: "nav.library", icon: BookOpen },
  { href: "/community", key: "nav.community", icon: Users },
  { href: "/blog", key: "nav.blog", icon: FileText },
  { href: "/ai-assistant", key: "nav.bee", icon: Bot },
  { href: "/contact", key: "nav.contact", icon: Mail },
] as const;

const Navigation = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <SiteContainer className="py-3">
        <div className="nav-shell">
          <Link to="/" className="brand-lockup shrink-0">
            <div className="brand-mark">
              <BeeIcon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-lg font-semibold text-foreground sm:text-xl">BizHive</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-primary/90">{t("brand.tagline")}</div>
            </div>
          </Link>

          <nav className="hidden min-w-0 flex-1 xl:block">
            <div className="compact-scroll overflow-x-auto">
              <div className="nav-cluster min-w-max">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      end={link.href === "/"}
                      className={({ isActive }) => cn("nav-link", isActive && "nav-link-active")}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{t(link.key)}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <LanguageSelector />
            <Button variant="ghost" size="icon" className="glass-icon-button" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              <>
                <Button asChild variant="ghost" className="glass-button h-10">
                  <Link to="/dashboard">
                    <UserRound className="mr-2 h-4 w-4" />
                    {t("nav.dashboard")}
                  </Link>
                </Button>
                <Button variant="ghost" className="glass-button h-10" onClick={signOut}>
                  {t("nav.logout")}
                </Button>
              </>
            ) : (
              <Button asChild className="h-10 rounded-2xl px-4">
                <Link to="/login">{t("nav.login")}</Link>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <LanguageSelector />
            <Button variant="ghost" size="icon" className="glass-icon-button" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="glass-icon-button"
              onClick={() => setMobileOpen((current) => !current)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="panel-surface mt-3 p-3 xl:hidden">
            <div className="grid gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    end={link.href === "/"}
                    className={({ isActive }) => cn("nav-mobile-link", isActive && "nav-mobile-link-active")}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t(link.key)}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-3 grid gap-2 border-t border-border/60 pt-3">
              {user ? (
                <>
                  <Button asChild variant="ghost" className="nav-mobile-link justify-start">
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                      <UserRound className="h-4 w-4" />
                      <span>{t("nav.dashboard")}</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="nav-mobile-link justify-start" onClick={signOut}>
                    {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <Button asChild className="h-11 rounded-2xl justify-start">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    {t("nav.login")}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </SiteContainer>
    </header>
  );
};

export default Navigation;
