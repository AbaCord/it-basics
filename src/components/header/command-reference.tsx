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
import { _Translator, useTranslations } from "next-intl";

type Platform = "mac" | "windows";

type Command = {
  cmd: string;
  win?: string; // overrides cmd on Windows if different
  key: string;
};

type Section = {
  key: string;
  commands: Command[];
};

const SECTIONS: Section[] = [
  {
    key: "terminalBasics",
    commands: [
      { cmd: "pwd", win: "cd", key: "pwd" },
      { cmd: "ls", win: "dir", key: "ls" },
      {
        cmd: "ls -a",
        win: "dir /a",
        key: "ls-a",
      },
      { cmd: "cd <folder name>", key: "cd-folder" },
      { cmd: "cd ..", key: "cd-parent" },
      { cmd: "mkdir <folder name>", key: "mkdir" },
      {
        cmd: "touch <filename>",
        win: "echo. > <filename>",
        key: "touch",
      },
      {
        cmd: 'echo "<content>" > <filename>',
        key: "echo-write",
      },
      {
        cmd: 'echo "<content>" >> <filename>',
        key: "echo-append",
      },
      {
        cmd: "cat <filename>",
        win: "type <filename>",
        key: "cat",
      },
      { cmd: "clear", win: "cls", key: "clear" },
      {
        cmd: "mv <source> <destination>",
        win: "move <source> <destination>",
        key: "mv",
      },
      {
        cmd: "mv <old name> <new name>",
        win: "ren <old name> <new name>",
        key: "rename",
      },
      {
        cmd: "nano <filename>",
        win: "notepad <filename>",
        key: "nano",
      },
      {
        cmd: "open <source>",
        win: "start <source>",
        key: "open",
      },
    ],
  },
  {
    key: "gitSetup",
    commands: [
      {
        cmd: 'git config --global user.name "Your Name"',
        key: "user-name",
      },
      {
        cmd: 'git config --global user.email "you@email.com"',
        key: "user-email",
      },
      { cmd: "git init", key: "init" },
      { cmd: "git clone <url>", key: "clone" },
    ],
  },
  {
    key: "gitDayToDay",
    commands: [
      { cmd: "git status", key: "status" },
      { cmd: "git add .", key: "add-all" },
      { cmd: "git add <filename>", key: "add-file" },
      { cmd: 'git commit -m "message"', key: "commit" },
      { cmd: "git push", key: "push" },
      { cmd: "git pull", key: "pull" },
      { cmd: "git log --oneline", key: "log" },
      { cmd: "git diff", key: "diff" },
    ],
  },
  {
    key: "gitBranches",
    commands: [
      { cmd: "git branch", key: "branch" },
      { cmd: "git branch <name>", key: "create-branch" },
      { cmd: "git switch <name>", key: "switch" },
      {
        cmd: "git switch -c <name>",
        key: "create-and-switch",
      },
      { cmd: "git merge <name>", key: "merge" },
    ],
  },
  {
    key: "gitUndoing",
    commands: [
      {
        cmd: "git restore <file>",
        key: "restore",
      },
      { cmd: "git restore --staged <file>", key: "restore-staged" },
      {
        cmd: "git commit --amend",
        key: "amend",
      },
      {
        cmd: "git revert <hash>",
        key: "revert",
      },
    ],
  },
];

function CopyButton({ text, t }: { text: string; t: _Translator }) {
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
      aria-label={t("copy")}
    >
      {copied ? (
        <Check className="size-3 text-emerald-500" />
      ) : (
        <Copy className="size-3 cursor-pointer" />
      )}
    </button>
  );
}

function CommandRow({
  command,
  platform,
  description,
  t,
}: {
  command: Command;
  platform: Platform;
  description: string;
  t: _Translator;
}) {
  const display =
    platform === "windows" && command.win ? command.win : command.cmd;

  return (
    <div className="group flex items-start justify-between gap-3 py-2">
      <div className="flex min-w-0 items-start gap-2">
        <CopyButton text={display} t={t} />
        <code className="text-foreground text-xs leading-relaxed">
          {display}
        </code>
      </div>
      <span className="text-muted-foreground mt-0.5 shrink-0 text-right text-xs leading-relaxed">
        {description}
      </span>
    </div>
  );
}

export function CommandReference() {
  const t = useTranslations("CommandReference");
  const [platform, setPlatform] = useState<Platform>("mac");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground cursor-pointer gap-2 text-xs"
        >
          <BookOpen className="size-3.5" />
          <span className="hidden sm:inline">{t("reference")}</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-border/60 space-y-3 border-b px-5 pt-5 pb-4">
          <SheetTitle className="text-sm font-semibold">
            {t("title")}
          </SheetTitle>

          <Tabs
            value={platform}
            onValueChange={(v) => setPlatform(v as Platform)}
          >
            <TabsList className="h-8 p-0.5">
              <TabsTrigger
                value="mac"
                className="h-7 cursor-pointer px-3 text-xs"
              >
                {t("platform.mac")}
              </TabsTrigger>
              <TabsTrigger
                value="windows"
                className="h-7 cursor-pointer px-3 text-xs"
              >
                {t("platform.windows")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-6 px-5 py-4">
            {SECTIONS.map((section) => (
              <div key={section.key}>
                <p className="text-muted-foreground/60 mb-2 text-[10px] tracking-widest uppercase">
                  {t(`sections.${section.key}.title`)}
                </p>
                <div className="divide-border/40 divide-y">
                  {section.commands.map((cmd) => (
                    <CommandRow
                      key={cmd.cmd}
                      command={cmd}
                      platform={platform}
                      description={t(
                        `sections.${section.key}.commands.${cmd.key}`,
                      )}
                      t={t}
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
