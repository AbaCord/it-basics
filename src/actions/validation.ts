"use server";

import { db } from "@/db";
import { completion } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CheckResult, fetchAuthenticatedLogin, runAllChecks } from "@/lib/challenges/checks";
import { Challenge } from "@/lib/challenges/meta";
import { findChallenge } from "@/lib/challenges/registry";
import { headers } from "next/headers";

export async function validateRepoAction(challengeId: Challenge["id"]) {
  const heads = await headers();
  const session = await auth.api.getSession({ headers: heads });
  if (!session)
    return { passed: false, error: "Not signed in", checkResults: [] };

  const challenge = findChallenge(challengeId);
  if (!challenge || challenge.type !== "repo")
    return { passed: false, error: "Challenge not found", checkResults: [] };

  const accessToken = await auth.api.getAccessToken({
    body: {
      providerId: "github",
    },
    headers: heads,
  });

  if (!accessToken?.accessToken) {
    return {
      passed: false,
      error: "GitHub access token not available. Re-sign in and try again.",
      checkResults: [],
    };
  }

  let checkResults: CheckResult[];

  try {
    // session.user.name is the display name, not the GitHub login.
    // Resolve the real login via the GitHub API using the access token.
    const githubUsername = await fetchAuthenticatedLogin(
      accessToken.accessToken,
    );
    checkResults = await runAllChecks(
      challenge.checks,
      githubUsername,
      accessToken.accessToken,
    );
  } catch (err) {
    return {
      passed: false,
      error: (err as { message: string }).message,
      checkResults: [],
    };
  }

  const passed = checkResults.every((r) => r.passed);

  if (passed) {
    await db
      .insert(completion)
      .values({ userId: session.user.id, challengeId })
      .onConflictDoNothing();
  }

  return { passed, checkResults };
}

export async function validateFlagAction(challengeId: string, flag: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { passed: false, message: "Not signed in" };

  const challenge = findChallenge(challengeId);
  if (!challenge || challenge.type !== "flag")
    return { passed: false, message: "Challenge not found" };

  const passed = flag.trim() === challenge.flag;

  if (passed) {
    await db
      .insert(completion)
      .values({ userId: session.user.id, challengeId })
      .onConflictDoNothing();
  }

  return {
    passed,
    message: passed ? "Correct!" : "Wrong flag, try again.",
  };
}
