import Site from '../Site';
export default class AmazonSite implements Site {
    protected uri: string;
    constructor(uri: string);
    getURIForPageData(): string;
    isJSON(): boolean;
    findPriceOnPage($: any): number;
    static isSite(uri: string): boolean;
}
