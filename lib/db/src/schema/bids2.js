import { pgTable, serial, text, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { usersTable } from "./users";
import { markets2Table } from "./markets2";
export const bids2Table = pgTable("bids2", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id),
    marketId: integer("market_id").notNull().references(() => markets2Table.id),
    marketName: text("market_name").default(""),
    // Bet type: left_digit, right_digit, odd_even, jodi
    betType: text("bet_type").notNull(), // "left_digit" | "right_digit" | "odd_even" | "jodi"
    // The bet value
    // For left/right digit: 0-9
    // For odd_even: "odd" | "even"
    // For jodi: 00-99
    number: text("number").notNull(),
    // Amount and rates
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    multiplier: integer("multiplier").default(0), // 9 for digit, 90 for jodi, 1.8 for odd/even
    // Market timing
    closeTime: text("close_time").default(""),
    currentTime: timestamp("current_time").defaultNow(),
    // Status tracking
    status: text("status").notNull().default("pending"), // pending, won, lost
    winAmount: numeric("win_amount", { precision: 12, scale: 2 }).default("0"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertBids2Schema = createInsertSchema(bids2Table).omit({ id: true, createdAt: true, currentTime: true });
//# sourceMappingURL=bids2.js.map