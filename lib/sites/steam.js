'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class SteamSite {
  constructor(uri) {
    if (!SteamSite.isSite(uri)) {
      throw new Error('invalid uri for Steam: %s', uri);
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
    const priceString = $("*[itemprop='price']").attr('content');

    // were we successful?
    if (!priceString) {
      logger.error('price not found on Steam page, uri: %s', this._uri);
      return -1;
    }

    // process the price string as dollars
    const price = siteUtils.processPrice(`$${priceString}`);

    return price;
  }

  findCategoryOnPage() {
    // only video games on steam
    const category = siteUtils.categories.VIDEO_GAMES;

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    // the various ways we can find the name
    const selectors = [
      '.apphub_AppName',
      '.page_title_area .pageheader',
    ];

    // use the selectors to find the name on the page
    const name = siteUtils.findContentOnPage($, selectors);

    // were we successful?
    if (!name) {
      logger.error('name not found on Steam page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('store.steampowered.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = SteamSite;
