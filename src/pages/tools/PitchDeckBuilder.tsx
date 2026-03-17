import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useSavedTool } from "@/hooks/use-saved-tool";
import { Download, Presentation, Save } from "lucide-react";

const baseSlides = [
  { key: "problem", title: "Problem", prompt: "What painful problem are you solving?" },
  { key: "solution", title: "Solution", prompt: "How does your startup solve it?" },
  { key: "market", title: "Market", prompt: "Describe TAM, SAM, and your ideal customer." },
  { key: "businessModel", title: "Business Model", prompt: "How will you make money?" },
  { key: "traction", title: "Traction", prompt: "What proof do you already have?" },
  { key: "competition", title: "Competition", prompt: "Why will you win vs alternatives?" },
  { key: "goToMarket", title: "Go To Market", prompt: "How will you acquire customers?" },
  { key: "financials", title: "Financials", prompt: "Share revenue assumptions and use of funds." },
  { key: "team", title: "Team", prompt: "Why is your team uniquely qualified?" },
  { key: "ask", title: "The Ask", prompt: "How much are you raising and for what milestones?" },
];

const defaultData = {
  startupName: "",
  tagline: "",
  audience: "Angel investors and early-stage VCs",
  slides: baseSlides.map((slide) => ({ ...slide, content: "" })),
};

const PitchDeckBuilder = () => {
  const { data, save, isSaving } = useSavedTool("pitch_deck", defaultData);
  const [deck, setDeck] = useState(defaultData);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (data) setDeck(data);
  }, [data]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (JSON.stringify(deck) !== JSON.stringify(defaultData)) {
        save(deck);
      }
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [deck, save]);

  const activeSlide = deck.slides[activeIndex];

  const completion = useMemo(() => {
    const filled = deck.slides.filter((slide) => slide.content.trim()).length;
    return Math.round((filled / deck.slides.length) * 100);
  }, [deck.slides]);

  const exportDeck = () => {
    const text = [
      `${deck.startupName || "Untitled Startup"}`,
      deck.tagline,
      `Audience: ${deck.audience}`,
      "",
      ...deck.slides.flatMap((slide, index) => [
        `${index + 1}. ${slide.title}`,
        slide.content || "-",
        "",
      ]),
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(deck.startupName || "pitch-deck").toLowerCase().replace(/\s+/g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border px-3 py-1 text-sm text-muted-foreground">
              Guided fundraising story builder
            </div>
            <h1 className="text-4xl font-bold text-foreground">Startup Pitch Deck Builder</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Build a clean 10-slide investor narrative, autosave your progress, and export a draft deck outline.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary">{completion}% complete</Badge>
            <Button variant="outline" onClick={() => save(deck)}>
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save now"}
            </Button>
            <Button onClick={exportDeck}>
              <Download className="h-4 w-4" />
              Export Draft
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="grid gap-4 p-6 md:grid-cols-3">
            <Input placeholder="Startup name" value={deck.startupName} onChange={(e) => setDeck((prev) => ({ ...prev, startupName: e.target.value }))} />
            <Input placeholder="One-line tagline" value={deck.tagline} onChange={(e) => setDeck((prev) => ({ ...prev, tagline: e.target.value }))} />
            <Input placeholder="Target audience" value={deck.audience} onChange={(e) => setDeck((prev) => ({ ...prev, audience: e.target.value }))} />
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Slides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {deck.slides.map((slide, index) => (
                <button
                  key={slide.key}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${index === activeIndex ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                >
                  <div className="text-xs text-muted-foreground">Slide {index + 1}</div>
                  <div className="font-medium text-foreground">{slide.title}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{activeSlide.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{activeSlide.prompt}</p>
                <Textarea
                  className="min-h-[220px]"
                  placeholder={`Write the ${activeSlide.title.toLowerCase()} slide narrative...`}
                  value={activeSlide.content}
                  onChange={(e) =>
                    setDeck((prev) => ({
                      ...prev,
                      slides: prev.slides.map((slide, index) =>
                        index === activeIndex ? { ...slide, content: e.target.value } : slide
                      ),
                    }))
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Presentation className="h-5 w-5 text-primary" />
                  Live slide preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-hidden rounded-xl border bg-muted/40" style={{ minHeight: 420 }}>
                  <div className="absolute left-1/2 top-1/2 h-[1080px] w-[1920px] -translate-x-1/2 -translate-y-1/2 scale-[0.2] rounded-[28px] border bg-background shadow-2xl md:scale-[0.28] xl:scale-[0.34]">
                    <div className="flex h-full flex-col justify-between p-20">
                      <div>
                        <div className="mb-8 text-3xl font-medium text-muted-foreground">{deck.startupName || "Your Startup"}</div>
                        <h2 className="max-w-5xl text-8xl font-bold leading-[1.05] text-foreground">{activeSlide.title}</h2>
                      </div>
                      <div className="grid grid-cols-[1.4fr_0.6fr] gap-16">
                        <p className="text-4xl leading-relaxed text-muted-foreground whitespace-pre-wrap">
                          {activeSlide.content || activeSlide.prompt}
                        </p>
                        <div className="rounded-[24px] border bg-muted/40 p-10">
                          <div className="text-2xl text-muted-foreground">Audience</div>
                          <div className="mt-4 text-4xl font-semibold text-foreground">{deck.audience || "Investors"}</div>
                          <div className="mt-10 text-2xl text-muted-foreground">Tagline</div>
                          <div className="mt-4 text-4xl font-semibold text-foreground">{deck.tagline || "Your one-line story"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckBuilder;
