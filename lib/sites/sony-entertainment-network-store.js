'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class SonyEntertainmentNetworkStoreSite {
  constructor(uri) {
    // error check to make sure this is a valid uri for Sony
    if (!SonyEntertainmentNetworkStoreSite.isSite(uri)) {
      throw new Error('invalid uri for Sony Entertainment Network Store: %s', uri);
    }

    this._uri = uri;
  }

  isJSON() {
    return true;
  }

  getURIForPageData() {
    let apiURI = 'https://store.playstation.com/store/api/chihiro/00_09_000/container/US/en/999/';
    // add the CID of the URI to the API URI
    apiURI += this._uri.slice(this._uri.indexOf('cid=') + 'cid='.length);

    return apiURI;
  }

  findPriceOnPage(pageData) {
    let priceString;

    // verify the default_sku exists (valid page data)
    if (!pageData || !pageData.default_sku) {
      logger.error('price was not found on sony store page, uri: %s', this._uri);
      return -1;
    }

    // try to get the PS Plus price first
    if (pageData.default_sku.rewards && pageData.default_sku.rewards.length > 0) {
      priceString = pageData.default_sku.rewards[0].display_price;

      // account for free
      if (priceString === 'Free') {
        priceString = '$0';
      }
    } else {
      // find the default price
      priceString = pageData.default_sku.display_price;
    }

    if (!priceString) {
      logger.error('price was not found on sony store page, uri: %s', this._uri);
      return -1;
    }

    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage(pageData) {
    let category;

    category = pageData.bucket;
    if (!category || category.length < 1) {
      logger.error('category not found on sony store page, uri: %s', this._uri);
      return null;
    }

    if (category === 'games') {
      category = siteUtils.categories.VIDEO_GAMES;
    } else {
      logger.log('category not setup, using "other"');
      category = siteUtils.categories.OTHER;
    }

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage(pageData) {
    const name = pageData.name; // eslint-disable-line prefer-destructuring

    if (!name || name.length < 1) {
      logger.error('name not found on sony entertainment network store page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if ((uri.indexOf('store.sonyentertainmentnetwork.com') > -1)
        || (uri.indexOf('store.playstation.com') > -1)) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = SonyEntertainmentNetworkStoreSite;
