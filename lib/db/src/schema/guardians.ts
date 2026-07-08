import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const guardiansTable = pgTable(
  "guardians",
  {
    id: serial("id").primaryKey(),
    walletAddress: text("wallet_address").notNull().unique(),
    tier: text("tier").notNull().default("guardian"),
    reputation: integer("reputation").notNull().default(0),
    reportsSubmitted: integer("reports_submitted").notNull().default(0),
    reportsApproved: integer("reports_approved").notNull().default(0),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => [
    index("guardians_reputation_idx").on(table.reputation),
    index("guardians_tier_idx").on(table.tier),
  ],
);

export const insertGuardianSchema = createInsertSchema(guardiansTable).omit({
  id: true,
  tier: true,
  reputation: true,
  reportsSubmitted: true,
  reportsApproved: true,
  joinedAt: true,
});
export type InsertGuardian = z.infer<typeof insertGuardianSchema>;
export type Guardian = typeof guardiansTable.$inferSelect;
