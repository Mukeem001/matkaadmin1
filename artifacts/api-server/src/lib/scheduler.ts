import * as cron from "node-cron";
import { eq } from "drizzle-orm";
import { db, marketsTable } from "@workspace/db";
import { fetchAndUpdateMarketResult } from "./scraper.js";

let schedulerTask: cron.ScheduledTask | null = null;
let lastRunAt: Date | null = null;
let isRunning = false;

// Helper function to parse time string (HH:MM format)
function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
}

// Helper function to get current time in minutes since midnight
function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

// Helper function to convert hours and minutes to minutes since midnight
function timeToMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

// Update market isActive status based on openTime and closeTime
async function updateMarketActivityStatus() {
  try {
    const markets = await db.select().from(marketsTable);
    const currentTimeInMinutes = getCurrentTimeInMinutes();

    for (const market of markets) {
      const { hours: openHour, minutes: openMin } = parseTimeString(market.openTime);
      const { hours: closeHour, minutes: closeMin } = parseTimeString(market.closeTime);

      const openTimeInMinutes = timeToMinutes(openHour, openMin);
      const closeTimeInMinutes = timeToMinutes(closeHour, closeMin);

      const isMidnightSpanning = closeTimeInMinutes < openTimeInMinutes;
      let shouldBeActive: boolean = true;

      if (!isMidnightSpanning) {
        // Normal market: opens and closes on same day (e.g., 9 AM - 11 PM)
        const preOpenInactiveStart = openTimeInMinutes - 10; // e.g., 8:50 AM
        const postCloseInactiveEnd = closeTimeInMinutes + 10; // e.g., 11:10 PM

        // Inactive: 10 min before open until open time
        if (currentTimeInMinutes >= preOpenInactiveStart && currentTimeInMinutes < openTimeInMinutes) {
          shouldBeActive = false;
        }
        // Inactive: close time until 10 min after close
        else if (currentTimeInMinutes >= closeTimeInMinutes && currentTimeInMinutes < postCloseInactiveEnd) {
          shouldBeActive = false;
        }
        // Active: during trading hours and after post-close window
        else {
          shouldBeActive = true;
        }
      } else {
        // Midnight-spanning market: opens at night, closes next morning (e.g., 9 PM - 9 AM)
        const preOpenInactiveStart = openTimeInMinutes - 10; // e.g., 8:50 PM
        const postCloseInactiveEnd = closeTimeInMinutes + 10; // e.g., 9:10 AM next day

        // Inactive: 10 min before open until open time (night)
        if (currentTimeInMinutes >= preOpenInactiveStart && currentTimeInMinutes < openTimeInMinutes) {
          shouldBeActive = false;
        }
        // Inactive: close time until 10 min after close (morning)
        else if (currentTimeInMinutes >= 0 && currentTimeInMinutes < postCloseInactiveEnd) {
          shouldBeActive = false;
        }
        // Active: all other times
        else {
          shouldBeActive = true;
        }
      }

      // Update if status changed
      if (market.isActive !== shouldBeActive) {
        await db.update(marketsTable)
          .set({ isActive: shouldBeActive })
          .where(eq(marketsTable.id, market.id));
        console.log(`[Market Activity] ${market.name}: isActive = ${shouldBeActive} (open: ${market.openTime}, close: ${market.closeTime}, current: ${String(Math.floor(currentTimeInMinutes / 60)).padStart(2, '0')}:${String(currentTimeInMinutes % 60).padStart(2, '0')})`);
      }
    }
  } catch (err) {
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
      // Update market activity status based on openTime and closeTime
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
      const results = await Promise.allSettled(
        autoUpdateMarkets.map(market => fetchAndUpdateMarketResult(market.id))
      );

      results.forEach((result, i) => {
        const market = autoUpdateMarkets[i];
        if (result.status === "fulfilled") {
          console.log(`[Scheduler] ${market.name}: ${result.value.message}`);
        } else {
          console.error(`[Scheduler] ${market.name}: Failed - ${result.reason}`);
        }
      });
    } catch (err) {
      console.error("[Scheduler] Error:", err);
    } finally {
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
