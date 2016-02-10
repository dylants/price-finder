'use strict';

const _ = require('lodash');
const siteUtils = require('../site-utils');
const logger = require('../logger')();

class NintendoSite {
  constructor(uri) {
    // error check to make sure this is a valid uri for Nintendo
    if (!NintendoSite.isSite(uri)) {
      throw new Error('invalid uri for Nintendo: %s', uri);
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
    const priceString = $('*[itemprop="price"]').text().trim();

    if (!priceString) {
      logger.error('price was not found on nintendo page, uri: %s', this._uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage() {
    // Nintendo only has video games, so hard code it
    const category = siteUtils.categories.VIDEO_GAMES;

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    const name = $('h1[itemprop="name"]').text();

    if (!name) {
      logger.error('name not found on nintendo page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (_.includes(uri, 'www.nintendo.com')) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = NintendoSite;
