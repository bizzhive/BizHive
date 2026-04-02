import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, ExternalLink, FolderOpen, GraduationCap, Save, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/services/supabase/client";
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

type WorkbookField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea";
};

type WorkbookState = {
  id?: string;
  notes: string;
  checklist: boolean[];
  answers: Record<string, string>;
};

type ResourceLink = {
  title: string;
  description: string;
  href: string;
  cta: string;
  external?: boolean;
};

const LESSON_XP = 20;
const CHECKPOINT_XP = 10;
const SECTION_BONUS_XP = 80;

const SECTION_META = {
  "plan-learn": { route: "/plan/learn", shortTitle: "Plan", achievementKey: "strategist", total: 15 },
  "launch-learn": { route: "/launch/learn", shortTitle: "Launch", achievementKey: "launch_ready", total: 15 },
  "manage-learn": { route: "/manage/learn", shortTitle: "Grow", achievementKey: "growth_master", total: 15 },
  "resources-learn": { route: "/resources/learn", shortTitle: "Resources", achievementKey: "resource_navigator", total: 8 },
} as const;

const LEVELS = [
  { name: "Explorer", minXp: 0 },
  { name: "Operator", minXp: 150 },
  { name: "Builder", minXp: 350 },
  { name: "Strategist", minXp: 650 },
  { name: "Scale Leader", minXp: 1000 },
];

const chapterKey = (pageSlug: string, title: string) => `${pageSlug}:${title}`;
const chapterSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const checklistFor = (title: string) => [
  `I can explain the main lesson from "${title}".`,
  `I can identify one risk or decision tied to "${title}".`,
  "I know the next action I should take after this chapter.",
];

const WORKBOOKS: Record<string, { title: string; description: string; fields: WorkbookField[] }> = {
  "plan-learn:Why Business Planning Matters": {
    title: "Planning baseline",
    description: "Capture the current state of your idea before you go deeper.",
    fields: [
      { name: "idea", label: "Business idea", placeholder: "What are you building?" },
      { name: "customer", label: "Primary customer", placeholder: "Who is this for?" },
      { name: "problem", label: "Core problem", placeholder: "What painful problem are you solving?", type: "textarea" },
      { name: "goal", label: "90-day goal", placeholder: "What progress would matter most this quarter?" },
    ],
  },
  "plan-learn:Customer Discovery Interviews": {
    title: "Interview tracker",
    description: "Capture the repeated patterns that matter after customer calls.",
    fields: [
      { name: "persona", label: "Target persona", placeholder: "Who are you interviewing?" },
      { name: "pain", label: "Repeated pain pattern", placeholder: "What pain showed up repeatedly?", type: "textarea" },
      { name: "budget", label: "Budget clues", placeholder: "What suggests real urgency or willingness to pay?" },
    ],
  },
  "launch-learn:Setting Up Payment Systems": {
    title: "Checkout readiness review",
    description: "Check whether your payment flow is ready for real customers.",
    fields: [
      { name: "gateway", label: "Primary payment method", placeholder: "UPI, card, bank transfer, subscriptions" },
      { name: "test", label: "End-to-end test result", placeholder: "Did a real test payment succeed?" },
      { name: "risks", label: "Remaining payment risks", placeholder: "What still needs fixing before launch?", type: "textarea" },
    ],
  },
  "manage-learn:Building Your Team": {
    title: "Role scorecard",
    description: "Clarify what a role must accomplish before hiring.",
    fields: [
      { name: "role", label: "Role", placeholder: "What are you hiring for?" },
      { name: "outcomes", label: "Top 3 outcomes", placeholder: "What must this person achieve in 90 days?", type: "textarea" },
      { name: "fit", label: "Culture fit", placeholder: "What behaviors matter most?" },
    ],
  },
  "manage-learn:Data-Driven Decision Making": {
    title: "Weekly KPI review",
    description: "Choose the numbers the team should actually review every week.",
    fields: [
      { name: "northStar", label: "North star metric", placeholder: "Which metric best reflects delivered value?" },
      { name: "leading", label: "Leading indicators", placeholder: "Which numbers predict next week's performance?", type: "textarea" },
      { name: "actions", label: "Action rules", placeholder: "What action should each KPI trigger?", type: "textarea" },
    ],
  },
  "resources-learn:Building a Weekly Resource Review Rhythm": {
    title: "Weekly resource review",
    description: "Keep the source library current and useful for the whole team.",
    fields: [
      { name: "source", label: "Source reviewed this week", placeholder: "Which portal, document, or worksheet did you review?" },
      { name: "change", label: "Change noticed", placeholder: "What changed or needs refreshing?", type: "textarea" },
      { name: "owner", label: "Owner", placeholder: "Who will follow through?" },
    ],
  },
};

