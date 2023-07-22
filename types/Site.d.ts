import { CheerioAPI } from 'cheerio';
export default abstract class Site {
    /**
     * Returns the URI used to find the page data
     * (most likely the same URI used in constructing this Site)
     *
     * @return {string} The URI used to find the page data
     */
    abstract getURIForPageData(): string;
    /**
     * Returns the price found on the page
     *
     * @param  {CheerioAPI} $ jQuery object used to search the page
     * @return {number}       The price found on the page
     */
    abstract findPriceOnPage($: CheerioAPI): number;
    /**
     * Returns true if this site supports the incoming URI
     *
     * @param  {string}  uri The URI to test
     * @return {boolean}     true if this Site supports the URI, false otherwise
     */
    static isSite(uri: string): boolean;
}
