import { ReactNode, useState } from "react";
import { MessageSquareMore } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BeePanel from "@/components/BeePanel";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [beeOpen, setBeeOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const hideBeeWidget = pathname === "/ai-assistant";

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />

      {!hideBeeWidget ? (
        <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col items-end gap-3">
          <div className="pointer-events-auto">{beeOpen ? <BeePanel open={beeOpen} onOpenChange={setBeeOpen} /> : null}</div>
          <Button
            onClick={() => setBeeOpen((current) => !current)}
            className="pointer-events-auto h-12 rounded-2xl px-4 shadow-lg"
          >
            <MessageSquareMore className="mr-2 h-4 w-4" />
            {t("layout.beeToggle")}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Layout;
