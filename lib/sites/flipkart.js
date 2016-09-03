'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class FlipkartSite {
  constructor(uri) {
    if (!FlipkartSite.isSite(uri)) {
      throw new Error('invalid uri for Flipkart: %s', uri);
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
    // find the price on the page using regex!
    // https://github.com/dylants/price-finder/issues/98
    let priceString;
    const regex = /Rs.\s*(\d+)/ig;
    const results = regex.exec($('meta[name="Description"]').attr('content'));
    if (results && results.length > 1) {
      priceString = results[1];
    }

    // were we successful?
    if (!priceString) {
      logger.error('price not found on Flipkart page, uri: %s', this._uri);
      return -1;
    }

    // process the price string in rupees
    const price = siteUtils.processPrice(`R ${priceString}`);

    return price;
  }

  findCategoryOnPage() {
    // default to other
    const category = siteUtils.categories.OTHER;

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    // find the name on the page
    const name = $('title').text().trim();

    // were we successful?
    if (!name) {
      logger.error('name not found on Flipkart page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('flipkart.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = FlipkartSite;
