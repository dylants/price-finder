import Site from '../Site';
import { CheerioAPI } from 'cheerio';
export default class Crutchfield implements Site {
    protected uri: string;
    constructor(uri: string);
    getURIForPageData(): string;
    findPriceOnPage($: CheerioAPI): number;
    static isSite(uri: string): boolean;
}
