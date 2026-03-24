declare function processMarket2Bids(marketId: number, result: {
    left: string;
    right: string;
    jodi: string;
}): Promise<{
    processed: number;
    won: number;
    lost: number;
}>;
/**
 * Check if a market2 bid is a winner
 */
declare function checkBid2Winner(betType: string, bidNumber: string, result: {
    left: string;
    right: string;
    jodi: string;
}): boolean;
declare function isOdd(digit: string): boolean;
/**
 * Calculate winning amount for market2 bids
 */
declare function calculateWinnings2(bidAmount: number, betType: string): number;
export { processMarket2Bids, checkBid2Winner, isOdd, calculateWinnings2 };
//# sourceMappingURL=bid-processor2.d.ts.map