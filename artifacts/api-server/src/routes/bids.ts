import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { GetBidsQueryParams } from "@workspace/api-zod";
import { authMiddleware } from "../middlewares/auth.js";
import { processMarketBidsPreClose } from "../lib/bid-processor.js";

const router: IRouter = Router();

router.get("/bids", authMiddleware, async (req, res): Promise<void> => {
  try {
    const query = GetBidsQueryParams.safeParse(req.query);
    const page = query.success ? (query.data.page ?? 1) : 1;
    const limit = query.success ? (query.data.limit ?? 20) : 20;

    // Use sql() helper for raw SQL with drizzle
    const bidsResult = await db.execute(sql`
      SELECT 
        id, user_id, market_id, market_name, game_type, amount, number, 
        open_time, close_time, current_time, status, created_at
      FROM bids 
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as any;

    const totalResult = await db.execute(sql`SELECT COUNT(*) as count FROM bids`) as any;

    const bids = (bidsResult.rows || []).map((b: any) => ({
      id: b.id,
      userId: b.user_id,
      userName: "User " + b.user_id,
      marketId: b.market_id,
      marketName: b.market_name || "Unknown",
      gameType: b.game_type,
      amount: parseFloat(b.amount || "0"),
      number: b.number,
      openTime: b.open_time || "",
      closeTime: b.close_time || "",
      currentTime: b.current_time?.toISOString() ?? new Date().toISOString(),
      status: b.status,
      createdAt: b.created_at?.toISOString() ?? new Date().toISOString(),
    }));

    res.json({
      bids,
      total: parseInt((totalResult.rows?.[0]?.count || 0) as string),
      page,
      limit,
    });
  } catch (err) {
    console.error("[Bids] Error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * POST /bids/process-pre-close/:marketId
 * Process all pending bids for a market before closeTime - 20 minutes
 * Returns win/loss status and updates wallet for winners
 */
router.post("/process-pre-close/:marketId", authMiddleware, async (req, res): Promise<void> => {
  try {
    const marketId = parseInt(req.params.marketId as string, 10);

    if (isNaN(marketId)) {
      res.status(400).json({ error: "Invalid market ID" });
      return;
    }

    const result = await processMarketBidsPreClose(marketId);

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json({
      ...result,
      success: true,
    });
  } catch (err) {
    console.error("[Pre-Close Processing] Error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