const OFFICIAL_RESOURCES: ResourceLink[] = [
  { title: "Udyam Registration Official Portal", description: "Official MSME portal for Udyam registration.", href: "https://udyamregistration.gov.in/UdyamReg.aspx", cta: "Open official portal", external: true },
  { title: "GST Registration Help Centre", description: "Official GST registration guidance.", href: "https://www.gst.gov.in/help/registration", cta: "Open official portal", external: true },
  { title: "FSSAI FoSCoS Registration Portal", description: "Official portal for food business registration and licensing.", href: "https://foscos.fssai.gov.in/", cta: "Open official portal", external: true },
  { title: "Import Export Code (IEC) Portal", description: "Official DGFT portal for IEC filing and profile management.", href: "https://www.dgft.gov.in/CP/", cta: "Open official portal", external: true },
  { title: "SPICe+ Incorporation Guide (MCA)", description: "Official MCA guide for SPICe+ incorporation.", href: "https://www.mca.gov.in/content/dam/mca/videos/audio_pdfs/Video_SPICeplus_AudioText.pdf", cta: "Open official guide", external: true },
  { title: "Editable Registration Worksheets", description: "Use BizHive's reusable preparation sheets before filing.", href: "/documents", cta: "Open document library" },
];

const RESOURCES: Record<string, ResourceLink[]> = {
  "plan-learn:Market Research Methods": [{ title: "Document Library", description: "Browse official links and editable worksheets relevant to Indian founders.", href: "/documents", cta: "Open document library" }],
  "launch-learn:Legal Requirements & Registration": OFFICIAL_RESOURCES,
  "launch-learn:Inventory & Supply Chain Basics": OFFICIAL_RESOURCES.slice(2, 4),
  "resources-learn:Official Filing Worksheets & Reusable Templates": OFFICIAL_RESOURCES,
};

const emptyWorkbook = (title: string, workbook?: { fields: WorkbookField[] }): WorkbookState => ({
  notes: "",
  checklist: checklistFor(title).map(() => false),
  answers: Object.fromEntries((workbook?.fields ?? []).map((field) => [field.name, ""])),
});

