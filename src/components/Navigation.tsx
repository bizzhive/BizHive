import { useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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
import { useBee } from "@/contexts/BeeContext";

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
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { openFullscreen } = useBee();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel = useMemo(
    () =>
      navLinks.find((link) =>
        link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(`${link.href}/`)
      )?.key,
    [pathname]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/84 backdrop-blur-2xl">
      <SiteContainer className="py-3">
        <div className="nav-shell">
          <Link to="/" className="brand-lockup">
            <div className="brand-mark">
              <BeeIcon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-lg font-semibold text-foreground sm:text-xl">BizHive</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-primary/90">
                {t("brand.tagline")}
              </div>
            </div>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
            <div className="nav-cluster w-full justify-center 2xl:justify-between">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    end={link.href === "/"}
                    className={({ isActive }) =>
                      cn("nav-link", isActive && "nav-link-active")
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t(link.key)}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button variant="ghost" size="icon" className="glass-icon-button" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <div className="hidden items-center gap-2 xl:flex">
              <Button
                variant="ghost"
                className="glass-button h-11"
                onClick={() => openFullscreen()}
              >
                <Bot className="mr-2 h-4 w-4" />
                {t("nav.askBee")}
              </Button>

              {user ? (
                <>
                  <Button asChild variant="ghost" className="glass-button h-11">
                    <Link to="/dashboard">
                      <UserRound className="mr-2 h-4 w-4" />
                      {t("nav.dashboard")}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="glass-button h-11" onClick={signOut}>
                    {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <Button asChild className="h-11 rounded-2xl px-4">
                  <Link to="/login">{t("nav.login")}</Link>
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="glass-icon-button xl:hidden"
              onClick={() => setMobileOpen((current) => !current)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="panel-surface mt-3 p-3 xl:hidden">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {activeLabel ? t(activeLabel) : t("nav.home")}
            </div>
            <div className="grid gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    end={link.href === "/"}
                    className={({ isActive }) =>
                      cn("nav-mobile-link", isActive && "nav-mobile-link-active")
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t(link.key)}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-3 grid gap-2 border-t border-border/60 pt-3">
              <Button
                variant="ghost"
                className="nav-mobile-link justify-start"
                onClick={() => {
                  setMobileOpen(false);
                  openFullscreen();
                }}
              >
                <Bot className="h-4 w-4" />
                <span>{t("nav.askBee")}</span>
              </Button>
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
