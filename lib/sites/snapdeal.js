'use strict';

const _ = require('lodash');
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
    const priceString = $('*[itemprop="price"]').text();

    // were we successful?
    if (!priceString) {
      logger.error('price not found on Snapdeal page, uri: %s', this._uri);
      return -1;
    }

    // process the price string in rupees
    const price = siteUtils.processPrice(`R ${priceString}`);

    return price;
  }

  findCategoryOnPage($) {
    const snapdealCategory = $('#catUrl').attr('value');
    let category = siteUtils.categories.OTHER;
    if (_.includes(snapdealCategory, 'mobile')) {
      category = siteUtils.categories.MOBILE;
    } else if (_.includes(snapdealCategory, 'computers')) {
      category = siteUtils.categories.ELECTRONICS;
    } else if (_.includes(snapdealCategory, 'tv')) {
      category = siteUtils.categories.TELEVISION_VIDEO;
    }

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    const name = $('h1[itemprop="name"]').text();

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
