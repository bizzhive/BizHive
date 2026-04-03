import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  ClipboardList,
  LogOut,
  Menu,
  Moon,
  Rocket,
  Sun,
  TrendingUp,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import BeeIcon from "./BeeIcon";
import { LanguageSelector } from "./LanguageSelector";
import { SiteContainer } from "@/components/site/SitePrimitives";

type NavItem = {
  description: string;
  href: string;
  name: string;
};

type NavGroup = {
  icon: typeof ClipboardList;
  items: NavItem[];
  labelKey: string;
};

const navGroups: NavGroup[] = [
  {
    labelKey: "nav.plan",
    icon: ClipboardList,
    items: [
      { name: "Learn: Planning", href: "/plan/learn", description: "Core startup planning lessons and business basics." },
      { name: "Business Planning", href: "/plan", description: "Map your direction, positioning, and key decisions." },
      { name: "Market Research", href: "/plan/market-research", description: "Understand customers, demand, and competition." },
      { name: "Business Plan", href: "/plan/business-plan", description: "Shape your investor-ready plan in structured sections." },
    ],
  },
  {
    labelKey: "nav.launch",
    icon: Rocket,
    items: [
      { name: "Learn: Launching", href: "/launch/learn", description: "Get launch-ready with a guided execution checklist." },
      { name: "Launch Checklist", href: "/launch", description: "Move from setup to launch with one clear roadmap." },
      { name: "Legal & Compliance", href: "/legal", description: "Draft, review, and prepare legal documents." },
      { name: "Taxation", href: "/taxation", description: "Understand GST, filing, and practical compliance steps." },
    ],
  },
  {
    labelKey: "nav.grow",
    icon: TrendingUp,
    items: [
      { name: "Learn: Growing", href: "/manage/learn", description: "Operational playbooks for scaling with discipline." },
      { name: "Manage & Scale", href: "/manage", description: "Handle people, processes, and growth systems." },
      { name: "Incubators & Funding", href: "/incubators", description: "Explore schemes, incubators, and funding routes." },
      { name: "Tools", href: "/tools", description: "Use strategic tools for planning, analysis, and finance." },
    ],
  },
  {
    labelKey: "nav.resources",
    icon: BookOpen,
    items: [
      { name: "Documents", href: "/documents", description: "Templates, drafts, and filing-ready resources." },
      { name: "Blog", href: "/blog", description: "Guides, explainers, and product updates." },
      { name: "Community", href: "/community", description: "Founder conversations, shared learnings, and support." },
    ],
  },
];

const quickLinks = [
  { label: "nav.beeAi", href: "/ai-assistant" },
  { label: "nav.contact", href: "/contact" },
];

const matchesPath = (pathname: string, href: string) =>
  href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

