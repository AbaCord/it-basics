import { ChallengeCard } from "@/components/challenges/challenge-card";
import { findChallenge } from "@/lib/challenges/registry";
import { getCompletedChallenges } from "@/lib/queries/completion";
import { getSession } from "@/lib/queries/session";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type ChallengePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ChallengePageProps): Promise<Metadata> {
  const { id } = await params;
  const challenge = findChallenge(id);

  return {
    title: challenge?.title,
    description: challenge?.description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { id } = await params;
  const challenge = findChallenge(id);

  if (!challenge) {
    notFound();
  }

  const session = await getSession();

  let isCompleted = false;
  if (session) {
    const completed = await getCompletedChallenges(session.user.id);
    isCompleted = !!completed.find((c) => c.challengeId === id);
  }

  return (
    <ChallengeCard
      challenge={challenge}
      isCompleted={isCompleted}
      isLoggedIn={session !== null}
    />
  );
}
