import { pgTable, serial, text, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { usersTable } from "./users";
export const withdrawalsTable = pgTable("withdrawals", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    status: text("status").notNull().default("pending"), // pending, approved, rejected
    bankName: text("bank_name"),
    accountNumber: text("account_number"),
    ifscCode: text("ifsc_code"),
    upiId: text("upi_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    processedAt: timestamp("processed_at"),
});
export const insertWithdrawalSchema = createInsertSchema(withdrawalsTable).omit({ id: true, createdAt: true });
//# sourceMappingURL=withdrawals.js.map