import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const settingsTable = pgTable("settings", {
    id: serial("id").primaryKey(),
    appName: text("app_name").notNull().default("Matka Admin"),
    logoUrl: text("logo_url"),
    supportPhone: text("support_phone"),
    upiId: text("upi_id"),
    bankName: text("bank_name"),
    bankAccountNumber: text("bank_account_number"),
    bankIfscCode: text("bank_ifsc_code"),
    qrCodeUrl: text("qr_code_url"),
});
export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true });
//# sourceMappingURL=settings.js.map