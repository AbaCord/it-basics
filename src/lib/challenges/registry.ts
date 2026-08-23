import { getTranslations } from "next-intl/server";
import { Challenge, ChallengeMeta, challenges } from "./meta";
import { ORG_NAME, REPO_NAME } from "@/constants";

export async function getTranslatedChallenges() {
  const t = await getTranslations("Challenges");

  return challenges.map((challenge) => ({
    ...challenge,
    title: t(`${challenge.id}.title`),
    description: t
      .raw(`${challenge.id}.description`)
      .replaceAll("{orgName}", ORG_NAME)
      .replaceAll("{repoName}", REPO_NAME),
  }));
}

export function findChallengeMeta(
  challengeId: string,
): ChallengeMeta | undefined {
  return challenges.find((c) => c.id === challengeId);
}

export async function findChallenge(
  challengeId: string,
): Promise<Challenge | undefined> {
  const challenge = findChallengeMeta(challengeId);
  if (!challenge) return;

  const translated = await getChallengeTranslation(challenge);
  console.log(translated.description);
  return translated;
}

async function getChallengeTranslation(challenge: ChallengeMeta) {
  const t = await getTranslations(`Challenges.${challenge.id}`);

  return {
    ...challenge,
    title: t("title"),
    description: t
      .raw("description")
      .replaceAll("{orgName}", ORG_NAME)
      .replaceAll("{repoName}", REPO_NAME),
  };
}
