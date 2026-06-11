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

Keep the repository name unchanged: **${REPO_NAME}**, and uncheck the "Copy the main branch only" option.

![Fork options](/github-fork-options.png)

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
    id: "where-am-i",
    title: "Where am I?",
    type: "flag",
    genre: "terminal",
    flag: "FLAG{you_found_me}",
    description: `
Open your terminal and navigate into your cloned repo.

Somewhere in the \`where-am-i/\` folder there's a file containing a flag. Use the terminal to find it and read its contents. The reference panel lists the commands for listing and reading files.

Enter the flag below once you find it.
    `.trim(),
  },
  {
    id: "hidden-in-plain-sight",
    title: "Hidden in plain sight",
    type: "flag",
    genre: "terminal",
    flag: "FLAG{look_closely}",
    description: `
Navigate into the \`hidden-in-plain-sight/\` folder.

There are a lot of files in there. One of them contains the flag in its name.

List the files and look carefully.
    `.trim(),
  },
  {
    id: "going-deeper",
    title: "Going deeper",
    type: "flag",
    genre: "terminal",
    flag: "FLAG{keep_digging}",
    description: `
The \`going-deeper/\` folder contains several nested directories.

The flag is hidden inside a file somewhere at the bottom of the tree. Navigate your way down, each level has a clue about whether to keep going.
    `.trim(),
  },
  {
    id: "the-invisible-ones",
    title: "The invisible ones",
    type: "flag",
    genre: "terminal",
    flag: "FLAG{hidden_in_plain_sight}",
    description: `
Navigate into the \`the-invisible-ones/\` folder and list its contents.

You'll see a couple of files, but the flag isn't in any of them. There's another file in there that doesn't show up by default.

Some files are hidden from normal directory listings. The reference panel shows the flag that makes them visible.
    `.trim(),
  },
  {
    id: "first-commit",
    title: "Your first commit",
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
    description: `
Now that you know your way around the terminal, it's time to start using Git.

Git tracks changes to files over time. A **commit** is a saved snapshot, like a checkpoint you can always go back to.

Inside the \`first-commit/\` folder, write anything you like into a file called \`notes.txt\`. Then stage it, commit it, and push it to GitHub.

A commit needs a message describing what changed. A common format is \`type: description\`, for example \`feat: add notes\` or \`docs: add readme\`. Use that format here.
    `.trim(),
  },
  {
    id: "edit-and-push",
    title: "Edit and push",
    type: "repo",
    genre: "git",
    checks: [
      {
        type: "file_matches",
        path: "edit-and-push/about.txt",
        pattern: "Name:\\s.+",
      },
    ],
    description: `
Most of your time with Git will be spent editing existing files, not creating new ones.

Open \`edit-and-push/about.txt\` in a text editor and fill in your name and the about section. Save it, then stage, commit, and push your changes.
    `.trim(),
  },
  {
    id: "gitignore",
    title: "Keep secrets secret",
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
    description: `
Not everything in a project should be committed. API keys, passwords, and some generated files should stay off GitHub.

Git has a mechanism for this: a file called \`.gitignore\`. Any path listed inside it will be ignored, Git won't track it, and it won̈́'t show up when you run \`git status\`.

Inside \`gitignore/\` there's a \`secrets/\` folder containing a fake API key. Create a \`.gitignore\` file in the \`gitignore/\` folder that tells Git to ignore it, then commit and push.

You can read documentation [here](https://git-scm.com/docs/gitignore) if you want, or search on the internet, if you're not sure what to do.
    `.trim(),
  },
  {
    id: "find-the-bug",
    title: "Find the bug",
    type: "repo",
    genre: "terminal",
    checks: [{ type: "file_exists", path: "find-the-bug/assets/style.css" }],
    description: `
In \`find-the-bug/\` there's a small webpage. Read \`index.html\` and look at what it's trying to load, then look at what's actually there.

The stylesheet exists, but it's not where the HTML expects it. Move it to the right place and push your changes.
    `.trim(),
  },
  {
    id: "missing-image",
    title: "Missing image",
    type: "repo",
    genre: "terminal",
    checks: [{ type: "file_exists", path: "missing-image/assets/hero.png" }],
    description: `
Same project, new problem. The stylesheet is in the right place now, but the page references an image that can't be found.
 
Look at where \`index.html\` expects the image to be, then find where it actually is and move it.
    `.trim(),
  },
  {
    id: "broken-link",
    title: "Broken link",
    type: "repo",
    genre: "terminal",
    checks: [{ type: "file_exists", path: "broken-link/about.html" }],
    description: `
The nav in \`broken-link/index.html\` has a link to an About page, but clicking it would lead nowhere.
 
The file exists, it just has the wrong name. Rename it to match what the HTML expects, then commit and push.
    `.trim(),
  },
];
