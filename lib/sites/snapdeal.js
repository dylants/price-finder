'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class SnapdealSite {
  constructor(uri) {
    if (!SnapdealSite.isSite(uri)) {
      throw new Error('invalid uri for Snapdeal: %s', uri);
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
    // find the price on the page
    const priceString = $('*.payBlkBig').text();

    // were we successful?
    if (!priceString) {
      logger.error('price not found on Snapdeal page, uri: %s', this._uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(`R ${priceString}`);

    return price;
  }

  findCategoryOnPage($) {
    const snapdealCategory = $('.bCrumbOmniTrack').slice(1).eq(0).text();
    let category = siteUtils.categories.OTHER;
    if (snapdealCategory.indexOf('Mobiles') !== -1) {
      category = siteUtils.categories.MOBILE;
    } else if (snapdealCategory.indexOf('Computers') !== -1) {
      category = siteUtils.categories.ELECTRONICS;
    } else if (snapdealCategory.indexOf('TVs, Audio & Video') !== -1) {
      category = siteUtils.categories.TELEVISION_VIDEO;
    }

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    // use the selectors to find the name on the page
    const name = $('*[itemprop="name"]').slice(1).eq(0).text();

    // were we successful?
    if (!name) {
      logger.error('name not found on Snapdeal page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('snapdeal.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = SnapdealSite;