const UserProfileMenu = () => {
  const { signOut } = useAuth();
  const { t } = useTranslation();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-11 rounded-2xl border border-border/70 bg-background/75 px-3 text-sm font-semibold text-foreground shadow-sm hover:bg-accent">
            <User className="mr-2 h-4 w-4" />
            {t("nav.profile")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[220px] space-y-1 p-2">
              <NavigationMenuLink asChild>
                <Link
                  to="/dashboard"
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  {t("nav.myProfile")}
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <button
                  onClick={signOut}
                  className="flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("nav.logout")}
                </button>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const activeGroup = useMemo(
    () =>
      navGroups.find((group) =>
        group.items.some((item) => matchesPath(location.pathname, item.href))
      )?.labelKey,
    [location.pathname]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/78 backdrop-blur-2xl">
      <SiteContainer className="py-3">
        <div className="glass-panel flex items-center justify-between gap-3 rounded-[28px] px-4 py-3 sm:px-5">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-2xl px-2 py-1 transition-transform duration-200 hover:scale-[1.01]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 text-white shadow-[0_12px_30px_rgba(255,145,77,0.34)]">
              <BeeIcon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-xl font-semibold leading-none tracking-[-0.04em] text-foreground">
                BizHive
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-primary/85">
                {t("Business Growth Platform")}
              </div>
            </div>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-1 rounded-2xl border border-border/60 bg-muted/35 p-1.5">
                {navGroups.map((group) => {
                  const Icon = group.icon;

                  return (
                    <NavigationMenuItem key={group.labelKey}>
                      <NavigationMenuTrigger
                        className={cn(
                          "h-11 rounded-2xl bg-transparent px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-background hover:text-foreground data-[state=open]:bg-background data-[state=open]:text-foreground",
                          activeGroup === group.labelKey && "bg-background text-foreground shadow-sm"
                        )}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {t(group.labelKey)}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[360px] gap-2 p-3">
                          {group.items.map((item) => (
                            <NavigationMenuLink asChild key={item.href}>
                              <Link
                                to={item.href}
                                className={cn(
                                  "rounded-[22px] border border-transparent bg-background/70 px-4 py-4 transition-all hover:border-border/70 hover:bg-accent/80",
                                  matchesPath(location.pathname, item.href) && "border-border/70 bg-accent/80"
                                )}
                              >
                                <div className="text-sm font-semibold text-foreground">{t(item.name)}</div>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                  {t(item.description)}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                })}
                {quickLinks.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
                          matchesPath(location.pathname, item.href) && "bg-background text-foreground shadow-sm"
                        )}
                      >
                        {item.href === "/ai-assistant" ? <BeeIcon className="mr-2 h-4 w-4" /> : null}
                        {t(item.label)}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button variant="outline" size="icon" onClick={toggleTheme} className="h-11 w-11 rounded-2xl">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            <div className="hidden lg:block">
              {user ? (
                <UserProfileMenu />
              ) : (
                <Button asChild variant="outline" className="h-11 rounded-2xl px-4">
                  <Link to="/login">{t("nav.login")}</Link>
                </Button>
              )}
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl xl:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[min(92vw,420px)] border-border/70 bg-background/96 p-0 shadow-[0_28px_70px_rgba(16,12,8,0.24)]"
              >
                <div className="flex h-full flex-col">
                  <div className="border-b border-border/70 px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 text-white">
                        <BeeIcon className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
                          BizHive
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t("One consistent path from idea to scale.")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
                    {navGroups.map((group) => (
                      <div key={group.labelKey} className="rounded-[24px] border border-border/70 bg-card/60">
                        <button
                          onClick={() => setOpenGroup(openGroup === group.labelKey ? null : group.labelKey)}
                          className="flex w-full items-center justify-between px-4 py-4 text-left"
                        >
                          <span className="text-sm font-semibold text-foreground">{t(group.labelKey)}</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform",
                              openGroup === group.labelKey && "rotate-180"
                            )}
                          />
                        </button>
                        {openGroup === group.labelKey ? (
                          <div className="space-y-1 border-t border-border/60 px-3 py-3">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "block rounded-2xl px-3 py-3 text-sm transition-colors",
                                  matchesPath(location.pathname, item.href)
                                    ? "bg-accent text-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                              >
                                <div className="font-medium">{t(item.name)}</div>
                                <div className="mt-1 text-xs leading-5 text-muted-foreground">
                                  {t(item.description)}
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}

                    <div className="grid gap-2 sm:grid-cols-2">
                      {quickLinks.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center justify-center rounded-[22px] border border-border/70 px-4 py-3 text-sm font-semibold transition-colors",
                            matchesPath(location.pathname, item.href)
                              ? "bg-accent text-foreground"
                              : "bg-card/60 text-foreground hover:bg-accent"
                          )}
                        >
                          {item.href === "/ai-assistant" ? <BeeIcon className="mr-2 h-4 w-4" /> : null}
                          {t(item.label)}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border/70 px-4 py-4">
                    {user ? (
                      <div className="grid gap-2">
                        <Button asChild variant="outline" className="h-11 rounded-2xl">
                          <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                            {t("nav.myProfile")}
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-11 rounded-2xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            signOut();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          {t("nav.logout")}
                        </Button>
                      </div>
                    ) : (
                      <Button asChild className="h-11 w-full rounded-2xl">
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          {t("nav.login")}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </SiteContainer>
    </header>
  );
};

export default Navigation;
