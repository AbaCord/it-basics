"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  GitFork,
  Flag,
  CheckCircle2,
  XCircle,
  CircleDot,
  Loader2,
  Terminal,
} from "lucide-react";
import { Challenge } from "@/lib/challenges/meta";

type CheckResult = { passed: boolean; message: string };

type ChallengeCardProps = {
  challenge: Challenge;
};

function TaskTypeBadge({ type }: { type: Challenge["type"] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 text-[10px] tracking-widest uppercase",
        type === "repo"
          ? "border-violet-500/40 bg-violet-500/5 text-violet-500"
          : "border-amber-500/40 bg-amber-500/5 text-amber-500",
      )}
    >
      {type === "repo" ? (
        <GitFork className="size-3" />
      ) : (
        <Flag className="size-3" />
      )}
      {type === "repo" ? "GitHub" : "Flag"}
    </Badge>
  );
}

function CompletedBadge() {
  return (
    <Badge className="gap-1.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">
      <CheckCircle2 className="size-3.5" />
      Completed
    </Badge>
  );
}

function CheckResultsList({ results }: { results: CheckResult[] }) {
  return (
    <div className="border-border bg-muted/40 space-y-2 rounded-md border p-3">
      <p className="text-muted-foreground text-[10px] tracking-widest uppercase">
        Checks
      </p>
      <ul className="space-y-1.5">
        {results.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            {r.passed ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            ) : (
              <XCircle className="text-destructive mt-0.5 size-4 shrink-0" />
            )}
            <span
              className={cn(
                "text-xs leading-relaxed",
                r.passed
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-destructive",
              )}
            >
              {r.message}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChallengeCard({ challenge: task }: ChallengeCardProps) {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flagInput, setFlagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkResults, setCheckResults] = useState<CheckResult[]>([]);

  async function handleRepoSubmit() {
    setCompleted(true);
  }

  async function handleFlagSubmit() {}

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "border-border/60 bg-card",
        completed && "border-emerald-500/30 bg-emerald-500/[0.02]",
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-0.5 transition-colors duration-300",
          completed
            ? "bg-emerald-500"
            : task.type === "repo"
              ? "bg-violet-500/50 group-hover:bg-violet-500"
              : "bg-amber-500/50 group-hover:bg-amber-500",
        )}
      />

      <CardHeader className="pb-3 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <TaskTypeBadge type={task.type} />
            {completed && <CompletedBadge />}
          </div>
          {!completed && (
            <CircleDot className="text-muted-foreground/30 mt-0.5 size-4 shrink-0" />
          )}
        </div>

        <h3 className="text-foreground mt-2 text-base font-semibold tracking-tight">
          {task.title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4 pl-5">
        <div className="prose dark:prose-invert w-full max-w-none">
          <ReactMarkdown>{task.description}</ReactMarkdown>
        </div>

        {checkResults.length > 0 && <CheckResultsList results={checkResults} />}

        {error && (
          <Alert variant="destructive" className="py-2">
            <Terminal className="size-4" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>

      {!completed && (
        <>
          <Separator className="mx-5 w-auto" />
          <CardFooter className="pt-4 pl-5">
            {task.type === "repo" ? (
              <Button
                onClick={handleRepoSubmit}
                disabled={loading}
                className="gap-2 text-xs"
              >
                {loading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <GitFork className="size-3.5" />
                )}
                {loading ? "Checking…" : "Validate"}
              </Button>
            ) : (
              <div className="flex w-full gap-2">
                <Input
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFlagSubmit()}
                  placeholder="FLAG{...}"
                  className="h-9 flex-1 text-xs"
                  disabled={loading}
                />
                <Button
                  onClick={handleFlagSubmit}
                  disabled={loading || !flagInput.trim()}
                  size="sm"
                  className="shrink-0 gap-2 text-xs"
                >
                  {loading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Flag className="size-3.5" />
                  )}
                  {loading ? "…" : "Submit"}
                </Button>
              </div>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  );
}
