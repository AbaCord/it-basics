import { ORG_NAME, REPO_NAME } from "@/constants";
import { RepoCheck } from "./checks";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  genre: "terminal" | "git";
} & ({ type: "flag"; flag: string } | { type: "repo"; checks: RepoCheck[] });

export const challenges = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: `# Forking the Challenge Repository

Before you can complete the remaining challenges, you need your own copy of the challenge repository. This allows you to commit your work and push your solutions to GitHub.

1. Create a **public fork** of the [challenge repository](https://github.com/${ORG_NAME}/${REPO_NAME}).
2. Keep the repository name unchanged: **${REPO_NAME}**.
3. Clone your fork locally so you can start working on the challenges.

Once your fork is set up, you'll be ready to continue with the rest of the course.`,
    genre: "git",
    type: "repo",
    checks: [{ type: "fork_exists" }],
  },
] as const satisfies Challenge[];
