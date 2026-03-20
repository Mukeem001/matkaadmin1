import { Router, type IRouter } from "express";
import { db, settingsTable } from "@workspace/db";
import { UpdateSettingsBody } from "@workspace/api-zod";
import { authMiddleware } from "../middlewares/auth.js";

const router: IRouter = Router();

router.get("/settings", authMiddleware, async (_req, res): Promise<void> => {
  let [settings] = await db.select().from(settingsTable);
  if (!settings) {
    [settings] = await db.insert(settingsTable).values({ appName: "Matka Admin" }).returning();
  }
  res.json({
    appName: settings.appName,
    logoUrl: settings.logoUrl,
    supportPhone: settings.supportPhone,
    upiId: settings.upiId,
    bankName: settings.bankName,
    bankAccountNumber: settings.bankAccountNumber,
    bankIfscCode: settings.bankIfscCode,
    qrCodeUrl: settings.qrCodeUrl,
  });
});

router.put("/settings", authMiddleware, async (req, res): Promise<void> => {
  const body = UpdateSettingsBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  let [settings] = await db.select().from(settingsTable);
  if (!settings) {
    [settings] = await db.insert(settingsTable).values({ appName: "Matka Admin" }).returning();
  }

  const [updated] = await db.update(settingsTable).set(body.data).returning();
  res.json({
    appName: updated.appName,
    logoUrl: updated.logoUrl,
    supportPhone: updated.supportPhone,
    upiId: updated.upiId,
    bankName: updated.bankName,
    bankAccountNumber: updated.bankAccountNumber,
    bankIfscCode: updated.bankIfscCode,
    qrCodeUrl: updated.qrCodeUrl,
  });
});

export default router;
