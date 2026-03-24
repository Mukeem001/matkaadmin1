import { db, marketsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function updateMarkets() {
  await db.update(marketsTable).set({
    autoUpdate: true,
    sourceUrl: 'https://satkamatka.com.in/'
  }).where(eq(marketsTable.name, 'Morning Market'));

  await db.update(marketsTable).set({
    autoUpdate: true,
    sourceUrl: 'https://satkamatka.com.in/'
  }).where(eq(marketsTable.name, 'Evening Market'));

  console.log('Markets updated for auto-scraping');
}

updateMarkets().catch(console.error);