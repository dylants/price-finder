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
     * @param  {Function} callback Callback called when complete, with first argument
     *                             a possible error object, and second argument the
     *                             item price (number).
     */
    findItemPrice(uri: string, callback: (err: unknown | string | null, price: number | undefined) => void): void;
    private pageScrape;
}
export {};
