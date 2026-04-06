import { MessageSquareMore, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BeeIcon from "@/components/BeeIcon";
import { useTranslation } from "react-i18next";

interface BeePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillMessage?: string;
}

const BeePanel = ({ open, onOpenChange }: BeePanelProps) => {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return (
    <div className="panel-surface w-full max-w-sm p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <BeeIcon className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-semibold text-foreground">{t("bee.title")}</h3>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                {t("bee.status")}
              </span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{t("bee.body")}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-2xl" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 grid gap-2">
        <div className="panel-muted flex items-start gap-3 p-3">
          <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
          <div className="text-sm text-muted-foreground">{t("bee.noteOne")}</div>
        </div>
        <div className="panel-muted flex items-start gap-3 p-3">
          <MessageSquareMore className="mt-0.5 h-4 w-4 text-primary" />
          <div className="text-sm text-muted-foreground">{t("bee.noteTwo")}</div>
        </div>
      </div>
    </div>
  );
};

export default BeePanel;
