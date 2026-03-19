import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Chapter {
  title: string;
  content: string[];
}

interface LearnPageProps {
  title: string;
  subtitle: string;
  chapters: Chapter[];
  pageSlug: string;
}

const LearnPage = ({ title, subtitle, chapters, pageSlug }: LearnPageProps) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set());
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Load progress
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("chapter_index")
        .eq("user_id", user.id)
        .eq("page_slug", pageSlug);
      if (data) setCompletedChapters(new Set(data.map((d: any) => d.chapter_index)));
    };
    load();
  }, [user, pageSlug]);

  // Resume from last incomplete
  useEffect(() => {
    if (completedChapters.size > 0 && completedChapters.size < chapters.length) {
      const firstIncomplete = chapters.findIndex((_, i) => !completedChapters.has(i));
      if (firstIncomplete >= 0) setActiveChapter(firstIncomplete);
    }
  }, [completedChapters.size]);

  const markComplete = useCallback(async (index: number) => {
    if (!user) {
      toast({ title: "Login required", description: "Sign in to save progress.", variant: "destructive" });
      return;
    }
    if (completedChapters.has(index)) return;

    const { error } = await supabase.from("user_progress").insert({
      user_id: user.id,
      page_slug: pageSlug,
      chapter_index: index,
    });

    if (!error) {
      setCompletedChapters((prev) => new Set([...prev, index]));

      // Check achievements
      const newCompleted = completedChapters.size + 1;
      if (newCompleted === 1) {
        await supabase.from("user_achievements").insert({ user_id: user.id, achievement_key: "first_steps" }).select();
      }
      if (newCompleted === chapters.length) {
        const achievementMap: Record<string, string> = {
          "plan-learn": "strategist",
          "launch-learn": "launch_ready",
          "manage-learn": "growth_master",
        };
        const key = achievementMap[pageSlug];
        if (key) {
          await supabase.from("user_achievements").insert({ user_id: user.id, achievement_key: key }).select();
        }
        // Check scholar (all 3 pages complete)
        const { data: allProgress } = await supabase
          .from("user_progress")
          .select("page_slug, chapter_index")
          .eq("user_id", user.id);
        if (allProgress) {
          const slugs = ["plan-learn", "launch-learn", "manage-learn"];
          // This is a simplified check
          const allDone = slugs.every((s) => {
            const count = allProgress.filter((p: any) => p.page_slug === s).length;
            return count >= 5; // minimum chapters
          });
          if (allDone) {
            await supabase.from("user_achievements").insert({ user_id: user.id, achievement_key: "scholar" }).select();
          }
        }
      }
      toast({ title: "Chapter completed!", description: `${newCompleted}/${chapters.length} chapters done.` });
    }
  }, [user, pageSlug, completedChapters, chapters.length, toast]);

  const progressPercent = Math.round((completedChapters.size / chapters.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-4">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">{subtitle}</p>
          {user && (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                <span>{t("common.progress")}</span>
                <span>{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto flex gap-6">
          {/* Table of Contents */}
          <div className={cn("flex-shrink-0 transition-all", sidebarOpen ? "w-64" : "w-10")}>
            {sidebarOpen ? (
              <Card className="sticky top-20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm">{t("common.chapter")}s</h3>
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
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                          activeChapter === i
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {completedChapters.has(i) ? (
                          <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
                        ) : (
                          <span className="text-xs opacity-70 w-3.5 text-center shrink-0">{i + 1}</span>
                        )}
                        <span className="truncate">{ch.title}</span>
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
                    {t("common.chapter")} {activeChapter + 1} {t("common.of")} {chapters.length}
                  </span>
                  {completedChapters.has(activeChapter) && (
                    <span className="text-xs font-medium bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> {t("common.completed")}
                    </span>
                  )}
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

                {/* Mark complete + Navigation */}
                <div className="mt-8 pt-6 border-t space-y-4">
                  {!completedChapters.has(activeChapter) && (
                    <Button
                      onClick={() => markComplete(activeChapter)}
                      variant="outline"
                      className="w-full border-green-500/30 text-green-600 hover:bg-green-500/10"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Mark as Complete
                    </Button>
                  )}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
                      disabled={activeChapter === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> {t("common.previous")}
                    </Button>
                    <span className="text-xs text-muted-foreground">{activeChapter + 1} / {chapters.length}</span>
                    <Button
                      onClick={() => setActiveChapter(Math.min(chapters.length - 1, activeChapter + 1))}
                      disabled={activeChapter === chapters.length - 1}
                    >
                      {t("common.next")} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
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

export default LearnPage;
