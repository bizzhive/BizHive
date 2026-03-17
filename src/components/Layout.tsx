
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import BeePanel from "./BeePanel";
import TextSelectionTooltip from "./TextSelectionTooltip";
import { Button } from "@/components/ui/button";
import BeeIcon from "./BeeIcon";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const [beeOpen, setBeeOpen] = useState(false);
  const [beePrefill, setBeePrefill] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const handleAskBee = (text: string) => {
    setBeePrefill(text);
    setBeeOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Floating Bee Button */}
      <Button
        onClick={() => { setBeePrefill(""); setBeeOpen(true); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl hover:shadow-2xl bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0 p-0 hover:scale-110 transition-all duration-300"
        size="icon"
      >
        <BeeIcon className="w-8 h-8" />
      </Button>

      {/* Bee Panel */}
      <BeePanel open={beeOpen} onOpenChange={setBeeOpen} prefillMessage={beePrefill} />

      {/* Text Selection Tooltip */}
      <TextSelectionTooltip onAskBee={handleAskBee} />
    </div>
  );
};

export default Layout;
