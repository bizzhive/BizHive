import { cn } from "@/lib/utils";

type ClayGraphicProps = {
  className?: string;
  compact?: boolean;
};

export const ClayGraphic = ({ className, compact = false }: ClayGraphicProps) => {
  return (
    <div className={cn("relative isolate overflow-hidden rounded-[32px]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,190,135,0.95),transparent_34%),radial-gradient(circle_at_78%_24%,rgba(255,126,83,0.92),transparent_28%),radial-gradient(circle_at_74%_72%,rgba(207,99,88,0.88),transparent_32%),radial-gradient(circle_at_32%_76%,rgba(255,235,205,0.96),transparent_34%),linear-gradient(165deg,rgba(255,249,243,0.96),rgba(245,229,216,0.82))] dark:bg-[radial-gradient(circle_at_22%_18%,rgba(255,155,84,0.55),transparent_30%),radial-gradient(circle_at_78%_24%,rgba(181,84,63,0.56),transparent_30%),radial-gradient(circle_at_70%_72%,rgba(129,49,40,0.66),transparent_28%),radial-gradient(circle_at_30%_76%,rgba(83,36,30,0.82),transparent_34%),linear-gradient(165deg,rgba(59,33,29,0.98),rgba(31,18,17,0.96))]" />
      <div className="absolute -left-5 top-8 h-24 w-24 rounded-[30px] bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_24px_40px_rgba(213,96,43,0.22)] dark:bg-white/8 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_26px_50px_rgba(0,0,0,0.35)]" />
      <div className="absolute left-1/2 top-6 h-28 w-28 -translate-x-1/2 rounded-[38px] bg-[linear-gradient(180deg,#ffbf7b,#ff8848)] shadow-[inset_0_8px_20px_rgba(255,255,255,0.28),0_28px_48px_rgba(233,113,58,0.26)]" />
      <div className="absolute right-8 top-16 h-20 w-20 rounded-full bg-[linear-gradient(180deg,#f9f1eb,#ffccb1)] shadow-[inset_0_6px_18px_rgba(255,255,255,0.45),0_18px_32px_rgba(184,92,54,0.22)] dark:bg-[linear-gradient(180deg,rgba(255,231,214,0.2),rgba(146,70,54,0.72))]" />
      <div className="absolute bottom-8 left-10 h-20 w-20 rounded-[26px] bg-[linear-gradient(180deg,#fff5ec,#ffdcb5)] shadow-[inset_0_6px_18px_rgba(255,255,255,0.5),0_18px_32px_rgba(195,101,51,0.18)] dark:bg-[linear-gradient(180deg,rgba(255,222,205,0.16),rgba(120,48,39,0.72))]" />
      <div className="absolute bottom-8 right-10 h-24 w-24 rounded-[28px] bg-[linear-gradient(180deg,#ff9f63,#ff6f3d)] shadow-[inset_0_6px_18px_rgba(255,255,255,0.24),0_22px_40px_rgba(215,97,40,0.24)]" />

      {!compact ? (
        <>
          <div className="absolute left-14 top-1/2 h-16 w-16 rounded-full bg-white/55 shadow-[inset_0_6px_18px_rgba(255,255,255,0.6),0_20px_36px_rgba(210,120,70,0.18)] dark:bg-white/10" />
          <div className="absolute bottom-1/4 right-1/3 h-14 w-14 rounded-[20px] bg-[linear-gradient(180deg,#ffe2c9,#ffc37c)] shadow-[inset_0_6px_18px_rgba(255,255,255,0.5),0_18px_30px_rgba(201,103,55,0.18)]" />
        </>
      ) : null}
    </div>
  );
};
