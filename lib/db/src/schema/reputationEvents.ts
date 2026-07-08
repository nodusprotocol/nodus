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

export const reputationEventsTable = pgTable(
  "reputation_events",
  {
    id: serial("id").primaryKey(),
    guardianWallet: text("guardian_wallet").notNull(),
    eventType: text("event_type").notNull(),
    points: integer("points").notNull().default(0),
    reason: text("reason"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("reputation_events_wallet_idx").on(table.guardianWallet),
    index("reputation_events_created_idx").on(table.createdAt),
  ],
);

export const insertReputationEventSchema = createInsertSchema(
  reputationEventsTable,
).omit({
  id: true,
  createdAt: true,
});
export type InsertReputationEvent = z.infer<typeof insertReputationEventSchema>;
export type ReputationEvent = typeof reputationEventsTable.$inferSelect;
