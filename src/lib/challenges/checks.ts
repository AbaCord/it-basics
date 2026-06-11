import { GITHUB_API, ORG_NAME, REPO_NAME } from "@/constants";

export type CheckResult = {
  passed: boolean;
  message: string;
};

export type ForkExistsCheck = {
  type: "fork_exists";
};

export type FileExistsCheck = {
  type: "file_exists";
  path: string;
};

export type FileContainsCheck = {
  type: "file_contains";
  path: string;
  contains: string;
};

export type FileMatchesCheck = {
  type: "file_matches";
  path: string;
  pattern: string;
};

export type CommitMessageCheck = {
  type: "commit_message";
  pattern: string;
  limit?: number;
};

export type RepoCheck =
  | ForkExistsCheck
  | FileExistsCheck
  | FileContainsCheck
  | FileMatchesCheck
  | CommitMessageCheck;

function githubHeaders(accessToken: string) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${accessToken}`,
    "X-GitHub-Api-Version": "2026-03-10",
  };
}

export async function fetchFileContent(
  owner: string,
  path: string,
  accessToken: string,
) {
  const url = `${GITHUB_API}/repos/${owner}/${REPO_NAME}/contents/${path}`;
  const res = await fetch(url, { headers: githubHeaders(accessToken) });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub api error ${res.status} for ${path}`);

  const json = await res.json();
  return Buffer.from(json.content, "base64").toString("utf-8");
}

export async function fetchCommits(
  owner: string,
  limit: number,
  accessToken: string,
) {
  const url = `${GITHUB_API}/repos/${owner}/${REPO_NAME}/commits?per_page=${limit}`;
  const res = await fetch(url, { headers: githubHeaders(accessToken) });

  if (!res.ok) throw new Error(`GitHub api error ${res.status} for commits`);

  const json = (await res.json()) as { commit: { message: string } }[];
  return json.map((c) => ({ message: c.commit.message }));
}

export async function verifyFork(owner: string, accessToken: string) {
  const url = `${GITHUB_API}/repos/${owner}/${REPO_NAME}`;
  const res = await fetch(url, { headers: githubHeaders(accessToken) });

  if (res.status === 404) {
    return {
      passed: false,
      message: `Repo ${owner}/${REPO_NAME} not found. Is it public?`,
    };
  }
  if (!res.ok) {
    return { passed: false, message: `GitHub api error ${res.status}` };
  }

  const json = (await res.json()) as {
    fork: boolean;
    parent?: {
      full_name: string;
    };
  };

  if (!json.fork) {
    return { passed: false, message: `${owner}/${REPO_NAME} is not a fork.` };
  }

  const actualParent = json.parent?.full_name ?? "";
  const expectedParent = `${ORG_NAME}/${REPO_NAME}`;

  if (actualParent.toLowerCase() !== expectedParent.toLowerCase()) {
    return {
      passed: false,
      message: `Repo must be a fork of ${expectedParent}, got ${actualParent}.`,
    };
  }

  return { passed: true, message: "Fork verified." };
}

async function runCheck(check: RepoCheck, owner: string, accessToken: string) {
  switch (check.type) {
    case "fork_exists":
      return verifyFork(owner, accessToken);

    case "file_exists": {
      const content = await fetchFileContent(owner, check.path, accessToken);
      return content !== null
        ? { passed: true, message: `Found ${check.path}` }
        : { passed: false, message: `Missing file: ${check.path}` };
    }

    case "file_contains": {
      const content = await fetchFileContent(owner, check.path, accessToken);
      if (content === null)
        return { passed: false, message: `Missing file: ${check.path}` };
      return content.includes(check.contains)
        ? { passed: true, message: `${check.path} contains expected content` }
        : {
            passed: false,
            message: `${check.path} does not contain: ${check.contains}`,
          };
    }

    case "file_matches": {
      const content = await fetchFileContent(owner, check.path, accessToken);
      if (content === null)
        return { passed: false, message: `Missing file: ${check.path}` };
      const regex = new RegExp(check.pattern);
      return regex.test(content)
        ? { passed: true, message: `${check.path} matches pattern` }
        : {
            passed: false,
            message: `${check.path} does not match pattern: ${check.pattern}`,
          };
    }

    case "commit_message": {
      const commits = await fetchCommits(owner, check.limit ?? 10, accessToken);
      const regex = new RegExp(check.pattern);
      const match = commits.find((c) => regex.test(c.message));
      return match
        ? {
            passed: true,
            message: `Found matching commit: ${match.message}`,
          }
        : {
            passed: false,
            message: `No recent commit message matches: ${check.pattern}`,
          };
    }
  }
}

export async function runAllChecks(
  checks: RepoCheck[],
  owner: string,
  accessToken: string,
) {
  return Promise.all(checks.map((c) => runCheck(c, owner, accessToken)));
}
