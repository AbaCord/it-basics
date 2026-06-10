import { ChallengesGrid } from "@/components/challenges/challenges-grid";
import { SignInButton } from "@/components/sign-in-button";
import { challenges } from "@/lib/challenges/meta";
import { getCompletedChallenges } from "@/lib/queries/completion";
import { getSession } from "@/lib/queries/session";
import { GitFork, Terminal } from "lucide-react";

export default async function ChallengesPage() {
  const session = await getSession();

  const completed = session
    ? await getCompletedChallenges(session.user.id)
    : [];

  const completedSet = new Set(completed.map((c) => c.challengeId));

  const hasForked = completedSet.has("getting-started");

  return (
    <div className="space-y-10">
      {!session ? (
        <div className="border-border/60 bg-muted/30 flex items-center justify-between gap-4 rounded-xl border px-5 py-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Sign in to get started</p>
            <p className="text-muted-foreground text-xs">
              Your progress is saved to your GitHub account.
            </p>
          </div>
          <SignInButton />
        </div>
      ) : !hasForked ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/4 px-5 py-4">
          <GitFork className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Start by forking the repo</p>
            <p className="text-muted-foreground text-xs">
              Challenge 01 walks you through it. All other challenges unlock
              once it&apos;s completed.
            </p>
          </div>
        </div>
      ) : completed.length === challenges.length ? (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/4 px-5 py-4">
          <Terminal className="mt-0.5 size-4 shrink-0 text-emerald-500" />
          <div className="space-y-0.5">
            <p className="text-sm font-medium">All challenges complete.</p>
            <p className="text-muted-foreground text-xs">
              Nice work. You&apos;ve made it through the whole track.
            </p>
          </div>
        </div>
      ) : null}

      <ChallengesGrid completedSet={completedSet} />
    </div>
  );
}
