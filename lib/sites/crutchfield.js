'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class Crutchfield {
  constructor(uri) {
    // error check to make sure this is a valid uri for Crutchfield
    if (!Crutchfield.isSite(uri)) {
      throw new Error('invalid uri for Crutchfield: %s', uri);
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
      logger.error('price was not found on crutchfield page, uri: %s', this._uri);
      return -1;
    }

    // process the price string as dollars
    const price = siteUtils.processPrice(`$${priceString}`);

    return price;
  }

  findCategoryOnPage($) {
    const categoryString = $('#breadCrumbNav .crumb:nth-child(2)').text();
    if (!categoryString || categoryString.length < 1) {
      logger.error('category not found on crutchfield page, uri: %s', this._uri);
      return null;
    }

    let category;
    if (categoryString.indexOf('TVs & Video') > -1) {
      category = siteUtils.categories.TELEVISION_VIDEO;
    } else if (categoryString.indexOf('Home Audio') > -1) {
      category = siteUtils.categories.HOME_AUDIO;
    } else {
      logger.log(`unknown category: ${categoryString} for uri: ${this._uri}`);
      category = siteUtils.categories.OTHER;
    }

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    const selectors = [
      'h1 span[itemprop="name"]',
    ];

    // use the selectors to find the name on the page
    const name = siteUtils.findContentOnPage($, selectors);

    if (!name) {
      logger.error('name not found on crutchfield page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('www.crutchfield.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = Crutchfield;
