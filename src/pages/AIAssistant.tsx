import { Bot, Expand, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClayGraphic } from "@/components/ClayGraphic";
import { PageHeader, ScrollSurface, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useBee } from "@/contexts/BeeContext";

const AIAssistant = () => {
  const { context, draft, messages, openCopilot, sendMessage, setDraft } = useBee();

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Bee AI"
          title="Context-aware founder copilot, rebuilt as a proper workspace"
          description="Use the fullscreen assistant for longer questions, product guidance, screen context, and future AI workflows. The current version is a preview-ready interface that shares context with the bottom-right copilot."
          icon={Bot}
          visual={<ClayGraphic className="h-full min-h-[250px]" />}
          actions={
            <Button variant="ghost" className="glass-button h-12" onClick={() => openCopilot(draft)}>
              <Expand className="mr-2 h-4 w-4 text-primary" />
              Open copilot
            </Button>
          }
        />

        <section className="workspace-grid">
          <ScrollSurface className="lg:h-[48rem]">
            <div className="compact-scroll space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "assistant"
                      ? "rounded-[24px] border border-border/70 bg-muted/40 p-5"
                      : "ml-auto max-w-[88%] rounded-[24px] bg-primary px-5 py-4 text-primary-foreground"
                  }
                >
                  {message.role === "assistant" ? (
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      <Bot className="h-3.5 w-3.5" />
                      Bee preview
                    </div>
                  ) : null}
                  <p className="text-sm leading-8">{message.content}</p>
                </div>
              ))}
            </div>
          </ScrollSurface>

          <div className="grid gap-4">
            <Surface className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{context.chip}</div>
              <div className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">{context.title}</div>
              <p className="text-sm leading-7 text-muted-foreground">{context.description}</p>
            </Surface>

            <Surface className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Prompt composer
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Explain this page to me clearly.",
                  "What should I do next here?",
                  "Summarize the most important actions on this screen.",
                  "Help me turn this into a better founder decision.",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDraft(item)}
                    className="rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent/70"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask Bee about the current workspace, your next action, or the meaning of a selected term."
                className="min-h-[180px] rounded-[24px]"
              />
              <Button className="h-12 w-full rounded-2xl" onClick={() => sendMessage()}>
                Ask Bee
              </Button>
            </Surface>

            <Surface className="space-y-3">
              <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">How Bee works right now</div>
              <p className="text-sm leading-7 text-muted-foreground">
                This rebuilt interface already knows which screen you are on and can accept text-selection prompts from around the app. The heavy AI response engine is being reattached later without changing this UI.
              </p>
            </Surface>
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default AIAssistant;
