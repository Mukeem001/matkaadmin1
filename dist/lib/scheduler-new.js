import * as cron from "node-cron";
import { eq } from "drizzle-orm";
import { db, marketsTable } from "@workspace/db";
import { fetchAndUpdateMarketResult } from "./scraper.js";
let schedulerTask = null;
let lastRunAt = null;
let isRunning = false;
// Helper function to parse time string (HH:MM format)
function parseTimeString(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return { hours, minutes };
}
// Helper function to get current time in minutes since midnight
function getCurrentTimeInMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}
// Helper function to convert hours and minutes to minutes since midnight
function timeToMinutes(hours, minutes) {
    return hours * 60 + minutes;
}
// Update market isActive status based on openTime only
// Logic: Market is inactive only 10 min before openTime. Rest of day is active.
async function updateMarketActivityStatus() {
    try {
        const markets = await db.select().from(marketsTable);
        const currentTimeInMinutes = getCurrentTimeInMinutes();
        for (const market of markets) {
            const { hours: openHour, minutes: openMin } = parseTimeString(market.openTime);
            const openTimeInMinutes = timeToMinutes(openHour, openMin);
            // Calculate if should be active
            // Inactive only: 10 min before open until open time
            const preOpenInactiveStart = openTimeInMinutes - 10;
            const shouldBeActive = !(currentTimeInMinutes >= preOpenInactiveStart && currentTimeInMinutes < openTimeInMinutes);
            // Update if status changed
            if (market.isActive !== shouldBeActive) {
                await db.update(marketsTable)
                    .set({ isActive: shouldBeActive })
                    .where(eq(marketsTable.id, market.id));
                const currentTimeStr = `${String(Math.floor(currentTimeInMinutes / 60)).padStart(2, '0')}:${String(currentTimeInMinutes % 60).padStart(2, '0')}`;
                console.log(`[Market Activity] ${market.name}: isActive = ${shouldBeActive} (openTime: ${market.openTime}, currentTime: ${currentTimeStr})`);
            }
        }
    }
    catch (err) {
        console.error("[Market Activity] Error updating market activity status:", err);
    }
}
export function startScheduler() {
    if (schedulerTask) {
        console.log("[Scheduler] Already running");
        return;
    }
    // Run every minute
    schedulerTask = cron.schedule("* * * * *", async () => {
        if (isRunning) {
            console.log("[Scheduler] Previous run still in progress, skipping...");
            return;
        }
        isRunning = true;
        lastRunAt = new Date();
        console.log(`[Scheduler] Running at ${lastRunAt.toISOString()}`);
        try {
            // Update market activity status
            await updateMarketActivityStatus();
            // Get all markets with autoUpdate enabled and a source URL
            const markets = await db.select().from(marketsTable)
                .where(eq(marketsTable.autoUpdate, true));
            const autoUpdateMarkets = markets.filter(m => m.sourceUrl);
            if (autoUpdateMarkets.length === 0) {
                console.log("[Scheduler] No markets with auto-update enabled");
                isRunning = false;
                return;
            }
            console.log(`[Scheduler] Fetching results for ${autoUpdateMarkets.length} market(s)...`);
            // Fetch results asynchronously for all markets
            const results = await Promise.allSettled(autoUpdateMarkets.map(market => fetchAndUpdateMarketResult(market.id)));
            results.forEach((result, i) => {
                const market = autoUpdateMarkets[i];
                if (result.status === "fulfilled") {
                    console.log(`[Scheduler] ${market.name}: ${result.value.message}`);
                }
                else {
                    console.error(`[Scheduler] ${market.name}: Failed - ${result.reason}`);
                }
            });
        }
        catch (err) {
            console.error("[Scheduler] Error:", err);
        }
        finally {
            isRunning = false;
        }
    });
    console.log("[Scheduler] Started — running every minute");
}
export function stopScheduler() {
    if (schedulerTask) {
        schedulerTask.stop();
        schedulerTask = null;
        console.log("[Scheduler] Stopped");
    }
}
export function getSchedulerStatus() {
    return {
        isRunning: schedulerTask !== null,
        lastRunAt: lastRunAt?.toISOString() ?? null,
    };
}
//# sourceMappingURL=scheduler-new.js.map