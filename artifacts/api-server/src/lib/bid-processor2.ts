import { db, bids2Table, markets2Table, usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

/**
 * Process Market2 Bids - Calculate win/loss based on 2-digit result
 * 
 * Bet Types:
 * - left_digit: User bets on left digit (0-9) → result.left = user number
 * - right_digit: User bets on odd/even → result.right is odd/even
 * - odd_even: User bets on odd/even in any position
 * - jodi: User bets on 2-digit exact match → result = user number
 */

interface Bids2Result {
  id: number;
  userId: number;
  betType: string;
  number: string;
  amount: string;
  multiplier: number | null;
  status: string;
}

async function processMarket2Bids(
  marketId: number,
  result: { left: string; right: string; jodi: string }
) {
  try {
    // Get all pending bids for this market
    const bids = await db.select().from(bids2Table)
      .where(eq(bids2Table.marketId, marketId)) as Bids2Result[];

    const pendingBids = bids.filter(b => b.status === "pending");

    if (pendingBids.length === 0) {
      console.log(`[Bid Processor 2] No pending bids for market ${marketId}`);
      return { processed: 0, won: 0, lost: 0 };
    }

    let wonCount = 0;
    let lostCount = 0;

    for (const bid of pendingBids) {
      const isWinner = checkBid2Winner(bid.betType, bid.number, result);
      const status = isWinner ? "won" : "lost";

      // Update bid status
      await db.update(bids2Table)
        .set({ status })
        .where(eq(bids2Table.id, bid.id));

      // If winner, add winnings to user wallet
      if (isWinner) {
        wonCount++;
        const multiplier = bid.multiplier || 0;
        const winAmount = (parseFloat(bid.amount) * multiplier).toString();

        // Update bid with win amount
        await db.update(bids2Table)
          .set({ winAmount })
          .where(eq(bids2Table.id, bid.id));

        // Add to user wallet
        await db.update(usersTable)
          .set({
            walletBalance: sql.raw(`wallet_balance + ${winAmount}`)
          })
          .where(eq(usersTable.id, bid.userId));

        console.log(
          `[Bid Processor 2] User ${bid.userId} WON ₹${winAmount} (${bid.betType}: ${bid.number} vs ${JSON.stringify(result)})`
        );
      } else {
        lostCount++;
        console.log(
          `[Bid Processor 2] User ${bid.userId} LOST (${bid.betType}: ${bid.number} vs ${JSON.stringify(result)})`
        );
      }
    }

    return {
      processed: pendingBids.length,
      won: wonCount,
      lost: lostCount
    };
  } catch (err) {
    console.error("[Bid Processor 2] Error:", err);
    throw err;
  }
}

/**
 * Check if a market2 bid is a winner
 */
function checkBid2Winner(
  betType: string,
  bidNumber: string,
  result: { left: string; right: string; jodi: string }
): boolean {
  switch (betType) {
    case "left_digit":
      // User bets on left digit
      return bidNumber === result.left;

    case "right_digit":
      // User bets on right digit
      return bidNumber === result.right;

    case "odd_even":
      // User bets on odd or even
      if (bidNumber === "odd") {
        // Check if either digit is odd
        return isOdd(result.left) || isOdd(result.right);
      } else if (bidNumber === "even") {
        // Check if either digit is even
        return !isOdd(result.left) || !isOdd(result.right);
      }
      return false;

    case "jodi":
      // User bets on exact 2-digit match
      return bidNumber === result.jodi;

    default:
      return false;
  }
}

function isOdd(digit: string): boolean {
  const num = parseInt(digit, 10);
  return num % 2 === 1;
}

/**
 * Calculate winning amount for market2 bids
 */
function calculateWinnings2(
  bidAmount: number,
  betType: string
): number {
  let multiplier = 1;

  switch (betType) {
    case "left_digit":
    case "right_digit":
      multiplier = 9; // 9x for single digit
      break;

    case "odd_even":
      multiplier = 1.8; // 1.8x for odd/even
      break;

    case "jodi":
      multiplier = 90; // 90x for jodi (2-digit)
      break;
  }

  return bidAmount * multiplier;
}

export {
  processMarket2Bids,
  checkBid2Winner,
  isOdd,
  calculateWinnings2
};
