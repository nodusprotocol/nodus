import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const reputationScoresTable = pgTable(
  "reputation_scores",
  {
    id: serial("id").primaryKey(),
    walletAddress: text("wallet_address").notNull().unique(),
    totalScore: integer("total_score").notNull().default(0),
    accuracyScore: integer("accuracy_score").notNull().default(0),
    activityScore: integer("activity_score").notNull().default(0),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("reputation_scores_total_idx").on(table.totalScore)],
);

export type ReputationScore = typeof reputationScoresTable.$inferSelect;
