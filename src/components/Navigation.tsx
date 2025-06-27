
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookOpen, TrendingUp, Scale, FileText, Building, Users, LogIn, Search, Bot } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Plan", href: "/plan", icon: BookOpen },
    { name: "Launch", href: "/launch", icon: TrendingUp },
    { name: "Manage", href: "/manage", icon: Scale },
    { name: "Legal", href: "/legal", icon: FileText },
    { name: "Incubators", href: "/incubators", icon: Building },
    { name: "Community", href: "/community", icon: Users },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Tools", href: "/tools", icon: Search },
  ];

  const isActive = (path: string) => location.pathname === path;

  const BizHiveLogo = () => (
    <div className="flex items-center space-x-2">
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 40 40" className="w-10 h-10">
          <defs>
            <pattern id="honeycomb" x="0" y="0" width="12" height="10.4" patternUnits="userSpaceOnUse">
              <polygon points="6,0 12,3.5 12,7 6,10.4 0,7 0,3.5" fill="#3B82F6" stroke="#1E40AF" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <circle cx="20" cy="20" r="18" fill="url(#honeycomb)"/>
          <circle cx="20" cy="20" r="18" fill="none" stroke="#1E40AF" strokeWidth="2"/>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl text-gray-900">BizHive</span>
        <span className="text-xs text-blue-600">Business Growth Platform</span>
      </div>
    </div>
  );

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <BizHiveLogo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAI(!showAI)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/subscribe">Subscribe</Link>
              </Button>
            </div>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  <div className="border-t pt-4 space-y-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link to="/subscribe">Subscribe</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* AI Assistant Popup */}
      {showAI && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">BizHive AI Assistant</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowAI(false)}>×</Button>
          </div>
          <div className="p-4 h-72 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm">👋 Hi! I'm your BizHive AI assistant. I can help you with:</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Business planning guidance</li>
                  <li>• Legal requirements</li>
                  <li>• Finding the right documents</li>
                  <li>• Navigating the platform</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Try asking: "How do I register my business?" or "What documents do I need for GST?"</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button size="sm">Send</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
