import { Archive, Bot, Expand, History, PencilLine, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClayGraphic } from "@/components/ClayGraphic";
import { PageHeader, ScrollSurface, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useBee } from "@/contexts/BeeContext";

const AIAssistant = () => {
  const {
    activeSessionId,
    archiveSession,
    context,
    createNewChat,
    currentSession,
    draft,
    historyLoading,
    messages,
    openCopilot,
    renameSession,
    retryLastMessage,
    selectSession,
    sendMessage,
    sessions,
    setDraft,
    streaming,
  } = useBee();

  const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Bee AI"
          title="One fullscreen workspace for history, retries, and route-aware founder help"
          description="Use Bee for context-aware business guidance across BizHive. Sessions stay organized, retry keeps the same thread intact, and the copilot uses the same chat instead of a disconnected widget."
          icon={Bot}
          visual={<ClayGraphic className="h-full min-h-[250px]" />}
          actions={
            <Button variant="ghost" className="glass-button h-12" onClick={() => openCopilot(draft)}>
              <Expand className="mr-2 h-4 w-4 text-primary" />
              Open copilot
            </Button>
          }
        />

        <section className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
          <ScrollSurface className="lg:h-[48rem]">
            <div className="compact-scroll space-y-3">
              <Button className="h-11 w-full rounded-2xl" onClick={createNewChat}>
                <History className="mr-2 h-4 w-4" />
                New chat
              </Button>
              {historyLoading ? (
                <div className="panel-muted p-4 text-sm text-muted-foreground">Loading chat history...</div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`rounded-[24px] border p-4 ${
                      activeSessionId === session.id
                        ? "border-primary/30 bg-primary/10"
                        : "border-border/70 bg-muted/35"
                    }`}
                  >
                    <button type="button" className="w-full text-left" onClick={() => selectSession(session.id)}>
                      <div className="font-semibold text-foreground">{session.title}</div>
                      <div className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {session.summary || "A fresh Bee session ready for your next business question."}
                      </div>
                    </button>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-2xl"
                        onClick={() => {
                          const nextTitle = window.prompt("Rename this chat", session.title);
                          if (nextTitle) {
                            void renameSession(session.id, nextTitle);
                          }
                        }}
                      >
                        <PencilLine className="mr-2 h-4 w-4" />
                        Rename
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-2xl"
                        onClick={() => void archiveSession(session.id)}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollSurface>

          <ScrollSurface className="lg:h-[48rem]">
            <div className="compact-scroll space-y-4">
              {messages.length ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.role === "assistant"
                        ? message.status === "error"
                          ? "rounded-[24px] border border-destructive/40 bg-destructive/10 p-5"
                          : "rounded-[24px] border border-border/70 bg-muted/40 p-5"
                        : "ml-auto max-w-[88%] rounded-[24px] bg-primary px-5 py-4 text-primary-foreground"
                    }
                  >
                    {message.role === "assistant" ? (
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        <Bot className="h-3.5 w-3.5" />
                        {message.status === "error" ? "Bee needs retry" : message.status === "streaming" ? "Bee is thinking" : "Bee AI"}
                      </div>
                    ) : null}
                    <p className="whitespace-pre-wrap text-sm leading-8">{message.content || "Preparing answer..."}</p>
                    {message.role === "assistant" && message.status === "error" && message.retryable ? (
                      <Button className="mt-4 h-10 rounded-2xl" onClick={() => void retryLastMessage()}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Retry answer
                      </Button>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="panel-muted flex min-h-[280px] flex-col items-center justify-center gap-3 p-6 text-center">
                  <Bot className="h-6 w-6 text-primary" />
                  <div className="text-xl font-semibold text-foreground">Start a new Bee conversation</div>
                  <p className="max-w-lg text-sm leading-7 text-muted-foreground">
                    Ask about planning, launch, growth, documents, incubators, taxation, or anything else related to building and operating a business in India.
                  </p>
                </div>
              )}
            </div>
          </ScrollSurface>

          <div className="grid gap-4">
            <Surface className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{context.chip}</div>
              <div className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">{context.title}</div>
              <p className="text-sm leading-7 text-muted-foreground">{context.description}</p>
              <div className="rounded-[22px] border border-border/70 bg-muted/35 p-4 text-sm leading-7 text-muted-foreground">
                {currentSession?.summary || "Bee keeps this session’s running context so you can retry providers without losing the conversation flow."}
              </div>
            </Surface>

            <Surface className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Prompt composer
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Explain this page clearly.",
                  "What should I do next here?",
                  "Summarize the most important founder actions on this screen.",
                  "Give me an India-specific business answer.",
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
                placeholder="Ask Bee about the current workspace, a selected term, funding, compliance, launch steps, or growth choices."
                className="min-h-[200px] rounded-[24px]"
              />
              <Button className="h-12 w-full rounded-2xl" disabled={streaming} onClick={() => void sendMessage()}>
                {streaming ? "Thinking..." : "Ask Bee"}
              </Button>
              {lastAssistant?.status === "error" && lastAssistant.retryable ? (
                <Button variant="ghost" className="h-11 w-full rounded-2xl" onClick={() => void retryLastMessage()}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retry the failed answer
                </Button>
              ) : null}
            </Surface>
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default AIAssistant;
