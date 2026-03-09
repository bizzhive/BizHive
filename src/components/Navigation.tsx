
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, X, Moon, Sun, Globe, MessageCircle, LogOut, User } from "lucide-react";
import { useTheme, languages } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AuthButtons = () => {
  const { user, signOut } = useAuth();
  
  if (user) {
    return (
      <>
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard">Dashboard</Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </>
    );
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm">
        <Link to="/login">Login</Link>
      </Button>
      <Button asChild size="sm">
        <Link to="/register">Sign Up</Link>
      </Button>
    </>
  );
};

const MobileAuthButtons = ({ setIsOpen }: { setIsOpen: (v: boolean) => void }) => {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <>
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" 
          onClick={() => {
            signOut();
            setIsOpen(false);
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </>
    );
  }

  return (
    <>
      <Button asChild variant="ghost" className="w-full">
        <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
      </Button>
      <Button asChild className="w-full">
        <Link to="/register" onClick={() => setIsOpen(false)}>Sign Up</Link>
      </Button>
    </>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, language, toggleTheme, setLanguage } = useTheme();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Plan", href: "/plan" },
    { name: "Launch", href: "/launch" },
    { name: "Manage", href: "/manage" },
    { name: "Legal", href: "/legal" },
    { name: "Incubators", href: "/incubators" },
    { name: "Tools", href: "/tools" },
    { name: "Documents", href: "/documents" },
    { name: "Taxation", href: "/taxation" },
    { name: "Blog", href: "/blog" },
    { name: "Community", href: "/community" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 min-w-0 flex-shrink-0">
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <defs>
                  <pattern id="honeycombNav" x="0" y="0" width="8" height="7" patternUnits="userSpaceOnUse">
                    <polygon points="4,0 8,2.3 8,4.7 4,7 0,4.7 0,2.3" fill="#3B82F6" stroke="#60A5FA" strokeWidth="0.3"/>
                  </pattern>
                </defs>
                <circle cx="20" cy="20" r="18" fill="url(#honeycombNav)"/>
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap">BizHive</span>
              <span className="text-xs text-blue-600 dark:text-blue-400 -mt-1 whitespace-nowrap hidden md:block">Business Growth Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1 flex-1 justify-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 dark:text-gray-300"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Language Selector */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[100px] h-9 dark:bg-gray-800 dark:text-white">
                <Globe className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {Object.entries(languages).map(([code, name]) => (
                  <SelectItem key={code} value={code} className="dark:text-white">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* AI Assistant (Desktop) */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden lg:flex items-center space-x-1 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            >
              <Link to="/ai-assistant">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden xl:inline">AI Assistant</span>
              </Link>
            </Button>

            {/* Auth Buttons (Desktop) */}
            <div className="hidden lg:flex items-center space-x-1">
              <AuthButtons />
            </div>

            {/* Mobile Menu Toggle */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 dark:bg-gray-900">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="relative w-8 h-8">
                        <svg viewBox="0 0 32 32" className="w-8 h-8">
                          <defs>
                            <pattern id="honeycombMobile" x="0" y="0" width="8" height="7" patternUnits="userSpaceOnUse">
                              <polygon points="4,0 8,2.3 8,4.7 4,7 0,4.7 0,2.3" fill="#3B82F6" stroke="#60A5FA" strokeWidth="0.3"/>
                            </pattern>
                          </defs>
                          <circle cx="16" cy="16" r="14" fill="url(#honeycombMobile)"/>
                        </svg>
                      </div>
                      <span className="font-bold text-lg dark:text-white">BizHive</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                          isActive(item.href)
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-4 pt-6 border-t dark:border-gray-700">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start dark:bg-gray-800 dark:text-white"
                    >
                      <Link to="/ai-assistant" onClick={() => setIsOpen(false)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        AI Assistant
                      </Link>
                    </Button>
                    
                    <div className="space-y-2">
                      <MobileAuthButtons setIsOpen={setIsOpen} />
                    </div>
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
