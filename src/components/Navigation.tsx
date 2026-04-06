import { useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import BeeIcon from "@/components/BeeIcon";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SiteContainer } from "@/components/site/SitePrimitives";
import { useTranslation } from "react-i18next";

const navLinks = [
  { href: "/", key: "nav.home" },
  { href: "/plan", key: "nav.plan" },
  { href: "/launch", key: "nav.launch" },
  { href: "/manage", key: "nav.grow" },
  { href: "/tools", key: "nav.tools" },
  { href: "/documents", key: "nav.library" },
  { href: "/community", key: "nav.community" },
  { href: "/blog", key: "nav.blog" },
  { href: "/contact", key: "nav.contact" },
];

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-2xl px-3 py-2 text-sm font-semibold transition-colors",
    isActive
      ? "bg-foreground text-background"
      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
  );

const Navigation = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel = useMemo(
    () =>
      navLinks.find((link) =>
        link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(`${link.href}/`)
      )?.key,
    [pathname]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <SiteContainer className="py-3">
        <div className="panel-surface flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <BeeIcon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-lg font-semibold text-foreground sm:text-xl">BizHive</div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {t("brand.tagline")}
                </div>
              </div>
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-1 rounded-[22px] border border-border/80 bg-muted/35 p-1">
              {navLinks.map((link) => (
                <NavLink key={link.href} to={link.href} end={link.href === "/"} className={linkClassName}>
                  {t(link.key)}
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl border border-border/80" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <div className="hidden items-center gap-2 lg:flex">
              {user ? (
                <>
                  <Button asChild variant="ghost" className="h-10 rounded-2xl border border-border/80 px-3">
                    <Link to="/dashboard">
                      <UserRound className="mr-2 h-4 w-4" />
                      {t("nav.dashboard")}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="h-10 rounded-2xl border border-border/80 px-3" onClick={signOut}>
                    {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <Button asChild className="h-10 rounded-2xl px-4">
                  <Link to="/login">{t("nav.login")}</Link>
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-2xl border border-border/80 lg:hidden"
              onClick={() => setMobileOpen((current) => !current)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="panel-surface mt-3 space-y-3 p-3 lg:hidden">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {activeLabel ? t(activeLabel) : t("nav.home")}
            </div>
            <div className="grid gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === "/"}
                  className={({ isActive }) =>
                    cn(
                      "rounded-2xl px-3 py-3 text-sm font-semibold",
                      isActive ? "bg-foreground text-background" : "bg-muted/40 text-foreground"
                    )
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {t(link.key)}
                </NavLink>
              ))}
            </div>

            <div className="grid gap-2 pt-2">
              {user ? (
                <>
                  <Button asChild variant="ghost" className="justify-start rounded-2xl border border-border/80">
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                      {t("nav.dashboard")}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-2xl border border-border/80" onClick={signOut}>
                    {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <Button asChild className="justify-start rounded-2xl">
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
