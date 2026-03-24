import { Router, type IRouter } from "express";
import { db, gameRatesTable } from "@workspace/db";
import { UpdateGameRatesBody } from "@workspace/api-zod";
import { authMiddleware } from "../middlewares/auth.js";

const router: IRouter = Router();

const formatRates = (r: typeof gameRatesTable.$inferSelect) => ({
  singleDigit: parseFloat(r.singleDigit as string),
  jodiDigit: parseFloat(r.jodiDigit as string),
  singlePanna: parseFloat(r.singlePanna as string),
  doublePanna: parseFloat(r.doublePanna as string),
  triplePanna: parseFloat(r.triplePanna as string),
  halfSangam: parseFloat(r.halfSangam as string),
  fullSangam: parseFloat(r.fullSangam as string),
});

router.get("/game-rates", authMiddleware, async (_req, res): Promise<void> => {
  let [rates] = await db.select().from(gameRatesTable);
  if (!rates) {
    [rates] = await db.insert(gameRatesTable).values({}).returning();
  }
  res.json(formatRates(rates));
});

router.put("/game-rates", authMiddleware, async (req, res): Promise<void> => {
  const body = UpdateGameRatesBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  let [rates] = await db.select().from(gameRatesTable);
  if (!rates) {
    [rates] = await db.insert(gameRatesTable).values({}).returning();
  }

  const [updated] = await db.update(gameRatesTable)
    .set({
      singleDigit: String(body.data.singleDigit),
      jodiDigit: String(body.data.jodiDigit),
      singlePanna: String(body.data.singlePanna),
      doublePanna: String(body.data.doublePanna),
      triplePanna: String(body.data.triplePanna),
      halfSangam: String(body.data.halfSangam),
      fullSangam: String(body.data.fullSangam),
    })
    .returning();

  res.json(formatRates(updated));
});

export default router;
