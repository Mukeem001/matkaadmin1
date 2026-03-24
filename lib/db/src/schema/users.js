import { pgTable, serial, text, timestamp, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique(),
    phone: text("phone").notNull(),
    password: text("password").notNull(),
    walletBalance: numeric("wallet_balance", { precision: 12, scale: 2 }).notNull().default("0"),
    isBlocked: boolean("is_blocked").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
//# sourceMappingURL=users.js.map