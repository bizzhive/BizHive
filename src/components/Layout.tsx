import { ReactNode } from "react";
import { Bot, MessageSquareMore } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BeePanel from "@/components/BeePanel";
import TextSelectionTooltip from "@/components/TextSelectionTooltip";
import { useBee } from "@/contexts/BeeContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { context, copilotOpen, openCopilot } = useBee();
  const hideBeeWidget = pathname === "/ai-assistant";

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
      <TextSelectionTooltip onAskBee={(prompt, selectedText) => openCopilot(prompt, selectedText)} />

      {!hideBeeWidget ? (
        <>
          <BeePanel />
          <Button
            onClick={() => openCopilot()}
            className={`bee-fab ${copilotOpen ? "translate-x-[120%]" : ""}`}
          >
            <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-foreground/18">
              <Bot className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">{t("layout.beeToggle")}</div>
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary-foreground/75">
                {copilotOpen ? t("bee.copilotOpen") : context.chip}
              </div>
            </div>
            <MessageSquareMore className="ml-3 h-4 w-4" />
          </Button>
        </>
      ) : null}
    </div>
  );
};

export default Layout;
