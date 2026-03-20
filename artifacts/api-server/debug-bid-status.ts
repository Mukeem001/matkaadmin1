import { db, bidsTable, usersTable, resultsTable } from "@workspace/db";
import { processMarketBids } from "./src/lib/bid-processor.js";

async function main() {
  console.log("Fetching latest bids...");
  const bids = await db.select({ id: bidsTable.id, status: bidsTable.status, userId: bidsTable.userId, marketId: bidsTable.marketId, amount: bidsTable.amount, number: bidsTable.number, gameType: bidsTable.gameType }).from(bidsTable).orderBy(bidsTable.createdAt);
  console.log("Bids:", bids);

  console.log("Fetching latest declared results...");
  const results = await db.select().from(resultsTable).orderBy(resultsTable.createdAt, "desc").limit(5);
  console.log("Results:", results);

  const pending = bids.filter(b => b.status === "pending");
  console.log(`Pending bids: ${pending.length}`);

  if (pending.length > 0) {
    const bid = pending[0];
    console.log("Example pending bid:", bid);
  }

  // Optionally: list users wallet
  const users = await db.select({ id: usersTable.id, walletBalance: usersTable.walletBalance }).from(usersTable).orderBy(usersTable.id);
  console.log("Users:", users.map(u => ({ id: u.id, walletBalance: parseFloat(u.walletBalance as string) })));

  console.log('\nRunning processMarketBids for marketId=2 with sample result...');
  await processMarketBids(2, { openResult: '12', closeResult: '34', jodiResult: '46', pannaResult: '123' });

  console.log('\nRunning processMarketBids for marketId=13 with sample result...');
  await processMarketBids(13, { openResult: '12', closeResult: '34', jodiResult: '46', pannaResult: '123' });

  console.log('Re-fetching bids after processMarketBids...');
  const bidsAfter = await db.select({ id: bidsTable.id, status: bidsTable.status, marketId: bidsTable.marketId }).from(bidsTable).orderBy(bidsTable.createdAt);
  console.log('Bids after:', bidsAfter);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
