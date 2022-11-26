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
    // the various ways we can find the price on an amazon page
    const selectors = [
      // used in amazon fashion, home audio and video, and when sale price not in buy box
      '#priceblock_saleprice',

      // these specific selectors were added to support new pages, that did NOT contain
      // a decimal point in the price... so we're just grabbing the dollar amount (not cents)
      // https://github.com/dylants/price-finder/issues/97
      // used in (at least) video games
      '#price #newPrice .buyingPrice',
      '#price #newPitchPrice .price-large',

      // used in (at least) mobile apps
      '#actualPriceValue',

      // used in electronics, subscription items (without subscription)
      '#priceblock_ourprice',

      // used in CDs, DVDs, tools and home improvement, household items
      '#buybox .a-color-price',

      // used in (at least) digital music
      '#buybox_feature_div .a-button-primary .a-text-bold',

      // used in (at least) books
      '.a-color-price.header-price',

      // used when amazon is NOT showing their price, to instead look at other seller's price
      '#moreBuyingChoices_feature_div .a-color-price',

      // used in (at least) video games, when new price is NOT available
      '#price #usedPrice .buyingPrice',
      '#price #usedPitchPrice .price-large',
    ];

    // find the price on the page
    const priceString = siteUtils.findContentOnPage($, selectors);

    // were we successful?
    if (!priceString) {
      logger.error($('body').text().trim());
      logger.error('price not found on amazon page, uri: %s', this.uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(priceString);

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
