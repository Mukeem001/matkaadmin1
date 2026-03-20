import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { db, bidsTable, usersTable, gameRatesTable } from "@workspace/db";

export interface MarketResult {
  openResult?: string;
  closeResult?: string;
  jodiResult?: string;
  pannaResult?: string;
}

export interface GameRates {
  singleDigit: number;
  jodiDigit: number;
  singlePanna: number;
  doublePanna: number;
  triplePanna: number;
  halfSangam: number;
  fullSangam: number;
}

/**
 * Check if a bid number matches the result based on game type
 */
function isBidWinner(bidNumber: string, gameType: string, result: MarketResult): boolean {
  const { openResult, closeResult, jodiResult, pannaResult } = result;

  console.log(`Checking bid: number=${bidNumber}, gameType=${gameType}, result=`, result);

  switch (gameType) {
    case "single_digit":
      // Single digit matches the last digit of sum (open + close)
      if (openResult && closeResult) {
        // Extract last digits and sum them
        const openLastDigit = parseInt(openResult.slice(-1));
        const closeLastDigit = parseInt(closeResult.slice(-1));
        const sum = openLastDigit + closeLastDigit;
        const lastDigit = sum % 10;
        const result = bidNumber === lastDigit.toString();
        console.log(`Single digit check: ${openLastDigit} + ${closeLastDigit} = ${sum}, last digit = ${lastDigit}, bid = ${bidNumber}, match = ${result}`);
        return result;
      }
      return false;

    case "jodi":
      // Jodi matches the exact sum of last digits of open + close
      if (openResult && closeResult) {
        const openLastDigit = parseInt(openResult.slice(-1));
        const closeLastDigit = parseInt(closeResult.slice(-1));
        const sum = openLastDigit + closeLastDigit;
        const jodi = sum.toString().padStart(2, '0'); // Ensure 2 digits
        const result = bidNumber === jodi;
        console.log(`Jodi check: ${openLastDigit} + ${closeLastDigit} = ${sum}, jodi = ${jodi}, bid = ${bidNumber}, match = ${result}`);
        return result;
      }
      return false;

    case "single_panna":
      // Single panna matches the open result
      if (openResult) {
        const result = bidNumber === openResult;
        console.log(`Single panna check: openResult = ${openResult}, bid = ${bidNumber}, match = ${result}`);
        return result;
      }
      return false;

    case "double_panna":
      // Double panna - two digits are same
      if (openResult && openResult.length === 3) {
        const digits = openResult.split("");
        const uniqueDigits = [...new Set(digits)];
        const result = uniqueDigits.length === 2 && bidNumber === openResult;
        console.log(`Double panna check: openResult = ${openResult}, unique digits = ${uniqueDigits.length}, bid = ${bidNumber}, match = ${result}`);
        return result;
      }
      return false;

    case "triple_panna":
      // Triple panna - all digits different
      if (openResult && openResult.length === 3) {
        const digits = openResult.split("");
        const uniqueDigits = [...new Set(digits)];
        const result = uniqueDigits.length === 3 && bidNumber === openResult;
        console.log(`Triple panna check: openResult = ${openResult}, unique digits = ${uniqueDigits.length}, bid = ${bidNumber}, match = ${result}`);
        return result;
      }
      return false;

    case "half_sangam":
      // Half sangam - matches either open or close result
      const openMatch = bidNumber === openResult;
      const closeMatch = bidNumber === closeResult;
      const result = openMatch || closeMatch;
      console.log(`Half sangam check: openResult = ${openResult}, closeResult = ${closeResult}, bid = ${bidNumber}, match = ${result}`);
      return result;

    case "full_sangam":
      // Full sangam - matches both open and close results combined
      if (openResult && closeResult && bidNumber.length === 6) {
        const combined = `${openResult}${closeResult}`;
        const result = bidNumber === combined;
        console.log(`Full sangam check: combined = ${combined}, bid = ${bidNumber}, match = ${result}`);
        return result;
      }
      return false;

    default:
      console.log(`Unknown game type: ${gameType}`);
      return false;
  }
}