const LearnPage = ({ title, subtitle, chapters, pageSlug }: LearnPageProps) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set());
  const [earnedAchievements, setEarnedAchievements] = useState<Set<string>>(new Set());
  const [allProgressCounts, setAllProgressCounts] = useState<Record<string, number>>({});
  const [workbooks, setWorkbooks] = useState<Record<string, WorkbookState>>({});
  const [savingWorkbook, setSavingWorkbook] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const currentChapter = chapters[activeChapter];
  const currentKey = chapterKey(pageSlug, currentChapter.title);
  const workbookConfig = WORKBOOKS[currentKey];
  const currentWorkbook = workbooks[currentKey] ?? emptyWorkbook(currentChapter.title, workbookConfig);
  const resourceLinks = RESOURCES[currentKey] ?? [];
  const meta = SECTION_META[pageSlug as keyof typeof SECTION_META];
  const mergedCounts = useMemo(() => ({ ...allProgressCounts, [pageSlug]: completedChapters.size }), [allProgressCounts, completedChapters.size, pageSlug]);
  const totalChapterReward = LESSON_XP + CHECKPOINT_XP;
  const totalLearnChapters = Object.values(SECTION_META).reduce((sum, item) => sum + item.total, 0);
  const globalCompletedCount = Object.values(mergedCounts).reduce((sum, total) => sum + total, 0);
  const completedSections = Object.entries(SECTION_META).filter(([slug, item]) => (mergedCounts[slug] ?? 0) >= item.total).length;
  const isPageComplete = completedChapters.size === chapters.length;
  const pageXp = completedChapters.size * totalChapterReward + (isPageComplete ? SECTION_BONUS_XP : 0);
  const globalXp = globalCompletedCount * totalChapterReward + completedSections * SECTION_BONUS_XP;
  const currentLevelIndex = Math.max(LEVELS.findIndex((level, index) => globalXp >= level.minXp && (!LEVELS[index + 1] || globalXp < LEVELS[index + 1].minXp)), 0);
  const currentLevel = LEVELS[currentLevelIndex];
  const nextLevel = LEVELS[currentLevelIndex + 1];
  const levelProgress = nextLevel ? ((globalXp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  useEffect(() => {
    if (!user) {
      setCompletedChapters(new Set());
      setEarnedAchievements(new Set());
      setAllProgressCounts({});
      setWorkbooks({});
      return;
    }

    const loadState = async () => {
      const [progressRes, achievementsRes, workbookRes] = await Promise.all([
        supabase.from("user_progress").select("page_slug, chapter_index").eq("user_id", user.id),
        supabase.from("user_achievements").select("achievement_key").eq("user_id", user.id),
        supabase.from("user_learning_workbooks").select("id, chapter_slug, data").eq("user_id", user.id).eq("page_slug", pageSlug),
      ]);

      if (progressRes.data) {
        const counts = progressRes.data.reduce<Record<string, number>>((acc, row: any) => {
          acc[row.page_slug] = (acc[row.page_slug] ?? 0) + 1;
          return acc;
        }, {});
        setAllProgressCounts(counts);
        setCompletedChapters(new Set(progressRes.data.filter((row: any) => row.page_slug === pageSlug).map((row: any) => row.chapter_index)));
      }

      if (achievementsRes.data) {
        setEarnedAchievements(new Set(achievementsRes.data.map((row: any) => row.achievement_key)));
      }

      if (workbookRes.data) {
        const nextWorkbooks = workbookRes.data.reduce<Record<string, WorkbookState>>((acc, row: any) => {
          const chapter = chapters.find((item) => chapterSlug(item.title) === row.chapter_slug);
          if (!chapter) return acc;
          const key = chapterKey(pageSlug, chapter.title);
          const config = WORKBOOKS[key];
          const fallback = emptyWorkbook(chapter.title, config);
          const data = row.data ?? {};
          acc[key] = {
            id: row.id,
            notes: typeof data.notes === "string" ? data.notes : fallback.notes,
            checklist: Array.isArray(data.checklist) ? fallback.checklist.map((_, index) => Boolean(data.checklist[index])) : fallback.checklist,
            answers: { ...fallback.answers, ...(data.answers && typeof data.answers === "object" ? data.answers : {}) },
          };
          return acc;
        }, {});
        setWorkbooks(nextWorkbooks);
      }
    };

    void loadState();
  }, [chapters, pageSlug, user]);

  useEffect(() => {
    if (completedChapters.size > 0 && completedChapters.size < chapters.length) {
      const firstIncomplete = chapters.findIndex((_, index) => !completedChapters.has(index));
      if (firstIncomplete >= 0) setActiveChapter(firstIncomplete);
    }
  }, [chapters, completedChapters]);

  const updateWorkbook = (updater: (current: WorkbookState) => WorkbookState) => {
    setWorkbooks((previous) => ({ ...previous, [currentKey]: updater(previous[currentKey] ?? emptyWorkbook(currentChapter.title, workbookConfig)) }));
  };

  const awardAchievement = useCallback(async (achievementKey: string) => {
    if (!user) return;
    const { error } = await supabase.from("user_achievements").upsert({ user_id: user.id, achievement_key: achievementKey }, { onConflict: "user_id,achievement_key" });
    if (!error) setEarnedAchievements((previous) => new Set([...previous, achievementKey]));
  }, [user]);

  const saveWorkbook = useCallback(async (withToast = false) => {
    if (!user) return true;
    setSavingWorkbook(true);
    const workbook = workbooks[currentKey] ?? emptyWorkbook(currentChapter.title, workbookConfig);
    const { data, error } = await supabase
      .from("user_learning_workbooks")
      .upsert(
        {
          user_id: user.id,
          page_slug: pageSlug,
          chapter_slug: chapterSlug(currentChapter.title),
          title: currentChapter.title,
          data: { notes: workbook.notes, checklist: workbook.checklist, answers: workbook.answers },
        },
        { onConflict: "user_id,page_slug,chapter_slug" }
      )
      .select("id")
      .single();
    setSavingWorkbook(false);

    if (error) {
      toast({ title: t("Save failed"), description: error.message, variant: "destructive" });
      return false;
    }

    if (data?.id) {
      setWorkbooks((previous) => ({ ...previous, [currentKey]: { ...workbook, id: data.id } }));
    }

    if (withToast) {
      toast({ title: t("Draft saved"), description: t("Your chapter notes are up to date.") });
    }
    return true;
  }, [currentChapter.title, currentKey, pageSlug, t, toast, user, workbookConfig, workbooks]);

  const completeChapter = useCallback(async () => {
    if (!user) {
      toast({ title: t("Login required"), description: t("Sign in to save progress."), variant: "destructive" });
      return;
    }

    if (completedChapters.has(activeChapter)) return;

    const checkpointReady = currentWorkbook.checklist.every(Boolean) && currentWorkbook.notes.trim().length >= 20;
    if (!checkpointReady) {
      toast({
        title: t("Complete the chapter checkpoint"),
        description: t("Finish the checklist and write a short reflection to unlock the reward."),
        variant: "destructive",
      });
      return;
    }

    const saved = await saveWorkbook(false);
    if (!saved) return;

    const { error } = await supabase.from("user_progress").insert({ user_id: user.id, page_slug: pageSlug, chapter_index: activeChapter });
    if (error) {
      toast({ title: t("Progress not saved"), description: error.message, variant: "destructive" });
      return;
    }

    const nextCompleted = new Set([...completedChapters, activeChapter]);
    setCompletedChapters(nextCompleted);
    setAllProgressCounts((previous) => ({ ...previous, [pageSlug]: nextCompleted.size }));

    if (nextCompleted.size === 1) await awardAchievement("first_steps");

    if (nextCompleted.size === chapters.length) {
      await awardAchievement(meta.achievementKey);
      const scholarUnlocked = Object.entries(SECTION_META).every(([slug, item]) => {
        const count = slug === pageSlug ? nextCompleted.size : allProgressCounts[slug] ?? 0;
        return count >= item.total;
      });
      if (scholarUnlocked) await awardAchievement("scholar");
      toast({ title: t("Section mastered"), description: `+${SECTION_BONUS_XP} XP. ${t("Badge unlocked")}.` });
    }

    toast({
      title: t("Chapter completed!"),
      description: `+${totalChapterReward} XP earned. ${nextCompleted.size}/${chapters.length} ${t("Chapters").toLowerCase()} done.`,
    });
  }, [activeChapter, allProgressCounts, awardAchievement, chapters.length, completedChapters, currentWorkbook.checklist, currentWorkbook.notes, meta.achievementKey, pageSlug, saveWorkbook, t, toast, totalChapterReward, user]);

  const milestoneAchievements = ["first_steps", meta.achievementKey, "scholar"];
  const overallProgress = Math.round((globalCompletedCount / totalLearnChapters) * 100);
  const pageProgress = Math.round((completedChapters.size / chapters.length) * 100);
  const remainingChapters = Math.max(chapters.length - completedChapters.size, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">{t(title)}</h1>
          <p className="mx-auto mb-6 max-w-3xl text-muted-foreground">{t(subtitle)}</p>
          <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-4">
            {Object.entries(SECTION_META).map(([slug, item]) => (
              <Link key={slug} to={item.route}>
                <Card className={cn("h-full transition-all hover:shadow-md", slug === pageSlug && "border-primary bg-primary/5")}>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">{item.shortTitle}</p>
                      <Badge variant={slug === pageSlug ? "default" : "secondary"}>{mergedCounts[slug] ?? 0}/{item.total}</Badge>
                    </div>
                    <Progress value={Math.round(((mergedCounts[slug] ?? 0) / item.total) * 100)} className="h-2" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {user && (
          <div className="mx-auto mb-6 grid max-w-6xl gap-4 md:grid-cols-4">
            <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wide text-muted-foreground">{t("Learning XP")}</p><p className="text-2xl font-bold text-foreground">{pageXp}</p></div><Sparkles className="h-5 w-5 text-primary" /></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wide text-muted-foreground">{t("Completed Chapters")}</p><p className="text-2xl font-bold text-foreground">{completedChapters.size}/{chapters.length}</p></div><CheckCircle className="h-5 w-5 text-green-500" /></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wide text-muted-foreground">{t("Founder Level")}</p><p className="text-base font-semibold text-foreground">{currentLevel.name}</p></div><GraduationCap className="h-5 w-5 text-amber-500" /></div><div className="mt-3"><Progress value={Math.min(levelProgress, 100)} className="h-2" /><p className="mt-2 text-xs text-muted-foreground">{nextLevel ? `${globalXp}/${nextLevel.minXp} XP` : t("Max level reached")}</p></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wide text-muted-foreground">{t("Overall Learn Progress")}</p><p className="text-base font-semibold text-foreground">{globalCompletedCount}/{totalLearnChapters}</p></div><Trophy className="h-5 w-5 text-rose-500" /></div><div className="mt-3"><Progress value={overallProgress} className="h-2" /><p className="mt-2 text-xs text-muted-foreground">{overallProgress}% {t("common.completed")}</p></div></CardContent></Card>
          </div>
        )}

        <div className="mx-auto flex max-w-6xl gap-6">
          <div className={cn("flex-shrink-0 transition-all", sidebarOpen ? "w-72" : "w-10")}>
            {sidebarOpen ? (
              <Card className="sticky top-20">
                <CardContent className="space-y-5 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{t("Chapters")}</h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSidebarOpen(false)}><ChevronLeft className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-1">
                    {chapters.map((chapter, index) => (
                      <button key={chapter.title} onClick={() => setActiveChapter(index)} className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors", activeChapter === index ? "bg-primary font-medium text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
                        {completedChapters.has(index) ? <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" /> : <span className="w-3.5 shrink-0 text-center text-xs opacity-70">{index + 1}</span>}
                        <span className="truncate">{t(chapter.title)}</span>
                      </button>
                    ))}
                  </div>
                  {user && (
                    <div className="rounded-2xl border bg-muted/40 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div><p className="text-xs uppercase tracking-wide text-muted-foreground">{t("Badge Progress")}</p><p className="text-sm font-semibold text-foreground">{t("Unlock learning milestones")}</p></div>
                        <Badge variant="secondary">+{SECTION_BONUS_XP} XP</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {milestoneAchievements.map((achievementKey) => <AchievementBadge key={achievementKey} achievementKey={achievementKey} earned={earnedAchievements.has(achievementKey)} size="sm" />)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Button variant="ghost" size="icon" className="sticky top-20" onClick={() => setSidebarOpen(true)}><ChevronRight className="h-4 w-4" /></Button>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-6">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{t("common.chapter")} {activeChapter + 1} {t("common.of")} {chapters.length}</span>
                  {completedChapters.has(activeChapter) && <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600"><CheckCircle className="h-3 w-3" /> {t("common.completed")}</span>}
                  <Badge variant="secondary">+{totalChapterReward} XP</Badge>
                </div>
                <h2 className="mb-6 text-2xl font-bold text-foreground">{t(currentChapter.title)}</h2>
                <div className="prose max-w-none space-y-4 dark:prose-invert">
                  {currentChapter.content.map((paragraph, index) => {
                    if (paragraph.startsWith("## ")) return <h3 key={index} className="mb-3 mt-6 text-lg font-semibold text-foreground">{t(paragraph.slice(3))}</h3>;
                    if (paragraph.startsWith("- ")) return <ul key={index} className="list-disc space-y-1 pl-6 text-muted-foreground">{paragraph.split("\n").map((item, itemIndex) => <li key={itemIndex}>{t(item.replace(/^- /, ""))}</li>)}</ul>;
                    if (paragraph.startsWith("> ")) return <blockquote key={index} className="rounded-r-lg border-l-4 border-primary bg-muted/50 py-3 pl-4 pr-4 italic text-muted-foreground">{t(paragraph.slice(2))}</blockquote>;
                    return <p key={index} className="leading-relaxed text-muted-foreground">{t(paragraph)}</p>;
                  })}
                </div>
              </CardContent>
            </Card>

            {resourceLinks.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><FolderOpen className="h-5 w-5 text-primary" /> {t("Reusable learning resources")}</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {resourceLinks.map((resource) => (
                    <div key={resource.title} className="rounded-2xl border p-4">
                      <h3 className="font-semibold text-foreground">{resource.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{resource.description}</p>
                      <Button asChild variant="outline" className="mt-4 w-full justify-between">
                        {resource.external ? <a href={resource.href} target="_blank" rel="noreferrer">{resource.cta} <ExternalLink className="h-4 w-4" /></a> : <Link to={resource.href}>{resource.cta} <ChevronRight className="h-4 w-4" /></Link>}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader><CardTitle>{workbookConfig?.title ?? t("Chapter notebook")}</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {workbookConfig && <p className="text-sm text-muted-foreground">{workbookConfig.description}</p>}
                {workbookConfig?.fields?.length ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {workbookConfig.fields.map((field) => {
                      const Component = field.type === "textarea" ? Textarea : Input;
                      return (
                        <div key={field.name} className={cn("space-y-2", field.type === "textarea" && "md:col-span-2")}>
                          <label className="text-sm font-medium text-foreground">{field.label}</label>
                          <Component value={currentWorkbook.answers[field.name] ?? ""} placeholder={field.placeholder} onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateWorkbook((current) => ({ ...current, answers: { ...current.answers, [field.name]: event.target.value } }))} className={field.type === "textarea" ? "min-h-[120px]" : undefined} />
                        </div>
                      );
                    })}
                  </div>
                ) : null}
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <div className="mb-4 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /><p className="font-semibold text-foreground">{t("Chapter checkpoint")}</p><Badge variant="secondary">+{CHECKPOINT_XP} XP</Badge></div>
                  <div className="space-y-3">
                    {checklistFor(currentChapter.title).map((item, index) => (
                      <label key={item} className="flex items-start gap-3 rounded-lg border bg-background p-3">
                        <Checkbox checked={Boolean(currentWorkbook.checklist[index])} onCheckedChange={(checked) => updateWorkbook((current) => ({ ...current, checklist: current.checklist.map((value, itemIndex) => itemIndex === index ? Boolean(checked) : value) }))} />
                        <span className="text-sm text-foreground">{item}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    <label className="text-sm font-medium text-foreground">{t("What is the one action you will take next?")}</label>
                    <Textarea value={currentWorkbook.notes} onChange={(event) => updateWorkbook((current) => ({ ...current, notes: event.target.value }))} placeholder={t("Write a short reflection or next step.")} className="min-h-[120px]" />
                  </div>
                  {user ? <div className="mt-4 flex justify-end"><Button variant="outline" onClick={() => void saveWorkbook(true)} disabled={savingWorkbook}><Save className="mr-2 h-4 w-4" />{savingWorkbook ? t("Saving...") : t("Save chapter notes")}</Button></div> : <p className="mt-4 text-sm text-muted-foreground">{t("Sign in to save notes and workbook progress.")}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="rounded-2xl border bg-muted/40 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><p className="text-sm font-semibold text-foreground">{t("Macro reward")}</p><p className="text-sm text-muted-foreground">{isPageComplete ? `${t("Section mastered")} +${SECTION_BONUS_XP} XP.` : `${t("Finish this section to earn")} ${SECTION_BONUS_XP} XP ${t("and unlock the section badge.")}`}</p></div>
                    <Badge variant="secondary">+{SECTION_BONUS_XP} XP</Badge>
                  </div>
                </div>
                {!completedChapters.has(activeChapter) && <Button onClick={() => void completeChapter()} variant="outline" className="mt-8 w-full border-green-500/30 text-green-600 hover:bg-green-500/10"><CheckCircle className="mr-2 h-4 w-4" /> {t("Complete checkpoint & earn XP")}</Button>}
                <div className="mt-4 flex items-center justify-between border-t pt-6">
                  <Button variant="outline" onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))} disabled={activeChapter === 0}><ChevronLeft className="mr-1 h-4 w-4" /> {t("common.previous")}</Button>
                  <div className="text-center text-xs text-muted-foreground"><p>{activeChapter + 1} / {chapters.length}</p><p>{remainingChapters === 0 ? t("Section mastered") : `${remainingChapters} ${t(remainingChapters === 1 ? "chapter to go" : "chapters to go")}`}</p><p>{pageProgress}% {t("common.completed")}</p></div>
                  <Button onClick={() => setActiveChapter(Math.min(chapters.length - 1, activeChapter + 1))} disabled={activeChapter === chapters.length - 1}>{t("common.next")} <ChevronRight className="ml-1 h-4 w-4" /></Button>
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
