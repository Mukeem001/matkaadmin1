import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { format } from "date-fns";
import { db, markets2Table, scraperLogsTable, resultsTable } from "@workspace/db";
import { UpdateMarketAutoConfigParams, UpdateMarketAutoConfigBody, FetchMarketResultNowParams } from "@workspace/api-zod";
import { authMiddleware } from "../middlewares/auth.js";
import { scrapeLiveResults } from "../lib/scraper.js";
import { fetchAndUpdateMarkets2Result } from "../lib/scraper2.js";
const router = Router();
const formatMarkets2 = (m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
    lastFetchedAt: m.lastFetchedAt?.toISOString() ?? null,
});
// Debug route
router.get("/debug-markets2", (_req, res) => {
    res.json({ message: "Markets2 scraper routes working", timestamp: new Date().toISOString() });
});
router.put("/markets2/:id/auto-config", authMiddleware, async (req, res) => {
    const params = UpdateMarketAutoConfigParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid ID" });
        return;
    }
    const body = UpdateMarketAutoConfigBody.safeParse(req.body);
    if (!body.success) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }
    const result = await db.update(markets2Table).set({
        autoUpdate: body.data.autoUpdate,
        sourceUrl: body.data.sourceUrl ?? null,
    }).where(eq(markets2Table.id, params.data.id)).returning();
    const market = result[0];
    if (!market) {
        res.status(404).json({ error: "Market not found" });
        return;
    }
    res.json(formatMarkets2(market));
});
router.post("/markets2/:id/fetch-now", async (req, res) => {
    const params = FetchMarketResultNowParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid ID" });
        return;
    }
    try {
        const result = await fetchAndUpdateMarkets2Result(params.data.id);
        res.json(result);
    }
    catch (error) {
        console.error("Error fetching market2 now:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch market results",
            data: null
        });
    }
});
router.get("/markets2/:id/live-results", async (req, res) => {
    console.log("🔴 [LIVE-RESULTS-Markets2] Request received");
    console.log("🔴 [LIVE-RESULTS-Markets2] req.params:", req.params);
    const params = FetchMarketResultNowParams.safeParse(req.params);
    if (!params.success) {
        console.error("🔴 [LIVE-RESULTS-Markets2] Validation failed:", params.error);
        res.status(400).json({ error: "Invalid ID", details: params.error });
        return;
    }
    console.log("🟢 [LIVE-RESULTS-Markets2] Validated params:", params.data);
    const result = await db
        .select()
        .from(markets2Table)
        .where(eq(markets2Table.id, params.data.id));
    const market = result[0];
    if (!market) {
        console.error("🔴 [LIVE-RESULTS-Markets2] Market not found:", params.data.id);
        res.status(400).json({ error: "Market not found" });
        return;
    }
    console.log("🟢 [LIVE-RESULTS-Markets2] Market found:", market.name);
    try {
        const liveResult = await scrapeLiveResults(market.name);
        console.log("🟡 [LIVE-RESULTS-Markets2] Scrape result:", liveResult);
        // Success if we have ANY result
        const hasAnyResult = liveResult.openResult || liveResult.jodiResult || liveResult.closeResult;
        if (hasAnyResult) {
            console.log("🟢 [LIVE-RESULTS-Markets2] Saving to database");
            // Save to database with TODAY'S DATE
            const today = format(new Date(), "yyyy-MM-dd");
            console.log("🟢 [LIVE-RESULTS-Markets2] Today's date:", today);
            try {
                const queryResult = await db
                    .select()
                    .from(resultsTable)
                    .where(and(eq(resultsTable.marketId, params.data.id), eq(resultsTable.resultDate, today)));
                const existingResult = queryResult[0];
                console.log("🟢 [LIVE-RESULTS-Markets2] Query check completed, existing:", existingResult ? existingResult.id : "none");
                if (existingResult) {
                    console.log("🟢 [LIVE-RESULTS-Markets2] Updating existing result ID:", existingResult.id);
                    const updateData = {};
                    if (liveResult.openResult)
                        updateData.openResult = liveResult.openResult;
                    if (liveResult.jodiResult)
                        updateData.jodiResult = liveResult.jodiResult;
                    if (liveResult.closeResult)
                        updateData.closeResult = liveResult.closeResult;
                    updateData.declaredAt = new Date();
                    console.log("🟢 [LIVE-RESULTS-Markets2] Update data:", updateData);
                    const updateResultDb = await db.update(resultsTable).set(updateData).where(eq(resultsTable.id, existingResult.id));
                    console.log("🟢 [LIVE-RESULTS-Markets2] Update completed:", updateResultDb);
                }
                else {
                    console.log("🟢 [LIVE-RESULTS-Markets2] Creating new result for market", params.data.id);
                    const insertData = {
                        marketId: params.data.id,
                        resultDate: today,
                        declaredAt: new Date(),
                    };
                    if (liveResult.openResult)
                        insertData.openResult = liveResult.openResult;
                    if (liveResult.jodiResult)
                        insertData.jodiResult = liveResult.jodiResult;
                    if (liveResult.closeResult)
                        insertData.closeResult = liveResult.closeResult;
                    console.log("🟢 [LIVE-RESULTS-Markets2] Insert data:", insertData);
                    const insertResultDb = await db.insert(resultsTable).values(insertData);
                    console.log("🟢 [LIVE-RESULTS-Markets2] Insert completed:", insertResultDb);
                }
                // 🟢 ALSO UPDATE MARKETS2 TABLE WITH LATEST RESULTS
                console.log("🟢 [LIVE-RESULTS-Markets2] Updating markets2 table with latest results");
                const marketUpdateData = {};
                if (liveResult.openResult)
                    marketUpdateData.openResult = liveResult.openResult;
                if (liveResult.jodiResult)
                    marketUpdateData.jodiResult = liveResult.jodiResult;
                if (liveResult.closeResult)
                    marketUpdateData.closeResult = liveResult.closeResult;
                marketUpdateData.lastFetchedAt = new Date();
                await db.update(markets2Table).set(marketUpdateData).where(eq(markets2Table.id, params.data.id));
                console.log("🟢 [LIVE-RESULTS-Markets2] Markets2 table updated");
                console.log("🟢 [LIVE-RESULTS-Markets2] Saving to scraper logs");
                const logResult = await db.insert(scraperLogsTable).values({
                    marketId: market.id,
                    marketName: market.name,
                    sourceUrl: "https://satkamatka.com.in/",
                    success: true,
                    openResult: liveResult.openResult,
                    closeResult: liveResult.closeResult,
                    jodiResult: liveResult.jodiResult,
                });
                console.log("🟢 [LIVE-RESULTS-Markets2] Log saved:", logResult);
                console.log("🟢 [LIVE-RESULTS-Markets2] Returning saved results");
                res.json({
                    success: true,
                    message: "Live results found and saved to database",
                    data: liveResult,
                });
            }
            catch (dbError) {
                console.error("🔴 [LIVE-RESULTS-Markets2] Database error:", dbError);
                res.status(500).json({
                    success: false,
                    message: `Database error: ${dbError instanceof Error ? dbError.message : String(dbError)}`,
                    data: null,
                });
            }
        }
        else {
            console.log("🔴 [LIVE-RESULTS-Markets2] No results found");
            res.json({
                success: false,
                message: "No live results available",
                data: null,
            });
        }
    }
    catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        console.error("🔴 [LIVE-RESULTS-Markets2] Exception:", errorMsg);
        res.status(500).json({
            success: false,
            message: errorMsg,
            data: null,
        });
    }
});
router.get("/markets2/:id/results/:date", async (req, res) => {
    const marketId = parseInt(String(req.params.id));
    const resultDate = req.params.date; // format: "yyyy-MM-dd"
    if (!marketId || isNaN(marketId)) {
        res.status(400).json({ error: "Invalid market ID" });
        return;
    }
    try {
        const results = await db.select()
            .from(resultsTable)
            .where(and(eq(resultsTable.marketId, marketId), eq(resultsTable.resultDate, resultDate)));
        const result = results[0];
        if (!result) {
            res.json({ success: false, message: "No results found for this date", data: null });
            return;
        }
        res.json({
            success: true,
            message: "Results found",
            data: {
                openResult: result.openResult,
                closeResult: result.closeResult,
                jodiResult: result.jodiResult,
            },
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching results for date:", msg);
        res.status(500).json({ error: msg });
    }
});
export default router;
//# sourceMappingURL=scraper2.js.map