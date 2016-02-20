'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class InfibeamSite {
  constructor(uri) {
    if (!InfibeamSite.isSite(uri)) {
      throw new Error('invalid uri for Infibeam: %s', uri);
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
      '#price-after-discount',
    ];

    // find the price on the page
    const priceString = siteUtils.findContentOnPage($, selectors);

    // were we successful?
    if (!priceString) {
      logger.error('price not found on Infibeam page, uri: %s', this._uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage($) {
    const infibeamCategory = $('.breadcrumb-sdp span').eq(0).text();

    let category = siteUtils.categories.OTHER;
    if (infibeamCategory === 'Electronics') {
      category = siteUtils.categories.ELECTRONICS;
    }

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    // the various ways we can find the name
    const selectors = [
      '.product-title-big',
    ];

    // use the selectors to find the name on the page
    const name = siteUtils.findContentOnPage($, selectors);

    // were we successful?
    if (!name) {
      logger.error('name not found on Infibeam page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('infibeam.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = InfibeamSite;
