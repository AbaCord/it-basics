import { ORG_NAME, REPO_NAME } from "@/constants";
import { RepoCheck } from "./checks";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  genre: "terminal" | "git";
} & ({ type: "flag"; flag: string } | { type: "repo"; checks: RepoCheck[] });

export const challenges: Challenge[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: `# Forking the Challenge Repository

Before you can complete the remaining challenges, you need your own copy of the challenge repository. This allows you to commit your work and push your solutions to GitHub.

## 1. Fork the repositoy

Click the **fork** button on the challenge repository at [https://github.com/${ORG_NAME}/${REPO_NAME}](https://github.com/${ORG_NAME}/${REPO_NAME}):

![Fork button](/github-fork-button.png)

Keep the repository name unchanged: **${REPO_NAME}**.

After forking, you should see the repository under your GitHub account:

![Forked repository under your account](/github-fork-success.png)

## 2. Clone your fork locally

Click the **Code** button and copy the HTTPS URL:

![GitHub clone URL dropdown](/github-url-dropdown.png)

Inside your terminal, navigate to the folder you want to clone the challenges into. Replace *<folder>* with the absolute or relative path of your desired folder:

\`\`\`sh
cd <folder>
\`\`\`

Clone your fork into the folder by replacing *<url>* with the link you copied:

\`\`\`sh
git clone <url>
\`\`\`

Once your fork is set up, you'll be ready to continue with the rest of the challenges.`,
    genre: "git",
    type: "repo",
    checks: [{ type: "fork_exists" }],
  },
  {
    id: "flag",
    title: "Flag test",
    description: "# Enter the flag FLAG{test}",
    genre: "terminal",
    type: "flag",
    flag: "FLAG{test}",
  },
];
