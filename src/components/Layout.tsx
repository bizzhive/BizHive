import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import BeePanel from "./BeePanel";
import TextSelectionTooltip from "./TextSelectionTooltip";
import { Button } from "@/components/ui/button";
import BeeIcon from "./BeeIcon";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const [beeOpen, setBeeOpen] = useState(false);
  const [beePrefill, setBeePrefill] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  const handleAskBee = (text: string) => {
    setBeePrefill(text);
    setBeeOpen(true);
  };

  const isAIPage = pathname === "/ai-assistant";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex flex-col relative">
        <div className={`flex-1 flex ${!isMobile && beeOpen && !isAIPage ? "flex-row" : "flex-col"}`}>
          <main className="flex-1 min-w-0">{children}</main>
          
          {!isMobile && beeOpen && !isAIPage && (
            <div className="w-[380px] border-l bg-background flex-shrink-0 flex flex-col h-[calc(100vh-4rem)] sticky top-16">
              <BeePanel open={true} onOpenChange={setBeeOpen} prefillMessage={beePrefill} inline />
            </div>
          )}
        </div>

        {isMobile && beeOpen && !isAIPage && (
          <div className="fixed bottom-0 left-0 right-0 z-50 h-[40vh] border-t bg-background shadow-2xl rounded-t-2xl flex flex-col animate-slide-up">
            <BeePanel open={true} onOpenChange={setBeeOpen} prefillMessage={beePrefill} inline />
          </div>
        )}
      </div>
      <Footer />

      {!beeOpen && !isAIPage && (
        <Button
          onClick={() => { setBeePrefill(""); setBeeOpen(true); }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl hover:shadow-2xl bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0 p-0 hover:scale-110 transition-all duration-300"
          size="icon"
        >
          <BeeIcon className="w-8 h-8" />
        </Button>
      )}

      <TextSelectionTooltip onAskBee={handleAskBee} />
    </div>
  );
};

export default Layout;
