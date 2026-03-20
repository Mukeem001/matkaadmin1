import { db, bidsTable, resultsTable, scraperLogsTable, marketsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function checkMarketRelations() {
  const markets = await db.select().from(marketsTable);
  console.log('Markets:');
  for (const market of markets) {
    const bids = await db.select().from(bidsTable).where(eq(bidsTable.marketId, market.id));
    const results = await db.select().from(resultsTable).where(eq(resultsTable.marketId, market.id));
    const logs = await db.select().from(scraperLogsTable).where(eq(scraperLogsTable.marketId, market.id));

    console.log(`Market ${market.id} (${market.name}): ${bids.length} bids, ${results.length} results, ${logs.length} logs`);
  }
}

checkMarketRelations().catch(console.error);