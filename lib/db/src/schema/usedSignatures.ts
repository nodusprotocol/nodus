import {
  pgTable,
  serial,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// Single-use record of accepted wallet signatures, to prevent replay of a
// valid (message, signature) pair within its freshness window.
export const usedSignaturesTable = pgTable(
  "used_signatures",
  {
    id: serial("id").primaryKey(),
    signature: text("signature").notNull().unique(),
    walletAddress: text("wallet_address").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("used_signatures_wallet_idx").on(table.walletAddress)],
);

export type UsedSignature = typeof usedSignaturesTable.$inferSelect;
