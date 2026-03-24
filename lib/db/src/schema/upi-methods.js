import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const upiMethodsTable = pgTable("upi_methods", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(), // "PhonePe", "Paytm", "Google Pay"
    upiId: text("upi_id").notNull(),
    displayName: text("display_name"),
    isActive: text("is_active").default("true"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
export const insertUpiMethodSchema = createInsertSchema(upiMethodsTable).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
//# sourceMappingURL=upi-methods.js.map