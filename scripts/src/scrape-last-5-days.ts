import "dotenv/config";
import { db, marketsTable } from "@workspace/db";
import { ne, isNotNull } from "drizzle-orm";
import { fetchAndUpdateMarketResult } from "../../artifacts/api-server/src/lib/scraper.js";
import { format, subDays } from "date-fns";

async function scrapeLastFiveDays() {
  console.log("=== SCRAPING LAST 5 DAYS ===\n");

  // Get all markets with a source URL
  const markets = await db.select().from(marketsTable).where(isNotNull(marketsTable.sourceUrl));

  if (markets.length === 0) {
    console.log("No markets with source URLs found");
    return;
  }

  console.log(`Found ${markets.length} market(s) with source URLs\n`);

  // Scrape for last 5 days (including today)
  for (let dayOffset = 4; dayOffset >= 0; dayOffset--) {
    const date = subDays(new Date(), dayOffset);
    const dateStr = format(date, "yyyy-MM-dd");
    const dateDisplay = format(date, "dd MMM, yyyy");

    console.log(`\n>>> Scraping for ${dateDisplay} (${dateStr})`);
    console.log("─".repeat(50));

    for (const market of markets) {
      try {
        console.log(`  📍 ${market.name}...`);
        const result = await fetchAndUpdateMarketResult(market.id, dateStr);

        if (result.success) {
          console.log(
            `     ✓ ${result.openResult || "-"} | ${result.jodiResult || "-"} | ${result.closeResult || "-"}`
          );
        } else {
          console.log(`     ✗ ${result.message}`);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.log(`     ✗ Error: ${msg}`);
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("✓ Scraping completed!");
}

scrapeLastFiveDays().catch(console.error);
