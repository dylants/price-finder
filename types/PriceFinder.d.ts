interface Config {
    retrySleepTime: number;
    retryStatusCodes: number[];
}
interface Options {
    retrySleepTime?: number;
    retryStatusCodes?: number[];
}
export default class PriceFinder {
    config: Config;
    constructor(options?: Options | undefined);
    /**
     * Scrapes a website specified by the uri and finds the item price.
     *
     * @param  {string}   uri      The uri of the website to scan
     * @return {number | undefined} the item price if found
     * @throws Error if the scrape fails
     */
    findItemPrice(uri: string): Promise<number | undefined>;
    private pageScrape;
}
export {};
