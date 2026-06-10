import { challenges } from "./meta";

export function findChallenge(challengeId: string) {
  return challenges.find((c) => c.id === challengeId);
}
