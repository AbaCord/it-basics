"use client";

import { Link } from "@/i18n/navigation";
import { Challenge, challenges } from "@/lib/challenges/meta";
import { cn } from "@/lib/utils";
import { Lock, GitFork, Flag, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

const forkId = challenges[0].id;

const TYPE_CONFIG = {
  repo: {
    icon: GitFork,
  },
  flag: {
    icon: Flag,
  },
} as const;

type ChallengesGridProps = {
  challenges: Challenge[];
  completedSet: Set<Challenge["id"]>;
};

export function ChallengesGrid({
  challenges,
  completedSet,
}: ChallengesGridProps) {
  const t = useTranslations("ChallengesGrid");

  const hasForked = completedSet.has(forkId);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {challenges.map((c, index) => {
        const isFork = c.id === forkId;
        const completed = completedSet.has(c.id);
        const locked = !isFork && !hasForked;
        const typeConfig = TYPE_CONFIG[c.type as keyof typeof TYPE_CONFIG];
        const Icon = typeConfig?.icon;

        return (
          <Link
            key={c.id}
            href={`/${c.id}`}
            onClick={(e) => locked && e.preventDefault()}
            aria-disabled={locked}
            className={cn(
              "group relative flex flex-col rounded-xl border p-5 transition-all duration-200 outline-none",
              "focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
              !completed &&
                !locked &&
                !isFork &&
                "border-border/60 bg-card hover:border-border hover:bg-muted/30",
              isFork &&
                !completed &&
                "border-amber-500/30 bg-amber-500/3 hover:border-amber-500/50",
              completed && "border-emerald-500/25 bg-emerald-500/3",
              locked && "cursor-default",
            )}
          >
            {locked && (
              <div className="bg-background/70 absolute inset-0 z-10 flex items-center justify-center rounded-xl backdrop-blur-[2px]">
                <div className="text-muted-foreground/60 flex items-center gap-1.5 text-xs">
                  <Lock className="size-3" />
                  {t("locked")}
                </div>
              </div>
            )}

            <div className="mb-4 flex items-start justify-between">
              <span
                className={cn(
                  "text-3xl leading-none font-bold tracking-tighter tabular-nums",
                  completed
                    ? "text-emerald-500/40"
                    : "text-muted-foreground/20",
                  isFork && !completed && "text-amber-500/30",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {completed ? (
                <CheckCircle2 className="mt-0.5 size-4 text-emerald-500" />
              ) : isFork ? (
                <span className="mt-1 text-[10px] tracking-widest text-amber-500/70 uppercase">
                  {t("startHere")}
                </span>
              ) : null}
            </div>

            <h3
              className={cn(
                "flex-1 text-sm leading-snug font-semibold",
                completed && "text-muted-foreground",
              )}
            >
              {c.title}
            </h3>

            {typeConfig && (
              <div className="mt-4 flex items-center gap-1.5">
                <Icon
                  className={cn(
                    "size-3",
                    completed
                      ? "text-muted-foreground/40"
                      : "text-muted-foreground/50",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px]",
                    completed
                      ? "text-muted-foreground/40"
                      : "text-muted-foreground/50",
                  )}
                >
                  {isFork ? t("forkRepo") : t(`type.${c.type}`)}
                </span>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
