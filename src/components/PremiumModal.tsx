import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { premiumFeaturePreview } from "@/content/product";
import { useTranslation } from "react-i18next";

type PremiumModalProps = {
  trigger?: React.ReactNode;
};

export const PremiumModal = ({ trigger }: PremiumModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="overflow-hidden rounded-[30px] border-border/80 bg-card p-0 sm:max-w-3xl">
        <div className="border-b border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(255,138,61,0.22),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,244,238,0.96))] px-6 py-6 dark:bg-[radial-gradient(circle_at_top_left,rgba(255,138,61,0.24),transparent_36%),linear-gradient(180deg,rgba(31,20,18,0.98),rgba(20,14,13,0.98))]">
          <DialogHeader className="space-y-3 text-left">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <DialogTitle className="font-display text-3xl font-semibold tracking-[-0.05em]">
              {t("premium.title")}
            </DialogTitle>
            <DialogDescription className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {t("premium.description")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
          {premiumFeaturePreview.map((item) => (
            <div key={item.title} className="rounded-[24px] border border-border/80 bg-muted/35 p-5">
              <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{item.title}</div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border/70 px-6 py-5">
          <Button variant="ghost" className="rounded-2xl border border-border/80">
            {t("premium.keepExploring")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
