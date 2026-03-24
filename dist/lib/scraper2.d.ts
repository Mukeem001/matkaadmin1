/**
 * Scraper for Market2 (2-digit markets)
 * Source: https://satta-king-fast.com/
 */
declare function fetchAndUpdateMarkets2Result(marketId: number): Promise<{
    success: boolean;
    message: string;
    data: null;
} | {
    success: boolean;
    message: string;
    data: {
        id: number;
        name: string;
        openTime: string;
        closeTime: string;
        isActive: boolean;
        openResult: string | null;
        closeResult: string | null;
        jodiResult: string | null;
        autoUpdate: boolean;
        sourceUrl: string | null;
        lastFetchedAt: Date | null;
        fetchError: string | null;
        createdAt: Date;
    };
}>;
/**
 * ✅ FIXED SCRAPER (TABLE BASED - ACCURATE)
 */
declare function scrapeMarkets2Result(url: string, marketName: string): Promise<string | null>;
/**
 * TIME LOGIC (UNCHANGED)
 */
declare function isAfterCloseWindow(closeTime: string): boolean;
declare function updateMarket2ActivityStatus(): Promise<void>;
export { fetchAndUpdateMarkets2Result, scrapeMarkets2Result, isAfterCloseWindow, updateMarket2ActivityStatus };
//# sourceMappingURL=scraper2.d.ts.map