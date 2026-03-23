import axios from "axios";
import * as cheerio from "cheerio";
import { eq, and } from "drizzle-orm";
import { format } from "date-fns";
import { db, marketsTable, scraperLogsTable, resultsTable } from "@workspace/db";
import { getTodayDateIST } from "./date-utils";

export interface ScrapedResult {
  openResult?: string;
  closeResult?: string;
  jodiResult?: string;
}

// ================= HELPER FUNCTIONS =================
function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
}

function timeToMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

// Check if current time is after closeTime + 20 minutes
function isAfterCloseWindow(closeTime: string): boolean {
  const { hours: closeHour, minutes: closeMin } = parseTimeString(closeTime);
  const closeTimeInMinutes = timeToMinutes(closeHour, closeMin);
  const closeWindowEndMinutes = closeTimeInMinutes + 20; // 20 min after close
  const currentTimeInMinutes = getCurrentTimeInMinutes();
  
  return currentTimeInMinutes >= closeWindowEndMinutes;
}

// ================= SCRAPER =================
export async function scrapeResult(
  url: string,
  marketName?: string
): Promise<ScrapedResult> {

  // 👉 sirf satkamatka handle
  if (url === "https://satkamatka.com.in/" && marketName) {
    return await scrapeSattaMatkaComIn(marketName);
  }

  const response = await axios.get(url, {
    timeout: 10000,
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const $ = cheerio.load(response.data);
  const text = $("body").text();

  const match = text.match(/(\d{1,3})-(\d{1,3})-(\d{1,3})/);

  if (match) {
    return {
      openResult: match[1],
      jodiResult: match[2],
      closeResult: match[3],
    };
  }

  return {};
}

// ================= SATKAMATKA (FIRST PAGE ONLY) =================
async function scrapeSattaMatkaComIn(
  marketName: string
): Promise<ScrapedResult> {

  const response = await axios.get("https://satkamatka.com.in/", {
    timeout: 10000,
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const $ = cheerio.load(response.data);
  const text = $("body").text();

  const lines = text
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);  // Keep all lines

  console.log("\n========== 🔍 SCRAPING SATKAMATKA ==========");
  console.log("Market to find:", `"${marketName}"`);
  console.log("Total lines:", lines.length);

  const cleanMarket = marketName.toUpperCase().replace(/\s+/g, " ").trim();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLine = line.toUpperCase().replace(/\s+/g, " ").trim();

    // ✅ EXACT MATCH ONLY
    if (cleanLine === cleanMarket) {
      console.log(`🎯 MARKET FOUND at line ${i}:`, `"${line}"`);

      // Search in next 5 lines for results (try multiple regex patterns)
      for (let j = i; j < i + 5 && j < lines.length; j++) {
        const checkLine = lines[j];
        console.log(`  👉 Checking [${j}]:`, `"${checkLine}"`);

        // Try pattern 1: XXX-XX-XXX (e.g., 156-25-267)
        let match = checkLine.match(/(\d{1,3})-(\d{1,3})-(\d{1,3})/);
        if (match) {
          console.log(`✅ FOUND PATTERN 1 (XXX-XX-XXX):`, match[0]);
          return {
            openResult: match[1],
            jodiResult: match[2],
            closeResult: match[3],
          };
        }

        // Try pattern 2: XXX-X (e.g., 567-8) - treat as open-jodi, close will be from next occurrence
        match = checkLine.match(/(\d{1,3})-(\d{1,3})(?!-)/);
        if (match && !checkLine.includes("...")) {
          console.log(`✅ FOUND PATTERN 2 (XXX-X):`, match[0]);
          return {
            openResult: match[1],
            jodiResult: match[2],
            closeResult: match[2],  // Use jodi as close for now
          };
        }

        // Try pattern 3: Just numbers (e.g., 156 25 267)
        match = checkLine.match(/(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})/);
        if (match) {
          console.log(`✅ FOUND PATTERN 3 (space-separated):`, match[0]);
          return {
            openResult: match[1],
            jodiResult: match[2],
            closeResult: match[3],
          };
        }
      }
      
      console.log(`❌ No result format found after market`);
    }
  }

  console.log("❌ MARKET NOT FOUND - tried to match:", `"${cleanMarket}"`);
  console.log("========== SCRAPING SATKAMATKA END ==========\n");
  return {};
}

// ================= SATKAMATKA LIVE RESULTS (DIRECTLY FROM WEBSITE) =================
export async function scrapeLiveResults(marketName: string): Promise<ScrapedResult> {
  try {
    console.log("\n========== 🔴 [LIVE] SCRAPING START ==========");
    console.log("Market:", `"${marketName}"`);
    
    const response = await axios.get("https://satkamatka.com.in/", {
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(response.data);
    const text = $("body").text();

    const lines = text
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0);

    console.log("Total lines:", lines.length);

    const cleanMarket = marketName.toUpperCase().replace(/\s+/g, " ").trim();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const cleanLine = line.toUpperCase().replace(/\s+/g, " ").trim();

      // ✅ EXACT MATCH ONLY
      if (cleanLine === cleanMarket) {
        console.log(`🎯 [LIVE] MARKET FOUND at line ${i}`);

        // Search in next 5 lines for results (try multiple regex patterns)
        for (let j = i; j < i + 5 && j < lines.length; j++) {
          const checkLine = lines[j];
          console.log(`  👉 [LIVE] Checking [${j}]:`, `"${checkLine}"`);

          // Try pattern 1: XXX-XX-XXX
          let match = checkLine.match(/(\d{1,3})-(\d{1,3})-(\d{1,3})/);
          if (match) {
            console.log(`✅ [LIVE] FOUND PATTERN 1:`, match[0]);
            console.log("========== [LIVE] SCRAPING END - SUCCESS ==========\n");
            return {
              openResult: match[1],
              jodiResult: match[2],
              closeResult: match[3],
            };
          }

          // Try pattern 2: XXX-X
          match = checkLine.match(/(\d{1,3})-(\d{1,3})(?!-)/);
          if (match && !checkLine.includes("...")) {
            console.log(`✅ [LIVE] FOUND PATTERN 2:`, match[0]);
            console.log("========== [LIVE] SCRAPING END - SUCCESS ==========\n");
            return {
              openResult: match[1],
              jodiResult: match[2],
              closeResult: match[2],
            };
          }

          // Try pattern 3: space-separated
          match = checkLine.match(/(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})/);
          if (match) {
            console.log(`✅ [LIVE] FOUND PATTERN 3:`, match[0]);
            console.log("========== [LIVE] SCRAPING END - SUCCESS ==========\n");
            return {
              openResult: match[1],
              jodiResult: match[2],
              closeResult: match[3],
            };
          }
        }
      }
    }

    console.log("❌ [LIVE] MARKET NOT FOUND");
    console.log("========== [LIVE] SCRAPING END - FAILED ==========\n");
    return {};
  } catch (error) {
    console.error("[LIVE] Error:", error);
    console.log("========== [LIVE] SCRAPING END - ERROR ==========\n");
    return {};
  }
}

