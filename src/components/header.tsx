"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import { LogOut, Trophy } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { challenges } from "@/lib/challenges/meta";
import { usePathname, useRouter } from "next/navigation";

function Wordmark() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <Link href="/">
      <span className="text-lg font-bold tracking-tight">
        <span className="text-foreground">Intro</span>
        <span className="text-violet-500">Course</span>
        <span
          className={cn(
            "ml-0.5 inline-block h-[1.1em] w-0.5 bg-violet-500 align-middle transition-opacity duration-75",
            visible ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
    </Link>
  );
}

function ProgressPill({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="hidden items-center gap-2.5 sm:flex">
      <Progress value={pct} className="bg-muted h-1.5 w-24" />
      <span className="text-muted-foreground text-xs tabular-nums">
        {completed}
        <span className="text-muted-foreground/50">/{total}</span>
      </span>
      {completed === total && total > 0 && (
        <Trophy className="size-3.5 text-amber-500" />
      )}
    </div>
  );
}

type User = {
  name: string;
  image?: string | null;
  email?: string;
};

function UserMenu({ user }: { user: User }) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rouned-full ring-offset-background focus-visible:ring-ring relative h-8 w-8 p-0 focus-visible:ring-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-violet-500/10 text-xs font-semibold text-violet-600">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-foreground text-xs font-medium">@{user.name}</p>
          {user.email && (
            <p className="text-muted-foreground truncate text-xs">
              {user.email}
            </p>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive cursor-pointer gap-2"
        >
          <LogOut className="size-3.5" />
          <span className="text-xs">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type HeaderProps = {
  user: User | null;
  completedCount: number;
};

export function Header({ user, completedCount }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="border-border/50 bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <Wordmark />

        <div className="flex items-center gap-4">
          {user && (
            <ProgressPill
              completed={completedCount}
              total={challenges.length}
            />
          )}

          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button
              size="sm"
              className="gap-2 font-mono text-xs"
              onClick={() =>
                authClient.signIn.social({
                  provider: "github",
                  callbackURL: pathname,
                })
              }
            >
              Sign in with GitHub
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
