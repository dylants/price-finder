'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class ThinkgeekSite {
  constructor(uri) {
    if (!ThinkgeekSite.isSite(uri)) {
      throw new Error('invalid uri for Thinkgeek: %s', uri);
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
    const priceString = siteUtils.findContentOnPage($, ['form#buy h3']);
    if (!priceString) {
      logger.error('price not found on Thinkgeek page, uri: %s', this._uri);
      return -1;
    }
    return siteUtils.processPrice(priceString);
  }

  findCategoryOnPage() {
    const category = siteUtils.categories.OTHER; // TODO find the category
    logger.log('category: %s', category);
    return category;
  }

  findNameOnPage($) {
    const name = siteUtils.findContentOnPage($, ['.header h1']);
    if (!name) {
      logger.error('name not found on Thinkgeek page, uri: %s', this._uri);
      return null;
    }
    logger.log('name: %s', name);
    return name;
  }

  static isSite(uri) {
    return uri.indexOf('thinkgeek.com') > -1;
  }
}

module.exports = ThinkgeekSite;
