import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquareText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "./Navigation";
import Footer from "./Footer";
import BeePanel from "./BeePanel";
import TextSelectionTooltip from "./TextSelectionTooltip";
import BeeIcon from "./BeeIcon";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <div className="relative flex-1">
        <main className="min-h-[calc(100vh-5rem)]">{children}</main>

        {!isAIPage ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-end px-3 sm:bottom-5 sm:px-5">
            <div className="pointer-events-auto flex w-full max-w-[420px] flex-col items-end gap-3">
              {beeOpen ? (
                <div
                  className={cn(
                    "w-full overflow-hidden rounded-[30px] border border-primary/20 bg-background/96 shadow-[0_26px_80px_rgba(16,12,8,0.22)] backdrop-blur-2xl",
                    isMobile ? "h-[72vh]" : "h-[min(76vh,720px)]"
                  )}
                >
                  <BeePanel open={true} onOpenChange={setBeeOpen} prefillMessage={beePrefill} />
                </div>
              ) : null}

              <Button
                onClick={() => {
                  setBeePrefill("");
                  setBeeOpen(true);
                }}
                className={cn(
                  "group h-auto w-full rounded-[26px] border border-primary/25 bg-[linear-gradient(135deg,_rgba(255,167,90,0.95),_rgba(244,107,43,0.96))] px-4 py-3 text-left text-white shadow-[0_18px_50px_rgba(244,107,43,0.34)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(244,107,43,0.4)] sm:max-w-[320px]",
                  beeOpen && "hidden"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/18 backdrop-blur">
                    <BeeIcon className="h-7 w-7" />
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg font-semibold tracking-[-0.04em]">
                        Ask Bee
                      </span>
                      <Sparkles className="h-4 w-4 opacity-90" />
                    </div>
                    <p className="mt-1 text-xs leading-5 text-white/90 sm:text-sm">
                      Business guidance, document help, and context-aware answers from anywhere.
                    </p>
                  </div>
                  <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-white/18 sm:flex">
                    <MessageSquareText className="h-5 w-5" />
                  </div>
                </div>
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
      <TextSelectionTooltip onAskBee={handleAskBee} />
    </div>
  );
};

export default Layout;
