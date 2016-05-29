'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class WalmartSite {
  constructor(uri) {
    if (!WalmartSite.isSite(uri)) {
      throw new Error('invalid uri for Walmart: %s', uri);
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
    // the various ways we can find the price
    const selectors = [
      '*[itemprop="price"]',
    ];

    // find the price on the page
    const priceString = siteUtils.findContentOnPage($, selectors);

    // were we successful?
    if (!priceString) {
      logger.error('price not found on Walmart page, uri: %s', this._uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage($) {
    const walmartCategory = $('li.breadcrumb').eq(0).text().trim();
    let category = siteUtils.categories.OTHER;
    if (walmartCategory === 'Electronics') {
      category = siteUtils.categories.ELECTRONICS;
    }

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    // use the selectors to find the name on the page
    const name = $('*h1[itemprop="name"]').text().trim();

    // were we successful?
    if (!name) {
      logger.error('name not found on Walmart page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('walmart.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = WalmartSite;
