'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class PriceMinisterSite {
  constructor(uri) {
    if (!PriceMinisterSite.isSite(uri)) {
      throw new Error('invalid uri for PriceMinister: %s', uri);
    }

    this._uri = uri;
  }

  getURIForPageData() {
    return this._uri;
  }

  isJSON() {
    return false;
  }

  findPriceOnPage($) {
    const selectors = [
      '#prdBuyBoxV2 .price',
    ];

    // find the price on the page
    const priceString = siteUtils.findContentOnPage($, selectors);

    // were we successful?
    if (!priceString) {
      logger.error('price not found on PriceMinister page, uri: %s', this._uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage() {
    // PriceMinister only has video games, so hard code it
    const category = siteUtils.categories.VIDEO_GAMES;

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    const name = $("meta[itemprop='name']").attr('content');

    if (!name) {
      logger.error('name not found on PriceMinister page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('www.priceminister.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = PriceMinisterSite;
