import { useCallback, useDeferredValue, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, PageHeader, ScrollSurface, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, ExternalLink, FolderOpen, GraduationCap, Save, Search, Sparkles, Trophy } from "lucide-react";
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
  const [chapterSearch, setChapterSearch] = useState("");
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set());
  const [earnedAchievements, setEarnedAchievements] = useState<Set<string>>(new Set());
  const [allProgressCounts, setAllProgressCounts] = useState<Record<string, number>>({});
  const [workbooks, setWorkbooks] = useState<Record<string, WorkbookState>>({});
  const [savingWorkbook, setSavingWorkbook] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const deferredChapterSearch = useDeferredValue(chapterSearch);

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
  const checkpointReady = currentWorkbook.checklist.every(Boolean) && currentWorkbook.notes.trim().length >= 20;
  const filteredChapterIndices = useMemo(() => {
    const normalizedQuery = deferredChapterSearch.trim().toLowerCase();

    return chapters
      .map((chapter, index) => ({ chapter, index }))
      .filter(({ chapter }) => {
        if (!normalizedQuery) {
          return true;
        }

        const haystack = [chapter.title, ...chapter.content].join(" ").toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .map(({ index }) => index);
  }, [chapters, deferredChapterSearch]);

  useEffect(() => {
    if (filteredChapterIndices.length === 0) {
      return;
    }

    if (!filteredChapterIndices.includes(activeChapter)) {
      setActiveChapter(filteredChapterIndices[0]);
    }
  }, [activeChapter, filteredChapterIndices]);

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Learning workspace"
          title={t(title)}
          description={t(subtitle)}
          actions={
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Object.entries(SECTION_META).map(([slug, item]) => (
                <Link key={slug} to={item.route} className="block">
                  <div
                    className={cn(
                      "min-w-[150px] rounded-[22px] border border-border/70 bg-background/75 p-4 text-left transition-all hover:border-primary/30 hover:bg-background",
                      slug === pageSlug && "border-primary/30 bg-primary/10 shadow-[0_18px_38px_rgba(255,138,61,0.18)]"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">{item.shortTitle}</p>
                      <Badge variant={slug === pageSlug ? "default" : "secondary"}>
                        {mergedCounts[slug] ?? 0}/{item.total}
                      </Badge>
                    </div>
                    <Progress
                      value={Math.round(((mergedCounts[slug] ?? 0) / item.total) * 100)}
                      className="mt-3 h-2"
                    />
                  </div>
                </Link>
              ))}
            </div>
          }
        />

        <section className="soft-grid">
          {[
            {
              label: t("Section progress"),
              value: `${completedChapters.size}/${chapters.length}`,
              detail: `${pageProgress}% ${t("common.completed")}`,
              icon: <BookOpen className="h-5 w-5 text-primary" />,
            },
            {
              label: t("Chapters remaining"),
              value: remainingChapters,
              detail: remainingChapters === 0 ? t("Section mastered") : t("Keep going"),
              icon: <CheckCircle className="h-5 w-5 text-green-500" />,
            },
            {
              label: t("Founder level"),
              value: currentLevel.name,
              detail: nextLevel ? `${globalXp}/${nextLevel.minXp} XP` : t("Max level reached"),
              icon: <GraduationCap className="h-5 w-5 text-amber-500" />,
            },
            {
              label: t("Global learn progress"),
              value: `${globalCompletedCount}/${totalLearnChapters}`,
              detail: `${overallProgress}% ${t("common.completed")}`,
              icon: <Trophy className="h-5 w-5 text-rose-500" />,
            },
          ].map((item) => (
            <Surface key={item.label} className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    {item.value}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted/70">
                  {item.icon}
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
              {item.label === t("Founder level") ? (
                <Progress value={Math.min(levelProgress, 100)} className="h-2" />
              ) : null}
            </Surface>
          ))}
        </section>

        {user ? (
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Surface className="space-y-4">
              <SectionHeading
                eyebrow="Study rhythm"
                title="One lesson rail, one reading stage, one action rail"
                description="The learning workspace is organized like a real product surface so chapters, notes, checkpoints, and rewards stay visible without long vertical jumps."
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="panel-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {t("Learning XP")}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">{pageXp}</p>
                </div>
                <div className="panel-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {t("Completed chapters")}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">{completedChapters.size}</p>
                </div>
                <div className="panel-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {t("Badge track")}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">
                    {earnedAchievements.size}/{milestoneAchievements.length}
                  </p>
                </div>
              </div>
            </Surface>

            <Surface className="space-y-4">
              <SectionHeading
                eyebrow="Milestones"
                title="Keep rewards visible"
                description="You should be able to see your progress and badge track without leaving the learning flow."
              />
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
            </Surface>
          </section>
        ) : (
          <Surface className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Learning sync
              </p>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                Sign in to save chapter notes, progress, and badges
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                You can browse lessons without logging in, but workbooks and rewards only persist for signed-in founders.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/login">Sign in</Link>
            </Button>
          </Surface>
        )}

        <section className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
          <div className={cn("transition-all", sidebarOpen ? "w-full xl:w-[280px]" : "w-full xl:w-14")}>
            {sidebarOpen ? (
              <ScrollSurface className="sticky top-24 xl:max-h-[calc(100vh-8rem)] p-5">
                <div className="compact-scroll space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        {t("Chapter navigator")}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                        {t("Chapters")}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-2xl"
                      onClick={() => setSidebarOpen(false)}
                      aria-label="Collapse chapter navigator"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={chapterSearch}
                      onChange={(event) => setChapterSearch(event.target.value)}
                      placeholder="Search chapters..."
                      className="h-12 rounded-2xl border-border/70 bg-muted/35 pl-11"
                      aria-label="Search chapters"
                    />
                  </div>

                  <div className="panel-muted p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {meta.shortTitle} track
                    </div>
                    <div className="mt-2 font-display text-2xl font-semibold text-foreground">{pageProgress}%</div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {completedChapters.size} of {chapters.length} chapters completed.
                    </p>
                    <Progress value={pageProgress} className="mt-3 h-2" />
                  </div>

                  {filteredChapterIndices.length === 0 ? (
                    <EmptyState
                      className="rounded-[24px] border-dashed py-10"
                      icon={<Search className="h-6 w-6" />}
                      title="No chapters match"
                      description="Try another term or clear the search to see the full lesson map."
                    />
                  ) : (
                    <div className="space-y-2">
                      {filteredChapterIndices.map((index) => {
                        const chapter = chapters[index];

                        return (
                          <button
                            key={chapter.title}
                            onClick={() => setActiveChapter(index)}
                            className={cn(
                              "flex w-full items-start gap-3 rounded-[22px] border px-4 py-3 text-left transition-all",
                              activeChapter === index
                                ? "border-primary/30 bg-primary/10 text-foreground shadow-[0_14px_28px_rgba(255,138,61,0.14)]"
                                : "border-border/70 bg-background/68 text-muted-foreground hover:border-primary/20 hover:bg-background"
                            )}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted/80 text-xs font-semibold text-foreground">
                              {completedChapters.has(index) ? <CheckCircle className="h-4 w-4 text-green-500" /> : index + 1}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-foreground">{t(chapter.title)}</div>
                              <div className="mt-1 text-xs leading-5 text-muted-foreground">
                                {completedChapters.has(index) ? t("Checkpoint completed") : t("Open lesson")}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </ScrollSurface>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="sticky top-24 h-12 w-12 rounded-2xl border border-border/70 bg-card/85"
                onClick={() => setSidebarOpen(true)}
                aria-label="Expand chapter navigator"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          <ScrollSurface className="xl:max-h-[calc(100vh-8rem)] p-0">
            <div className="compact-scroll p-5 sm:p-6 lg:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {t("common.chapter")} {activeChapter + 1} {t("common.of")} {chapters.length}
                </span>
                {completedChapters.has(activeChapter) ? (
                  <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600">
                    <CheckCircle className="h-3 w-3" /> {t("common.completed")}
                  </span>
                ) : null}
                <Badge variant="secondary">+{totalChapterReward} XP</Badge>
              </div>

              <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-[2.5rem]">
                    {t(currentChapter.title)}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Read the lesson in the center, keep your notes and checkpoint on the right, and move chapter by chapter instead of one long vertical document.
                  </p>
                </div>

                <div className="panel-muted min-w-[180px] p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {t("Macro reward")}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-foreground">+{SECTION_BONUS_XP} XP</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Finish all chapters in this track to unlock the section badge.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {currentChapter.content.map((paragraph, index) => {
                  if (paragraph.startsWith("## ")) {
                    return (
                      <div key={index} className="space-y-2">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Key lesson</div>
                        <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                          {t(paragraph.slice(3))}
                        </h3>
                      </div>
                    );
                  }

                  if (paragraph.startsWith("- ")) {
                    return (
                      <div key={index} className="panel-muted p-4">
                        <ul className="space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
                          {paragraph.split("\n").map((item, itemIndex) => (
                            <li key={itemIndex} className="list-disc">
                              {t(item.replace(/^- /, ""))}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }

                  if (paragraph.startsWith("> ")) {
                    return (
                      <div key={index} className="rounded-[24px] border border-primary/20 bg-primary/8 px-5 py-4 text-sm italic leading-7 text-muted-foreground">
                        {t(paragraph.slice(2))}
                      </div>
                    );
                  }

                  return (
                    <p key={index} className="max-w-4xl text-[15px] leading-8 text-muted-foreground sm:text-base">
                      {t(paragraph)}
                    </p>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="panel-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {t("Checkpoint status")}
                  </div>
                  <div className="mt-2 font-semibold text-foreground">
                    {checkpointReady ? t("Ready to complete") : t("Still in progress")}
                  </div>
                </div>
                <div className="panel-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {t("Chapters remaining")}
                  </div>
                  <div className="mt-2 font-semibold text-foreground">
                    {remainingChapters === 0 ? t("Section mastered") : `${remainingChapters} ${t(remainingChapters === 1 ? "chapter to go" : "chapters to go")}`}
                  </div>
                </div>
                <div className="panel-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {t("Current level")}
                  </div>
                  <div className="mt-2 font-semibold text-foreground">{currentLevel.name}</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-6">
                <Button
                  variant="ghost"
                  className="glass-button h-11"
                  onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
                  disabled={activeChapter === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t("common.previous")}
                </Button>
                <div className="text-center text-xs leading-5 text-muted-foreground">
                  <p>{activeChapter + 1} / {chapters.length}</p>
                  <p>{pageProgress}% {t("common.completed")}</p>
                </div>
                <Button
                  className="h-11 rounded-2xl px-5"
                  onClick={() => setActiveChapter(Math.min(chapters.length - 1, activeChapter + 1))}
                  disabled={activeChapter === chapters.length - 1}
                >
                  {t("common.next")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </ScrollSurface>

          <ScrollSurface className="xl:max-h-[calc(100vh-8rem)] p-5">
            <div className="compact-scroll space-y-5">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Action rail</div>
                <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {workbookConfig?.title ?? t("Chapter notebook")}
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {workbookConfig?.description ?? "Capture the learning in your own words and convert the chapter into action."}
                </p>
              </div>

              {workbookConfig?.fields?.length ? (
                <div className="space-y-4">
                  {workbookConfig.fields.map((field) => {
                    const Component = field.type === "textarea" ? Textarea : Input;
                    return (
                      <div key={field.name} className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{field.label}</label>
                        <Component
                          value={currentWorkbook.answers[field.name] ?? ""}
                          placeholder={field.placeholder}
                          onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                            updateWorkbook((current) => ({
                              ...current,
                              answers: { ...current.answers, [field.name]: event.target.value },
                            }))
                          }
                          className={field.type === "textarea" ? "min-h-[112px] rounded-[22px]" : "h-12 rounded-[22px]"}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className="panel-muted p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-foreground">{t("Chapter checkpoint")}</p>
                  <Badge variant="secondary">+{CHECKPOINT_XP} XP</Badge>
                </div>
                <div className="space-y-3">
                  {checklistFor(currentChapter.title).map((item, index) => (
                    <label key={item} className="flex items-start gap-3 rounded-[18px] border border-border/70 bg-background/65 p-3">
                      <Checkbox
                        checked={Boolean(currentWorkbook.checklist[index])}
                        onCheckedChange={(checked) =>
                          updateWorkbook((current) => ({
                            ...current,
                            checklist: current.checklist.map((value, itemIndex) =>
                              itemIndex === index ? Boolean(checked) : value
                            ),
                          }))
                        }
                      />
                      <span className="text-sm text-foreground">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("What is the one action you will take next?")}</label>
                  <Textarea
                    value={currentWorkbook.notes}
                    onChange={(event) => updateWorkbook((current) => ({ ...current, notes: event.target.value }))}
                    placeholder={t("Write a short reflection or next step.")}
                    className="min-h-[130px] rounded-[22px]"
                  />
                </div>
              </div>

              {resourceLinks.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <FolderOpen className="h-4 w-4 text-primary" />
                    {t("Reusable learning resources")}
                  </div>
                  {resourceLinks.map((resource) => (
                    <div key={resource.title} className="panel-muted p-4">
                      <h4 className="font-semibold text-foreground">{resource.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.description}</p>
                      <Button asChild variant="ghost" className="glass-button mt-4 h-10 w-full justify-between">
                        {resource.external ? (
                          <a href={resource.href} target="_blank" rel="noreferrer">
                            {resource.cta}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <Link to={resource.href}>
                            {resource.cta}
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="grid gap-3">
                <div className="panel-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Badge track")}</div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
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
                <div className="panel-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Macro reward")}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {isPageComplete ? `${t("Section mastered")} +${SECTION_BONUS_XP} XP.` : `${t("Finish this section to earn")} ${SECTION_BONUS_XP} XP ${t("and unlock the section badge.")}`}
                  </p>
                </div>
              </div>

              {user ? (
                <div className="grid gap-3">
                  <Button variant="ghost" className="glass-button h-11" onClick={() => void saveWorkbook(true)} disabled={savingWorkbook}>
                    <Save className="mr-2 h-4 w-4" />
                    {savingWorkbook ? t("Saving...") : t("Save chapter notes")}
                  </Button>
                  {!completedChapters.has(activeChapter) ? (
                    <Button onClick={() => void completeChapter()} className="h-11 rounded-2xl" disabled={!checkpointReady}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {checkpointReady ? t("Complete checkpoint & earn XP") : t("Finish the checkpoint first")}
                    </Button>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t("Sign in to save notes and workbook progress.")}</p>
              )}
            </div>
          </ScrollSurface>
        </section>
      </SiteContainer>
    </div>
  );
};

export default LearnPage;
