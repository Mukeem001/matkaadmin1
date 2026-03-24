export interface ScrapedResult {
    openResult?: string;
    closeResult?: string;
    jodiResult?: string;
}
export declare function scrapeResult(url: string, marketName?: string): Promise<ScrapedResult>;
export declare function scrapeLiveResults(marketName: string): Promise<ScrapedResult>;
export declare function fetchAndUpdateMarketResult(marketId: number): Promise<{
    success: boolean;
    message: string;
    data?: undefined;
} | {
    success: boolean;
    message: string;
    data: ScrapedResult;
}>;
//# sourceMappingURL=scraper.d.ts.map