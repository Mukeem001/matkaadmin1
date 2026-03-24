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
export declare function isBidWinner(bidNumber: string, gameType: string, result: MarketResult): boolean;
/**
 * Calculate winnings based on game type and rates
 */
export declare function calculateWinnings(bidAmount: number, gameType: string, rates: GameRates): number;
/**
 * Process all pending bids for a market when results are declared
 */
export declare function processMarketBids(marketId: number, result: MarketResult): Promise<void>;
/**
 * Process market bids before closeTime - 20 minutes
 * Called when user wants to check win/loss for today's bets
 * Fetches TODAY's result and updates bid status accordingly
 */
export declare function processMarketBidsPreClose(marketId: number): Promise<{
    success: boolean;
    message: string;
    processed?: number;
    won?: number;
    lost?: number;
}>;
//# sourceMappingURL=bid-processor.d.ts.map