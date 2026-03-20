import { scrapeLiveResults } from "./artifacts/api-server/src/lib/scraper.js";

async function test() {
  console.log("\n\n========== TESTING LIVE SCRAPE ==========\n");
  
  const marketName = "NIGHT TIME BAZAR";
  console.log(`Testing market: "${marketName}"`);
  
  const result = await scrapeLiveResults(marketName);
  
  console.log("\n========== FINAL RESULT ==========");
  console.log(JSON.stringify(result, null, 2));
  console.log("=====================================\n");
}

test().catch(console.error);
