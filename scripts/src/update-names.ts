import { db, marketsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function updateMarketNames() {
  // Update Morning Market to KALYAN MORNING
  const morningMarkets = await db.select().from(marketsTable).where(eq(marketsTable.name, 'Morning Market'));
  console.log('Found Morning Markets:', morningMarkets.length);

  for (const market of morningMarkets) {
    await db.update(marketsTable).set({
      name: 'KALYAN MORNING'
    }).where(eq(marketsTable.id, market.id));
  }

  // Update Evening Market to MILAN NIGHT
  const eveningMarkets = await db.select().from(marketsTable).where(eq(marketsTable.name, 'Evening Market'));
  console.log('Found Evening Markets:', eveningMarkets.length);

  for (const market of eveningMarkets) {
    await db.update(marketsTable).set({
      name: 'MILAN NIGHT'
    }).where(eq(marketsTable.id, market.id));
  }

  console.log('Market names updated');
}

updateMarketNames().catch(console.error);