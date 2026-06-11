"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Copy, Check } from "lucide-react";

type Platform = "mac" | "windows";

type Command = {
  cmd: string;
  win?: string; // overrides cmd on Windows if different
  description: string;
};

type Section = {
  title: string;
  commands: Command[];
};

const SECTIONS: Section[] = [
  {
    title: "Terminal basics",
    commands: [
      { cmd: "pwd", win: "cd", description: "Print current directory" },
      { cmd: "ls", win: "dir", description: "List files in current directory" },
      {
        cmd: "ls -a",
        win: "dir /a",
        description: "List all files including hidden",
      },
      { cmd: "cd <folder name>", description: "Move into a folder" },
      { cmd: "cd ..", description: "Go up one level" },
      { cmd: "mkdir <folder name>", description: "Create a new folder" },
      {
        cmd: "touch <filename>",
        win: "echo. > <filename>",
        description: "Create an empty file",
      },
      {
        cmd: 'echo "<content>" > <filename>',
        description: "Write content into a file",
      },
      {
        cmd: 'echo "<content>" >> <filename>',
        description: "Append content to a file",
      },
      {
        cmd: "cat <filename>",
        win: "type <filename>",
        description: "Print file contents",
      },
      { cmd: "clear", win: "cls", description: "Clear the terminal" },
      {
        cmd: "mv <source> <destination>",
        win: "move <source> <destination>",
        description: "Move a file or folder",
      },
      {
        cmd: "mv <old name> <new name>",
        win: "ren <old name> <new name>",
        description: "Rename a file",
      },
      {
        cmd: "nano <filename>",
        win: "notepad <filename>",
        description: "Open a simple text editor",
      },
    ],
  },
  {
    title: "Git — setup",
    commands: [
      {
        cmd: 'git config --global user.name "Your Name"',
        description: "Set your name",
      },
      {
        cmd: 'git config --global user.email "you@email.com"',
        description: "Set your email",
      },
      { cmd: "git init", description: "Initialise a new repo" },
      { cmd: "git clone <url>", description: "Clone a remote repo" },
    ],
  },
  {
    title: "Git — day to day",
    commands: [
      { cmd: "git status", description: "See what's changed" },
      { cmd: "git add .", description: "Stage all changes" },
      { cmd: "git add <filename>", description: "Stage a specific file" },
      { cmd: 'git commit -m "message"', description: "Commit with a message" },
      { cmd: "git push", description: "Push commits to GitHub" },
      { cmd: "git pull", description: "Pull latest changes" },
      { cmd: "git log --oneline", description: "View recent commits" },
      { cmd: "git diff", description: "See unstaged changes" },
    ],
  },
  {
    title: "Git — branches",
    commands: [
      { cmd: "git branch", description: "List branches" },
      { cmd: "git branch <name>", description: "Create a new branch" },
      { cmd: "git switch <name>", description: "Switch to a branch" },
      {
        cmd: "git switch -c <name>",
        description: "Create and switch in one step",
      },
      { cmd: "git merge <name>", description: "Merge a branch into current" },
    ],
  },
  {
    title: "Git — undoing things",
    commands: [
      {
        cmd: "git restore <file>",
        description: "Discard unstaged changes to a file",
      },
      { cmd: "git restore --staged <file>", description: "Unstage a file" },
      {
        cmd: "git commit --amend",
        description: "Edit the last commit message",
      },
      {
        cmd: "git revert <hash>",
        description: "Undo a commit by creating a new one",
      },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="hover:bg-muted text-muted-foreground hover:text-foreground rounded p-1 opacity-0 transition-opacity group-hover:opacity-100"
      aria-label="Copy command"
    >
      {copied ? (
        <Check className="size-3 text-emerald-500" />
      ) : (
        <Copy className="size-3" />
      )}
    </button>
  );
}

function CommandRow({
  command,
  platform,
}: {
  command: Command;
  platform: Platform;
}) {
  const display =
    platform === "windows" && command.win ? command.win : command.cmd;

  return (
    <div className="group flex items-start justify-between gap-3 py-2">
      <div className="flex min-w-0 items-start gap-2">
        <CopyButton text={display} />
        <code className="text-foreground text-xs leading-relaxed">
          {display}
        </code>
      </div>
      <span className="text-muted-foreground mt-0.5 shrink-0 text-right text-xs leading-relaxed">
        {command.description}
      </span>
    </div>
  );
}

export function CommandReference() {
  const [platform, setPlatform] = useState<Platform>("mac");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground gap-2 text-xs"
        >
          <BookOpen className="size-3.5" />
          <span className="hidden sm:inline">Reference</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-border/60 space-y-3 border-b px-5 pt-5 pb-4">
          <SheetTitle className="text-sm font-semibold">
            Command reference
          </SheetTitle>

          <Tabs
            value={platform}
            onValueChange={(v) => setPlatform(v as Platform)}
          >
            <TabsList className="h-8 p-0.5">
              <TabsTrigger value="mac" className="h-7 px-3 text-xs">
                macOS / Linux
              </TabsTrigger>
              <TabsTrigger value="windows" className="h-7 px-3 text-xs">
                Windows
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-6 px-5 py-4">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="text-muted-foreground/60 mb-2 text-[10px] tracking-widest uppercase">
                  {section.title}
                </p>
                <div className="divide-border/40 divide-y">
                  {section.commands.map((cmd) => (
                    <CommandRow
                      key={cmd.cmd}
                      command={cmd}
                      platform={platform}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
