import Site from '../Site';
import logger from '../logger';
import * as siteUtils from '../site-utils';
import { CheerioAPI } from 'cheerio';

export default class Crutchfield implements Site {
  constructor(protected uri: string) {
    if (!Crutchfield.isSite(uri)) {
      throw new Error(`invalid uri for Crutchfield: ${uri}`);
    }
  }

  getURIForPageData(): string {
    return this.uri;
  }

  findPriceOnPage($: CheerioAPI): number {
    const selectors = ['.pricing-wrapper .price.js-price'];

    const priceString = siteUtils.findContentOnPage($, selectors);

    if (!priceString) {
      logger.error('price not found on Crutchfield page, uri: %s', this.uri);
      return -1;
    }

    const price = siteUtils.processPrice(priceString);

    return price;
  }

  static isSite(uri: string): boolean {
    if (uri.indexOf('www.crutchfield.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = Crutchfield;
