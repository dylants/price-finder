export declare const categories: Readonly<{
    BOOKS: "Books";
    CAMERA_VIDEO: "Camera & Video";
    DIGITAL_MUSIC: "Digital Music";
    ELECTRONICS: "Electronics";
    HEALTH_PERSONAL_CARE: "Health & Personal Care";
    HOME_AUDIO: "Home Audio";
    HOUSEHOLD: "Household";
    KINDLE_BOOKS: "Kindle Books";
    LUGGAGE: "Luggage";
    MOBILE: "Mobile Phones";
    MOBILE_APPS: "Mobile Apps";
    MOVIES_TV: "Movies & TV";
    MUSIC: "Music";
    OTHER: "Other";
    TELEVISION_VIDEO: "Television & Video";
    TOYS_GAMES: "Toys & Games";
    VIDEO_GAMES: "Video Games";
}>;
/**
 * Finds content on a page, returning either the text or null.
 *
 * @param  {any} $         jQuery-like object
 * @param  {Array<string>} selectors  An array of selectors to search with
 * @return {String | null}           The content found (or null)
 */
export declare function findContentOnPage($: any, selectors: Array<string>): string | null;
export declare function processPrice(priceStringInput: string): number;
