import { ChallengeCard } from "@/components/challenges/challenge-card";
import { findChallenge } from "@/lib/challenges/registry";
import { notFound } from "next/navigation";

type ChallengePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { id } = await params;
  const challenge = findChallenge(id);

  if (!challenge) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <ChallengeCard challenge={challenge} />
    </div>
  );
}
