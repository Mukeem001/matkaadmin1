import "dotenv/config";
import { db, marketsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// List all markets
const markets = await db.select().from(marketsTable);
console.log('Available Markets:');
markets.forEach(m => {
  console.log(`ID: ${m.id}, Name: ${m.name}, Active: ${m.isActive}, Open: ${m.openTime}, Close: ${m.closeTime}`);
});

// Update market 1 to be active with open time
const now = new Date();
const openTime = String(Math.max(0, now.getHours() - 1)).padStart(2, '0') + ':00';
const closeTime = String((now.getHours() + 3) % 24).padStart(2, '0') + ':00';

await db.update(marketsTable)
  .set({ isActive: true, openTime, closeTime })
  .where(eq(marketsTable.id, 1));

console.log(`\nUpdated Market 1: Open=${openTime}, Close=${closeTime}, Active=true`);
