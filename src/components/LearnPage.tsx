
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chapter {
  title: string;
  content: string[];
}

interface LearnPageProps {
  title: string;
  subtitle: string;
  chapters: Chapter[];
}

const LearnPage = ({ title, subtitle, chapters }: LearnPageProps) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-4">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="max-w-6xl mx-auto flex gap-6">
          {/* Table of Contents */}
          <div className={cn("flex-shrink-0 transition-all", sidebarOpen ? "w-64" : "w-10")}>
            {sidebarOpen ? (
              <Card className="sticky top-20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm">Chapters</h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSidebarOpen(false)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {chapters.map((ch, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveChapter(i)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                          activeChapter === i
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <span className="text-xs opacity-70 mr-2">{i + 1}.</span>
                        {ch.title}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button variant="ghost" size="icon" className="sticky top-20" onClick={() => setSidebarOpen(true)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    Chapter {activeChapter + 1} of {chapters.length}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-6">{chapters[activeChapter].title}</h2>
                
                <div className="prose dark:prose-invert max-w-none space-y-4">
                  {chapters[activeChapter].content.map((para, i) => {
                    if (para.startsWith("## ")) {
                      return <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-3">{para.slice(3)}</h3>;
                    }
                    if (para.startsWith("- ")) {
                      return (
                        <ul key={i} className="list-disc pl-6 space-y-1 text-muted-foreground">
                          {para.split("\n").map((item, j) => (
                            <li key={j}>{item.replace(/^- /, "")}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (para.startsWith("> ")) {
                      return (
                        <blockquote key={i} className="border-l-4 border-primary pl-4 italic text-muted-foreground bg-muted/50 py-3 pr-4 rounded-r-lg">
                          {para.slice(2)}
                        </blockquote>
                      );
                    }
                    return <p key={i} className="text-muted-foreground leading-relaxed">{para}</p>;
                  })}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
                    disabled={activeChapter === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <span className="text-xs text-muted-foreground">{activeChapter + 1} / {chapters.length}</span>
                  <Button
                    onClick={() => setActiveChapter(Math.min(chapters.length - 1, activeChapter + 1))}
                    disabled={activeChapter === chapters.length - 1}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
