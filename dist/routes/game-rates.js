import { Router } from "express";
import { db, gameRatesTable } from "@workspace/db";
import { UpdateGameRatesBody } from "@workspace/api-zod";
import { authMiddleware } from "../middlewares/auth.js";
const router = Router();
const formatRates = (r) => ({
    singleDigit: parseFloat(r.singleDigit),
    jodiDigit: parseFloat(r.jodiDigit),
    singlePanna: parseFloat(r.singlePanna),
    doublePanna: parseFloat(r.doublePanna),
    triplePanna: parseFloat(r.triplePanna),
    halfSangam: parseFloat(r.halfSangam),
    fullSangam: parseFloat(r.fullSangam),
});
router.get("/game-rates", authMiddleware, async (_req, res) => {
    let [rates] = await db.select().from(gameRatesTable);
    if (!rates) {
        [rates] = await db.insert(gameRatesTable).values({}).returning();
    }
    res.json(formatRates(rates));
});
router.put("/game-rates", authMiddleware, async (req, res) => {
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
//# sourceMappingURL=game-rates.js.map