import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AchievementBadge from "@/components/AchievementBadge";

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

const CHAPTER_XP = 20;
const PAGE_COMPLETION_XP = 100;

const SECTION_ACHIEVEMENTS: Record<string, string> = {
  "plan-learn": "strategist",
  "launch-learn": "launch_ready",
  "manage-learn": "growth_master",
};

const SCHOLAR_REQUIREMENTS: Record<string, number> = {
  "plan-learn": 12,
  "launch-learn": 12,
  "manage-learn": 12,
  "resources-learn": 6,
};

const LearnPage = ({ title, subtitle, chapters, pageSlug }: LearnPageProps) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set());
  const [earnedAchievements, setEarnedAchievements] = useState<Set<string>>(new Set());
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const pageAchievementKey = SECTION_ACHIEVEMENTS[pageSlug];
  const isPageComplete = completedChapters.size === chapters.length;
  const totalXp = completedChapters.size * CHAPTER_XP + (isPageComplete ? PAGE_COMPLETION_XP : 0);
  const progressPercent = Math.round((completedChapters.size / chapters.length) * 100);
  const remainingChapters = Math.max(chapters.length - completedChapters.size, 0);

  useEffect(() => {
    if (!user) return;

    const loadProgress = async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("chapter_index")
        .eq("user_id", user.id)
        .eq("page_slug", pageSlug);

      if (data) {
        setCompletedChapters(new Set(data.map((item: any) => item.chapter_index)));
      }
    };

    void loadProgress();
  }, [user, pageSlug]);

  useEffect(() => {
    if (!user) return;

    const loadAchievements = async () => {
      const { data } = await supabase
        .from("user_achievements")
        .select("achievement_key")
        .eq("user_id", user.id);

      if (data) {
        setEarnedAchievements(new Set(data.map((item: any) => item.achievement_key)));
      }
    };

    void loadAchievements();
  }, [user]);

  useEffect(() => {
    if (completedChapters.size > 0 && completedChapters.size < chapters.length) {
      const firstIncomplete = chapters.findIndex((_, index) => !completedChapters.has(index));
      if (firstIncomplete >= 0) {
        setActiveChapter(firstIncomplete);
      }
    }
  }, [chapters, chapters.length, completedChapters]);

  const awardAchievement = useCallback(async (achievementKey: string) => {
    if (!user) {
      return;
    }

    const { error } = await supabase
      .from("user_achievements")
      .upsert(
        { user_id: user.id, achievement_key: achievementKey },
        { onConflict: "user_id,achievement_key" }
      );

    if (!error) {
      setEarnedAchievements((previous) => new Set([...previous, achievementKey]));
    }
  }, [user]);

  const markComplete = useCallback(async (index: number) => {
    if (!user) {
      toast({ title: t("Login required"), description: t("Sign in to save progress."), variant: "destructive" });
      return;
    }

    if (completedChapters.has(index)) {
      return;
    }

    const { error } = await supabase.from("user_progress").insert({
      user_id: user.id,
      page_slug: pageSlug,
      chapter_index: index,
    });

    if (error) {
      toast({ title: t("Progress not saved"), description: error.message, variant: "destructive" });
      return;
    }

    const nextCompletedChapters = new Set([...completedChapters, index]);
    const newCompletedCount = nextCompletedChapters.size;

    setCompletedChapters(nextCompletedChapters);

    if (newCompletedCount === 1) {
      await awardAchievement("first_steps");
    }

    if (newCompletedCount === chapters.length) {
      if (pageAchievementKey) {
        await awardAchievement(pageAchievementKey);
      }

      const { data: allProgress } = await supabase
        .from("user_progress")
        .select("page_slug, chapter_index")
        .eq("user_id", user.id);

      if (allProgress) {
        const allDone = Object.entries(SCHOLAR_REQUIREMENTS).every(([slug, requiredCount]) => {
          const completedCount = allProgress.filter((entry: any) => entry.page_slug === slug).length;
          const currentPageCount = slug === pageSlug ? Math.max(completedCount, newCompletedCount) : completedCount;
          return currentPageCount >= requiredCount;
        });

        if (allDone) {
          await awardAchievement("scholar");
        }
      }
    }

    toast({
      title: t("Chapter completed!"),
      description: `+${CHAPTER_XP} XP earned. ${newCompletedCount}/${chapters.length} ${t("Chapters").toLowerCase()} done.`,
    });
  }, [awardAchievement, chapters.length, completedChapters, pageAchievementKey, pageSlug, t, toast, user]);

  const milestoneAchievements = ["first_steps", pageAchievementKey, "scholar"].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-4">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t(title)}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">{t(subtitle)}</p>
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

        {user && (
          <div className="max-w-6xl mx-auto mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("Learning XP")}</p>
                    <p className="text-2xl font-bold text-foreground">{totalXp}</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("Completed Chapters")}</p>
                    <p className="text-2xl font-bold text-foreground">{completedChapters.size}/{chapters.length}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("Next Milestone")}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {remainingChapters === 0 ? t("Section mastered") : `${remainingChapters} ${t(remainingChapters === 1 ? "chapter to go" : "chapters to go")}`}
                    </p>
                  </div>
                  <Trophy className="h-5 w-5 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="max-w-6xl mx-auto flex gap-6">
          <div className={cn("flex-shrink-0 transition-all", sidebarOpen ? "w-64" : "w-10")}>
            {sidebarOpen ? (
              <Card className="sticky top-20">
                <CardContent className="p-4 space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm">{t("Chapters")}</h3>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSidebarOpen(false)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {chapters.map((chapter, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveChapter(index)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                            activeChapter === index
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          {completedChapters.has(index) ? (
                            <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
                          ) : (
                            <span className="text-xs opacity-70 w-3.5 text-center shrink-0">{index + 1}</span>
                          )}
                          <span className="truncate">{t(chapter.title)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {user && (
                    <div className="rounded-2xl border bg-muted/40 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("Badge Progress")}</p>
                          <p className="text-sm font-semibold text-foreground">{t("Unlock learning milestones")}</p>
                        </div>
                        <Badge variant="secondary">+{CHAPTER_XP} XP</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {milestoneAchievements.map((achievementKey) => (
                          <AchievementBadge
                            key={achievementKey}
                            achievementKey={achievementKey}
                            earned={earnedAchievements.has(achievementKey)}
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Button variant="ghost" size="icon" className="sticky top-20" onClick={() => setSidebarOpen(true)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

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

                <h2 className="text-2xl font-bold text-foreground mb-6">{t(chapters[activeChapter].title)}</h2>

                <div className="prose dark:prose-invert max-w-none space-y-4">
                  {chapters[activeChapter].content.map((paragraph, index) => {
                    if (paragraph.startsWith("## ")) {
                      return <h3 key={index} className="text-lg font-semibold text-foreground mt-6 mb-3">{t(paragraph.slice(3))}</h3>;
                    }

                    if (paragraph.startsWith("- ")) {
                      return (
                        <ul key={index} className="list-disc pl-6 space-y-1 text-muted-foreground">
                          {paragraph.split("\n").map((item, itemIndex) => (
                            <li key={itemIndex}>{t(item.replace(/^- /, ""))}</li>
                          ))}
                        </ul>
                      );
                    }

                    if (paragraph.startsWith("> ")) {
                      return (
                        <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-muted-foreground bg-muted/50 py-3 pr-4 rounded-r-lg">
                          {t(paragraph.slice(2))}
                        </blockquote>
                      );
                    }

                    return <p key={index} className="text-muted-foreground leading-relaxed">{t(paragraph)}</p>;
                  })}
                </div>

                <div className="mt-8 rounded-2xl border bg-muted/40 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t("Chapter Reward")}</p>
                      <p className="text-sm text-muted-foreground">
                        {completedChapters.has(activeChapter)
                          ? `${t("Chapter completed.")} ${CHAPTER_XP} XP added to your learning progress.`
                          : `${t("Finish this chapter to earn")} ${CHAPTER_XP} XP ${t("and move one step closer to your next badge.")}`}
                      </p>
                    </div>
                    <Badge variant="secondary">+{CHAPTER_XP} XP</Badge>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t space-y-4">
                  {!completedChapters.has(activeChapter) && (
                    <Button
                      onClick={() => markComplete(activeChapter)}
                      variant="outline"
                      className="w-full border-green-500/30 text-green-600 hover:bg-green-500/10"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> {t("Mark as Complete")}
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
