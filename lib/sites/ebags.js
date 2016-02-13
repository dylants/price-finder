'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class EBagsSite {
  constructor(uri) {
    // error check to make sure this is a valid uri for eBags
    if (!EBagsSite.isSite(uri)) {
      throw new Error('invalid uri for eBags: %s', uri);
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
    // the various ways we can find the price on an ebags page
    const selectors = [
      '#divPricing *[itemprop="price"]',
    ];

    // find the price on the page
    const priceString = siteUtils.findContentOnPage($, selectors);

    // were we successful?
    if (!priceString) {
      logger.error('price not found on eBags page, uri: %s', this._uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage() {
    // we're assuming only luggage on ebags.com
    const category = siteUtils.categories.LUGGAGE;

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    const selectors = [
      '#productCon span[itemprop="name"]',
    ];

    // use the selectors to find the name on the page
    const name = siteUtils.findContentOnPage($, selectors);

    if (!name) {
      logger.error('name not found on eBags page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('ebags.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = EBagsSite;
