import { useTranslation } from "react-i18next";
import { Award, BookOpen, Rocket, TrendingUp, GraduationCap, Users, Wrench, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const ACHIEVEMENT_CONFIG: Record<string, { icon: typeof Award; gradient: string; tKey: string; label: string }> = {
  first_steps: { icon: BookOpen, gradient: "from-amber-400 to-orange-500", tKey: "firstSteps", label: "First Steps" },
  strategist: { icon: Award, gradient: "from-blue-500 to-cyan-500", tKey: "strategist", label: "Strategist" },
  launch_ready: { icon: Rocket, gradient: "from-violet-500 to-purple-600", tKey: "launchReady", label: "Launch Ready" },
  growth_master: { icon: TrendingUp, gradient: "from-emerald-500 to-green-600", tKey: "growthMaster", label: "Growth Master" },
  scholar: { icon: GraduationCap, gradient: "from-rose-500 to-pink-500", tKey: "scholar", label: "Scholar" },
  community_voice: { icon: Users, gradient: "from-indigo-500 to-blue-600", tKey: "communityVoice", label: "Community Voice" },
  tool_master: { icon: Wrench, gradient: "from-teal-500 to-cyan-600", tKey: "toolMaster", label: "Tool Master" },
  resource_navigator: { icon: FolderOpen, gradient: "from-sky-500 to-indigo-600", tKey: "resourceNavigator", label: "Resource Navigator" },
};

interface AchievementBadgeProps {
  achievementKey: string;
  earned: boolean;
  size?: "sm" | "md";
}

const AchievementBadge = ({ achievementKey, earned, size = "md" }: AchievementBadgeProps) => {
  const { t } = useTranslation();
  const config = ACHIEVEMENT_CONFIG[achievementKey];
  if (!config) return null;

  const Icon = config.icon;
  const isMd = size === "md";

  return (
    <div className={cn("flex flex-col items-center text-center gap-1.5", !earned && "opacity-30 grayscale")}>
      <div className={cn(
        "rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-md transition-transform",
        config.gradient,
        isMd ? "w-14 h-14" : "w-10 h-10",
        earned && "hover:scale-110"
      )}>
        <Icon className={cn("text-white", isMd ? "h-7 w-7" : "h-5 w-5")} />
      </div>
      <span className={cn("font-semibold text-foreground", isMd ? "text-xs" : "text-[10px]")}>
        {t(`achievements.${config.tKey}`, { defaultValue: config.label })}
      </span>
    </div>
  );
};

export { ACHIEVEMENT_CONFIG };
export default AchievementBadge;
