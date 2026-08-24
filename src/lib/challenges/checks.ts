import { GITHUB_API, ORG_NAME, REPO_NAME } from "@/constants";

export type CheckResult = {
  passed: boolean;
  messageKey: string;
  messageParams?: Record<string, string>;
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

export async function verifyFork(
  owner: string,
  accessToken: string,
): Promise<CheckResult> {
  const url = `${GITHUB_API}/repos/${owner}/${REPO_NAME}`;
  const res = await fetch(url, { headers: githubHeaders(accessToken) });

  if (res.status === 404) {
    return {
      passed: false,
      messageKey: "fork.repoNotFound",
      messageParams: {
        repo: `${owner}/${REPO_NAME}`,
      },
    };
  }
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}`);
  }

  const json = (await res.json()) as {
    fork: boolean;
    parent?: {
      full_name: string;
    };
  };

  if (!json.fork) {
    return {
      passed: false,
      messageKey: "fork.notFork",
      messageParams: {
        repo: `${owner}/${REPO_NAME}`,
      },
    };
  }

  const actualParent = json.parent?.full_name ?? "";
  const expectedParent = `${ORG_NAME}/${REPO_NAME}`;

  if (actualParent.toLowerCase() !== expectedParent.toLowerCase()) {
    return {
      passed: false,
      messageKey: "fork.wrongParent",
      messageParams: {
        expected: expectedParent,
        actual: actualParent,
      },
    };
  }

  return { passed: true, messageKey: "fork.verified" };
}

async function runCheck(
  check: RepoCheck,
  owner: string,
  accessToken: string,
): Promise<CheckResult> {
  switch (check.type) {
    case "fork_exists":
      return verifyFork(owner, accessToken);

    case "file_exists": {
      const content = await fetchFileContent(owner, check.path, accessToken);
      return content !== null
        ? {
            passed: true,
            messageKey: "file.found",
            messageParams: {
              path: check.path,
            },
          }
        : {
            passed: false,
            messageKey: "file.missing",
            messageParams: {
              path: check.path,
            },
          };
    }

    case "file_contains": {
      const content = await fetchFileContent(owner, check.path, accessToken);
      if (content === null)
        return {
          passed: false,
          messageKey: "file.missing",
          messageParams: {
            path: check.path,
          },
        };
      return content.includes(check.contains)
        ? {
            passed: true,
            messageKey: "file.contains",
            messageParams: {
              path: check.path,
            },
          }
        : {
            passed: false,
            messageKey: "file.doesNotContain",
            messageParams: {
              path: check.path,
              content: check.contains,
            },
          };
    }

    case "file_matches": {
      const content = await fetchFileContent(owner, check.path, accessToken);
      if (content === null)
        return {
          passed: false,
          messageKey: "file.missing",
          messageParams: {
            path: check.path,
          },
        };
      const regex = new RegExp(check.pattern);
      return regex.test(content)
        ? {
            passed: true,
            messageKey: "file.matches",
            messageParams: {
              path: check.path,
            },
          }
        : {
            passed: false,
            messageKey: "file.doesNotMatch",
            messageParams: {
              path: check.path,
              pattern: check.pattern,
            },
          };
    }

    case "commit_message": {
      const commits = await fetchCommits(owner, check.limit ?? 10, accessToken);
      const regex = new RegExp(check.pattern);
      const match = commits.find((c) => regex.test(c.message));
      return match
        ? {
            passed: true,
            messageKey: "commit.found",
            messageParams: {
              message: match.message,
            },
          }
        : {
            passed: false,
            messageKey: "commit.noMatch",
            messageParams: {
              pattern: check.pattern,
            },
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
