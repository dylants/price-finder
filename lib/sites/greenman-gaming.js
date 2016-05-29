'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class GreenmanGamingSite {
  constructor(uri) {
    if (!GreenmanGamingSite.isSite(uri)) {
      throw new Error('invalid uri for GreenmanGaming: %s', uri);
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
      logger.error('price was not found on GreenmanGaming page, uri: %s', this._uri);
      return -1;
    }

    // process the price string as dollars
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

    // were we successful?
    if (!name) {
      logger.error('name not found on GreenmanGaming page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('greenmangaming.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = GreenmanGamingSite;
