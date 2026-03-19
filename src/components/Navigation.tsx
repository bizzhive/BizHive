import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, Moon, Sun, LogOut, ChevronDown, User, ClipboardList, Rocket, TrendingUp, BookOpen } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import BeeIcon from "./BeeIcon";
import LanguageSelector from "./LanguageSelector";

const navGroups = [
  {
    labelKey: "nav.plan",
    icon: ClipboardList,
    items: [
      { name: "Learn: Planning", href: "/plan/learn", desc: "Planning fundamentals" },
      { name: "Business Planning", href: "/plan", desc: "Create your roadmap" },
      { name: "Market Research", href: "/plan/market-research", desc: "Industry insights & analysis" },
      { name: "Business Plan", href: "/plan/business-plan", desc: "Write a winning plan" },
      { name: "Business Canvas", href: "/tools/business-canvas", desc: "Visual business model" },
    ],
  },
  {
    labelKey: "nav.launch",
    icon: Rocket,
    items: [
      { name: "Learn: Launching", href: "/launch/learn", desc: "Launch fundamentals" },
      { name: "Launch Checklist", href: "/launch", desc: "Step-by-step launch guide" },
      { name: "Legal & Compliance", href: "/legal", desc: "Registrations & licenses" },
      { name: "Taxation", href: "/taxation", desc: "Tax planning & GST" },
    ],
  },
  {
    labelKey: "nav.grow",
    icon: TrendingUp,
    items: [
      { name: "Learn: Growing", href: "/manage/learn", desc: "Growth fundamentals" },
      { name: "Manage & Scale", href: "/manage", desc: "Operations & growth" },
      { name: "Incubators & Funding", href: "/incubators", desc: "Find the right incubator" },
      { name: "SWOT Analysis", href: "/tools/swot-analysis", desc: "Strengths & weaknesses" },
      { name: "All Tools", href: "/tools", desc: "Calculators & frameworks" },
    ],
  },
  {
    labelKey: "nav.resources",
    icon: BookOpen,
    items: [
      { name: "Documents", href: "/documents", desc: "Templates & forms" },
      { name: "Blog", href: "/blog", desc: "Articles & guides" },
      { name: "Community", href: "/community", desc: "Forums & networking" },
    ],
  },
];

const UserProfileMenu = () => {
  const { signOut } = useAuth();
  const { t } = useTranslation();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-sm font-medium text-muted-foreground hover:text-foreground data-[state=open]:text-foreground">
            <User className="h-4 w-4 mr-1.5" />
            {t("nav.profile")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-1 p-3">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/dashboard" className="block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent">
                    {t("nav.myProfile")}
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <button onClick={signOut} className="flex items-center w-full select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("nav.logout")}
                  </button>
                </NavigationMenuLink>
              </li>
            </ul>
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group">
            <BeeIcon className="w-9 h-9 group-hover:scale-110 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground leading-tight">BizHive</span>
              <span className="text-[10px] text-primary -mt-0.5 hidden sm:block font-medium">Business Growth Platform</span>
            </div>
          </Link>

          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-0.5">
                {navGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <NavigationMenuItem key={group.labelKey}>
                      <NavigationMenuTrigger className="bg-transparent text-sm font-medium text-muted-foreground hover:text-foreground data-[state=open]:text-foreground">
                        <Icon className="h-4 w-4 mr-1.5" />
                        {t(group.labelKey)}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[320px] gap-1 p-3">
                          {group.items.map((item) => (
                            <li key={item.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={item.href}
                                  className={cn(
                                    "block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent",
                                    isActive(item.href) && "bg-accent text-accent-foreground"
                                  )}
                                >
                                  <div className="text-sm font-medium leading-none mb-1">{item.name}</div>
                                  <p className="text-xs leading-snug text-muted-foreground">{item.desc}</p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                })}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/ai-assistant"
                      className={cn(
                        "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive("/ai-assistant") && "bg-accent text-accent-foreground"
                      )}
                    >
                      <BeeIcon className="w-4 h-4 mr-1.5" />
                      {t("nav.beeAi")}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/contact"
                      className={cn(
                        "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive("/contact") && "bg-accent text-accent-foreground"
                      )}
                    >
                      {t("nav.contact")}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-1.5">
            <LanguageSelector />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="w-9 h-9">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            <div className="hidden lg:flex items-center gap-1.5">
              {user ? (
                <UserProfileMenu />
              ) : (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">{t("nav.login")}</Link>
                </Button>
              )}
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-6 pt-2">
                    <BeeIcon className="w-8 h-8" />
                    <span className="font-bold text-lg">BizHive</span>
                  </div>

                  <div className="flex-1 space-y-1">
                    {navGroups.map((group) => (
                      <div key={group.labelKey}>
                        <button
                          onClick={() => setOpenGroup(openGroup === group.labelKey ? null : group.labelKey)}
                          className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-foreground rounded-lg hover:bg-accent transition-colors"
                        >
                          {t(group.labelKey)}
                          <ChevronDown className={cn("h-4 w-4 transition-transform", openGroup === group.labelKey && "rotate-180")} />
                        </button>
                        {openGroup === group.labelKey && (
                          <div className="ml-3 space-y-0.5 animate-fade-in">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "block px-3 py-2 text-sm rounded-lg transition-colors",
                                  isActive(item.href)
                                    ? "bg-accent text-accent-foreground font-medium"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <Link
                      to="/ai-assistant"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors",
                        isActive("/ai-assistant") ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent"
                      )}
                    >
                      <BeeIcon className="w-4 h-4" /> {t("nav.beeAi")}
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors",
                        isActive("/contact") ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent"
                      )}
                    >
                      {t("nav.contact")}
                    </Link>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    {user ? (
                      <>
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/dashboard" onClick={() => setIsOpen(false)}>{t("nav.myProfile")}</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full text-destructive hover:text-destructive"
                          onClick={() => { signOut(); setIsOpen(false); }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          {t("nav.logout")}
                        </Button>
                      </>
                    ) : (
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/login" onClick={() => setIsOpen(false)}>{t("nav.login")}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
