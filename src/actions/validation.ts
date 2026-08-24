"use server";

import { db } from "@/db";
import { completion } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CheckResult, runAllChecks } from "@/lib/challenges/checks";
import { Challenge } from "@/lib/challenges/meta";
import { findChallengeMeta } from "@/lib/challenges/registry";
import { headers } from "next/headers";

type ValidationResult = {
  passed: boolean;
  messageKey?: string;
};

type RepoValidationResult = ValidationResult & {
  checkResults: CheckResult[];
};

export async function validateRepoAction(
  challengeId: Challenge["id"],
): Promise<RepoValidationResult> {
  const heads = await headers();
  const session = await auth.api.getSession({ headers: heads });
  if (!session)
    return { passed: false, messageKey: "notSignedIn", checkResults: [] };

  const challenge = findChallengeMeta(challengeId);
  if (!challenge || challenge.type !== "repo")
    return { passed: false, messageKey: "challengeNotFound", checkResults: [] };

  const accessToken = await auth.api.getAccessToken({
    body: {
      providerId: "github",
    },
    headers: heads,
  });
  const githubUsername = session.user.githubUsername;

  let checkResults: CheckResult[];

  try {
    checkResults = await runAllChecks(
      challenge.checks,
      githubUsername,
      accessToken.accessToken,
    );
  } catch (err) {
    return {
      passed: false,
      messageKey: "error",
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

export async function validateFlagAction(
  challengeId: string,
  flag: string,
): Promise<ValidationResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { passed: false, messageKey: "notSignedIn" };

  const challenge = findChallengeMeta(challengeId);
  if (!challenge || challenge.type !== "flag")
    return { passed: false, messageKey: "challengeNotFound" };

  const passed = flag.trim() === challenge.flag;

  if (passed) {
    await db
      .insert(completion)
      .values({ userId: session.user.id, challengeId })
      .onConflictDoNothing();
  }

  return {
    passed,
    messageKey: passed ? "correct" : "wrongFlag",
  };
}
