'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class GooglePlaySite {
  constructor(uri) {
    if (!GooglePlaySite.isSite(uri)) {
      throw new Error('invalid uri for Google Play: %s', uri);
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
      logger.error('price was not found on google play page, uri: %s', this._uri);
      return -1;
    }

    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage($) {
    // this doesn't seem to work regularly, so use the regex on the
    // title instead, below
    // category = $('.nav .nav-list-item:first-child .title').text();
    let category = / - (.*) on Google Play/.exec($('title').text().trim());
    if (!category || category.length < 1) {
      logger.error('category not found on google play page, uri: %s', this._uri);
      return null;
    }

    category = category[1];

    if (category === 'Music') {
      category = siteUtils.categories.DIGITAL_MUSIC;
    } else if (category === 'Movies & TV') {
      category = siteUtils.categories.MOVIES_TV;
    } else if (category === 'Android Apps') {
      category = siteUtils.categories.MOBILE_APPS;
    } else {
      logger.log('category not setup, using "other"');
      category = siteUtils.categories.OTHER;
    }

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    let name = $('h1[itemprop="name"]').text();
    if (!name || name.length < 1) {
      logger.error('name not found on google play page, uri: %s', this._uri);
      return null;
    }

    name = name.trim();

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('play.google.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = GooglePlaySite;
