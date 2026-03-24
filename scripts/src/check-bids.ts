import "dotenv/config";
import { db, bidsTable, marketsTable } from '../../lib/db/src/index.js';

async function checkBids() {
  const markets = await db.select().from(marketsTable);
  console.log('Markets:', JSON.stringify(markets, null, 2));

  const bids = await db.select().from(bidsTable);
  console.log('All bids:', JSON.stringify(bids, null, 2));
}

checkBids().catch(console.error);