/**
 * Calculate winnings based on game type and rates
 */
function calculateWinnings(bidAmount: number, gameType: string, rates: GameRates): number {
  // Map snake_case game types to camelCase property names
  const gameTypeMapping: Record<string, keyof GameRates> = {
    "single_digit": "singleDigit",
    "jodi": "jodiDigit",
    "single_panna": "singlePanna",
    "double_panna": "doublePanna",
    "triple_panna": "triplePanna",
    "half_sangam": "halfSangam",
    "full_sangam": "fullSangam",
  };

  const rateKey = gameTypeMapping[gameType];
  const multiplier = rateKey ? rates[rateKey] : 1;
  return bidAmount * multiplier;
}

/**
 * Process all pending bids for a market when results are declared
 */
export async function processMarketBids(marketId: number, result: MarketResult): Promise<void> {
  console.log(`Processing bids for market ${marketId} with result:`, result);

  // Get game rates
  const [rates] = await db.select().from(gameRatesTable).limit(1);
  if (!rates) {
    console.error("Game rates not found");
    return;
  }

  console.log("Game rates found:", rates);

  const gameRates: GameRates = {
    singleDigit: parseFloat(rates.singleDigit as string),
    jodiDigit: parseFloat(rates.jodiDigit as string),
    singlePanna: parseFloat(rates.singlePanna as string),
    doublePanna: parseFloat(rates.doublePanna as string),
    triplePanna: parseFloat(rates.triplePanna as string),
    halfSangam: parseFloat(rates.halfSangam as string),
    fullSangam: parseFloat(rates.fullSangam as string),
  };

  console.log("Parsed game rates:", gameRates);

  // Get all pending bids for this market
  const pendingBids = await db.select({
    id: bidsTable.id,
    userId: bidsTable.userId,
    gameType: bidsTable.gameType,
    amount: bidsTable.amount,
    number: bidsTable.number,
  })
    .from(bidsTable)
    .where(and(
      eq(bidsTable.marketId, marketId),
      eq(bidsTable.status, "pending")
    ));

  console.log(`Found ${pendingBids.length} pending bids for market ${marketId}`);
  if (pendingBids.length > 0) {
    console.log("Sample bids:", pendingBids.slice(0, 3));
  }

  // Process each bid
  for (const bid of pendingBids) {
    const bidAmount = parseFloat(bid.amount as string);
    const isWinner = isBidWinner(bid.number, bid.gameType, result);

    console.log(`Processing bid ${bid.id}: number=${bid.number}, gameType=${bid.gameType}, amount=${bidAmount}, isWinner=${isWinner}`);

    if (isWinner) {
      // Calculate winnings
      const winnings = calculateWinnings(bidAmount, bid.gameType, gameRates);
      const totalWinnings = bidAmount + winnings; // Return original bid + winnings

      console.log(`Bid ${bid.id} won! Winnings: ${winnings}, Total: ${totalWinnings}`);

      // Update bid status and user wallet in transaction
      await db.transaction(async (tx) => {
        // Update bid status to won
        const updateResult = await tx.update(bidsTable)
          .set({ status: "won" })
          .where(eq(bidsTable.id, bid.id));

        console.log(`Updated bid ${bid.id} status to won, result:`, updateResult);

        // Add winnings to user wallet
        const walletResult = await tx.update(usersTable)
          .set({ walletBalance: sql`${usersTable.walletBalance} + ${totalWinnings}` })
          .where(eq(usersTable.id, bid.userId));

        console.log(`Updated user ${bid.userId} wallet by ${totalWinnings}, result:`, walletResult);
      });

      console.log(`User ${bid.userId} won ${totalWinnings} on bid ${bid.id}`);
    } else {
      // Update bid status to lost
      const updateResult = await db.update(bidsTable)
        .set({ status: "lost" })
        .where(eq(bidsTable.id, bid.id));

      console.log(`Updated bid ${bid.id} status to lost, result:`, updateResult);
    }
  }
}