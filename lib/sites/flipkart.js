'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class FlipkartSite {
  constructor(uri, config) {
    if (!FlipkartSite.isSite(uri)) {
      throw new Error('invalid uri for Flipkart: %s', uri);
    }

    this._uri = uri;

    // attempt to find the API key
    if (!config.headers) {
      const errorMessage = 'Flipkart cannot be called without an valid headers';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  getURIForPageData() {
    const pid = /pid=([^&]*)/.exec(this._uri);
    if (!pid || !pid[1]) {
      logger.error('Could not detect the PID from the URL');
      return null;
    }
    /* eslint-disable prefer-template */
    return 'https://affiliate-api.flipkart.net/affiliate/product/json?' +
     'id=' + pid[1];
    /* eslint-enable prefer-template */
  }

  isJSON() {
    return true;
  }

  findPriceOnPage(pageData) {
    // the various ways we can find the price
    if (typeof pageData !== 'object' || !pageData.productAttributes) {
      return -1;
    }
    return pageData.productAttributes.sellingPrice.amount;
  }

  findCategoryOnPage(pageData) {
    if (typeof pageData !== 'object' || !pageData.productIdentifier) {
      return null;
    }

    let category;
    const rawCategory = pageData.productIdentifier.categoryPaths.categoryPath[0][0].title;
    if (rawCategory === 'Electronics>Entertainment>TV & Video>TVs') {
      category = siteUtils.categories.TELEVISION_VIDEO;
    } else {
      category = siteUtils.categories.OTHER;
    }
    return category;
  }

  findNameOnPage(pageData) {
    if (typeof pageData !== 'object') {
      return null;
    }
    return pageData.productAttributes.title;
  }

  static isSite(uri) {
    if (uri.indexOf('flipkart.') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = FlipkartSite;
