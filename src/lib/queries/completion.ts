import { cache } from "react";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { completion } from "@/db/schema";

export const getCompletedChallenges = cache(async (userId: string) => {
  return await db.query.completion.findMany({
    where: eq(completion.userId, userId),
    columns: {
      challengeId: true,
      completedAt: true,
    },
  });
});
