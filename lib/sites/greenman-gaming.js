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
    let currencyTag;
    let productJson;

    // To find Currency
    $('script').each(function loadProductJson() {
      currencyTag = $(this).text().trim();
      if (currencyTag.indexOf('var utag_data') !== -1) {
        productJson = currencyTag.substring(currencyTag.indexOf('{'), currencyTag.length - 1);
        productJson = JSON.parse(productJson);
      }
    });

    // without the productJson, we're unable to find the price
    if (!productJson) {
      logger.error('price not found on GreenmanGaming page, uri: %s', this._uri);
      return -1;
    }

    const currency = productJson.currency_code;
    const priceString = productJson.product_price_readable;

    // were we successful?
    if (!priceString || !currency) {
      logger.error('price not found on GreenmanGaming page, uri: %s', this._uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(`${currency} ${priceString}`);

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
