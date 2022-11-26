import * as siteUtils from '../site-utils';
import logger from '../logger';
import Site from '../Site';
import { CheerioAPI } from 'cheerio';

export default class AmazonSite implements Site {
  constructor(protected uri: string) {
    // error check to make sure this is a valid uri for Amazon
    if (!AmazonSite.isSite(uri)) {
      throw new Error(`invalid uri for Amazon: ${uri}`);
    }
  }

  getURIForPageData(): string {
    return this.uri;
  }

  findPriceOnPage($: CheerioAPI): number {
    // find the price on the page
    const priceString = $('#twister-plus-price-data-price').val();

    // were we successful?
    if (!priceString) {
      logger.error($('body').text().trim());
      logger.error('price not found on amazon page, uri: %s', this.uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(<string>priceString);

    return price;
  }

  static isSite(uri: string): boolean {
    // (attempt) to support more countries than just amazon.com
    // we'll see how many we can actually support...
    if (uri.indexOf('www.amazon.') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = AmazonSite;
