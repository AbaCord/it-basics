import { RepoCheck } from "./checks";

export type Challenge = ChallengeMeta & {
  title: string;
  description: string;
};
export type ChallengeMeta = {
  id: string;
  genre: "terminal" | "git";
} & ({ type: "flag"; flag: string } | { type: "repo"; checks: RepoCheck[] });

export const challenges: ChallengeMeta[] = [
  {
    id: "getting-started",
    genre: "git",
    type: "repo",
    checks: [{ type: "fork_exists" }],
  },
  {
    id: "where-am-i",
    type: "flag",
    genre: "terminal",
    flag: "FLAG{you_found_me}",
  },
  {
    id: "hidden-in-plain-sight",
    type: "flag",
    genre: "terminal",
    flag: "FLAG{look_closely}",
  },
  {
    id: "going-deeper",
    type: "flag",
    genre: "terminal",
    flag: "FLAG{keep_digging}",
  },
  {
    id: "the-invisible-ones",
    type: "flag",
    genre: "terminal",
    flag: "FLAG{hidden_in_plain_sight}",
  },
  {
    id: "first-commit",
    type: "repo",
    genre: "git",
    checks: [
      { type: "file_exists", path: "first-commit/notes.txt" },
      {
        type: "commit_message",
        pattern: "^(feat|fix|docs|chore):.*",
        limit: 1,
      },
    ],
  },
  {
    id: "edit-and-push",
    type: "repo",
    genre: "git",
    checks: [
      {
        type: "file_matches",
        path: "edit-and-push/about.txt",
        pattern: "Name:\\s.+",
      },
    ],
  },
  {
    id: "gitignore",
    type: "repo",
    genre: "git",
    checks: [
      { type: "file_exists", path: "gitignore/.gitignore" },
      {
        type: "file_matches",
        path: "gitignore/.gitignore",
        pattern: "secrets",
      },
    ],
  },
  {
    id: "find-the-bug",
    type: "repo",
    genre: "terminal",
    checks: [{ type: "file_exists", path: "find-the-bug/assets/style.css" }],
  },
  {
    id: "missing-images",
    type: "repo",
    genre: "terminal",
    checks: [
      { type: "file_exists", path: "missing-images/assets/aurora.jpg" },
      { type: "file_exists", path: "missing-images/assets/fjord.jpg" },
      { type: "file_exists", path: "missing-images/assets/hero.jpg" },
      { type: "file_exists", path: "missing-images/assets/mountains.jpg" },
    ],
  },
  {
    id: "broken-link",
    type: "repo",
    genre: "terminal",
    checks: [{ type: "file_exists", path: "broken-link/about.html" }],
  },
  {
    id: "time-traveler",
    type: "flag",
    genre: "git",
    flag: "FLAG{history_reveals_what_was_deleted}",
  },
  {
    id: "system-diagnostics",
    type: "flag",
    genre: "git",
    flag: "FLAG{wednesday_lunchtime_diagnostics}",
  },
];
