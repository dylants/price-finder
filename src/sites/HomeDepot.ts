import Site from '../Site';
import logger from '../logger';
import * as siteUtils from '../site-utils';
import { CheerioAPI } from 'cheerio';

export default class HomeDepot implements Site {
  constructor(protected uri: string) {
    // error check to make sure this is a valid uri for Home Depot
    if (!HomeDepot.isSite(uri)) {
      throw new Error(`invalid uri for Home Depot: ${uri}`);
    }
  }

  getURIForPageData(): string {
    return this.uri;
  }

  findPriceOnPage($: CheerioAPI): number {
    // find the price on the page
    const selectors = ['.price-format__main-price'];

    // find the price on the page
    const priceString = siteUtils.findContentOnPage($, selectors);

    // were we successful?
    if (!priceString) {
      // logger.error($('body').text().trim());
      logger.error('price not found on Home Depot page, uri: %s', this.uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(priceString);

    // return price;
    return price;
  }

  static isSite(uri: string): boolean {
    if (uri.indexOf('www.homedepot.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = HomeDepot;
