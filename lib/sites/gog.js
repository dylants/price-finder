'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class GogSite {
  constructor(uri) {
    if (!GogSite.isSite(uri)) {
      throw new Error('invalid uri for Gog: %s', uri);
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
    const priceString = $("*[itemprop='price']").attr('content');

    if (!priceString) {
      logger.error('price not found on Gog page, uri: %s', this._uri);
      return -1;
    }

    // process the price in dollars
    const price = siteUtils.processPrice(`$${priceString}`);

    return price;
  }

  findCategoryOnPage() {
    const category = siteUtils.categories.VIDEO_GAMES;

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    const name = $('*[itemprop="name"]').text();

    if (!name) {
      logger.error('name not found on Gog page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('www.gog.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = GogSite;
