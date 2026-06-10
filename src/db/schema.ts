import {
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";

export * from "./auth-schema";

const pgTable = pgTableCreator((name) => `intro_course_${name}`);

export const completion = pgTable(
  "completion",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    challengeId: text("challenge_id").notNull(),
    completedAt: timestamp("completed_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.challengeId] })],
);

export const completionRelations = relations(completion, ({ one }) => ({
  user: one(user, { fields: [completion.userId], references: [user.id] }),
}));
