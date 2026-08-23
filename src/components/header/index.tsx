import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Wordmark } from "./wordmark";
import { challenges } from "@/lib/challenges/meta";
import { Trophy } from "lucide-react";
import { getCompletedChallenges } from "@/lib/queries/completion";
import { Progress } from "@/components/ui/progress";
import { UserButton } from "./user-button";
import { getSession } from "@/lib/queries/session";
import { CommandReference } from "./command-reference";
import { LanguageSwitcher } from "./language-switcher";

async function ProgressPill({ userId }: { userId: string }) {
  const completed = await getCompletedChallenges(userId);

  const count = completed.length;
  const total = challenges.length;
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);

  return (
    <div className="hidden items-center gap-2.5 sm:flex">
      <Progress value={pct} className="bg-muted h-1.5 w-24" />
      <span className="text-muted-foreground text-xs tabular-nums">
        {count}
        <span className="text-muted-foreground/50">/{total}</span>
      </span>
      {count === total && total > 0 && (
        <Trophy className="size-3.5 text-amber-500" />
      )}
    </div>
  );
}

export async function Header() {
  const session = await getSession();

  return (
    <header className="border-border/50 bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <Wordmark />

        <div className="flex items-center gap-4">
          {session && (
            <Suspense
              fallback={
                <Skeleton className="hidden h-1.5 w-24 rounded-full sm:block" />
              }
            >
              <ProgressPill userId={session.user.id} />
            </Suspense>
          )}
          <CommandReference />
          <LanguageSwitcher />
          <UserButton user={session?.user ?? null} />
        </div>
      </div>
    </header>
  );
}