// ================= MAIN FUNCTION =================
export async function fetchAndUpdateMarketResult(
  marketId: number
) {
  const [market] = await db
    .select()
    .from(marketsTable)
    .where(eq(marketsTable.id, marketId));

  if (!market) {
    return { success: false, message: "Market not found" };
  }

  if (!market.sourceUrl) {
    return { success: false, message: "No source URL" };
  }

  // ✅ Check if current time is after closeTime + 20 minutes
  if (!isAfterCloseWindow(market.closeTime)) {
    const { hours, minutes } = parseTimeString(market.closeTime);
    const closeWindow = timeToMinutes(hours, minutes) + 20;
    const closeHrs = Math.floor(closeWindow / 60) % 24;
    const closeMins = closeWindow % 60;
    const windowTimeStr = `${String(closeHrs).padStart(2, '0')}:${String(closeMins).padStart(2, '0')}`;
    return { 
      success: false, 
      message: `Can fetch only after ${windowTimeStr} (closeTime: ${market.closeTime} + 20 min)` 
    };
  }

  let scraped: ScrapedResult;

  try {
    scraped = await scrapeResult(market.sourceUrl, market.name);

    console.log("========== RESULT DEBUG ==========");
    console.log("Market:", market.name);
    console.log("Open:", scraped.openResult);
    console.log("Jodi:", scraped.jodiResult);
    console.log("Close:", scraped.closeResult);
    console.log("==================================");

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    await db.insert(scraperLogsTable).values({
      marketId: market.id,
      marketName: market.name,
      sourceUrl: market.sourceUrl,
      success: false,
      errorMessage,
    });

    return { success: false, message: errorMessage };
  }

  const isValid =
    scraped.openResult &&
    scraped.closeResult &&
    scraped.jodiResult;

  if (!isValid) {
    console.log("❌ INVALID RESULT — NOT SAVING");
    return { success: false, message: "Invalid result" };
  }

  // ✅ TODAY's DATE (not YESTERDAY)
  const resultDateStr = getTodayDateIST();

  const [existingResult] = await db
    .select()
    .from(resultsTable)
    .where(
      and(
        eq(resultsTable.marketId, marketId),
        eq(resultsTable.resultDate, resultDateStr)
      )
    );

  if (existingResult) {
    await db.update(resultsTable).set({
      openResult: scraped.openResult,
      closeResult: scraped.closeResult,
      jodiResult: scraped.jodiResult,
    }).where(eq(resultsTable.id, existingResult.id));
  } else {
    await db.insert(resultsTable).values({
      marketId: market.id,
      resultDate: resultDateStr,
      openResult: scraped.openResult,
      closeResult: scraped.closeResult,
      jodiResult: scraped.jodiResult,
    });
  }

  await db.update(marketsTable).set({
    lastFetchedAt: new Date(),
    fetchError: null,
  }).where(eq(marketsTable.id, marketId));

  await db.insert(scraperLogsTable).values({
    marketId: market.id,
    marketName: market.name,
    sourceUrl: market.sourceUrl,
    success: true,
    openResult: scraped.openResult,
    closeResult: scraped.closeResult,
    jodiResult: scraped.jodiResult,
  });

  return {
    success: true,
    message: "✅ Result saved (first page only) - TODAY's date",
    data: scraped,
  };
}