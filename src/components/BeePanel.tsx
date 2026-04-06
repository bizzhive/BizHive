import { Bot, CornerDownLeft, Expand, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import BeeIcon from "@/components/BeeIcon";
import { useTranslation } from "react-i18next";
import { useBee } from "@/contexts/BeeContext";

const BeePanel = () => {
  const { t } = useTranslation();
  const { closeCopilot, context, copilotOpen, draft, messages, openFullscreen, sendMessage, setDraft } = useBee();

  if (!copilotOpen) {
    return null;
  }

  return (
    <div className="bee-copilot bee-panel w-[min(26rem,calc(100vw-2rem))]">
      <div className="flex items-start justify-between gap-4 border-b border-border/60 px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="brand-mark h-11 w-11 rounded-[18px]">
            <BeeIcon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-semibold text-foreground">{t("bee.copilotTitle")}</h3>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                {t("bee.previewStatus")}
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{context.chip}</p>
            <p className="max-w-[18rem] text-sm leading-6 text-muted-foreground">{context.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="glass-icon-button h-9 w-9" onClick={() => openFullscreen(draft)}>
            <Expand className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="glass-icon-button h-9 w-9" onClick={closeCopilot}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex max-h-[28rem] flex-col">
        <div className="compact-scroll flex-1 space-y-3 px-4 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "assistant"
                  ? "rounded-[22px] border border-border/70 bg-muted/40 p-4"
                  : "ml-auto max-w-[88%] rounded-[22px] bg-primary px-4 py-3 text-primary-foreground"
              }
            >
              {message.role === "assistant" ? (
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  <Bot className="h-3.5 w-3.5" />
                  {t("nav.bee")}
                </div>
              ) : null}
              <p className="text-sm leading-7">{message.content}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-border/60 px-4 py-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {[t("bee.promptExplain"), t("bee.promptNextStep"), t("bee.promptSummarize")].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDraft(item)}
                className="rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent/60"
              >
                <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
                {item}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t("bee.copilotPlaceholder")}
              className="min-h-[98px] rounded-[22px] border-border/80 bg-background/70"
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs leading-5 text-muted-foreground">{t("bee.previewNote")}</p>
              <Button className="h-11 rounded-2xl px-4" onClick={() => sendMessage()}>
                <CornerDownLeft className="mr-2 h-4 w-4" />
                {t("bee.send")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeePanel;
