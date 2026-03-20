import "dotenv/config";
import { db, marketsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

(async function () {
  try {
    // Get current markets
    const markets = await db.select().from(marketsTable);
    console.log("Current markets:", markets.map(m => ({ id: m.id, name: m.name, autoUpdate: m.autoUpdate, sourceUrl: m.sourceUrl })));

    // Update markets to enable auto-scraping
    await db.update(marketsTable).set({
      autoUpdate: true,
      sourceUrl: 'https://satkamatka.com.in/'
    }).where(eq(marketsTable.name, 'Morning Market'));

    await db.update(marketsTable).set({
      autoUpdate: true,
      sourceUrl: 'https://satkamatka.com.in/'
    }).where(eq(marketsTable.name, 'Evening Market'));

    console.log("Markets updated for auto-scraping");

    // Verify
    const updated = await db.select().from(marketsTable);
    console.log("Updated markets:", updated.map(m => ({ id: m.id, name: m.name, autoUpdate: m.autoUpdate, sourceUrl: m.sourceUrl })));

    const count = await db
      .select({ c: marketsTable.id })
      .from(marketsTable)
      .where(eq(marketsTable.autoUpdate, true));

    console.log("Markets with auto-update enabled:", count.length);
  } catch (err) {
    console.error("Query failed:", err);
    process.exit(1);
  }
})();
