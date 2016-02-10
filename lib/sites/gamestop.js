'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class GameStopSite {
  constructor(uri) {
    // error check to make sure this is a valid uri for GameStop
    if (!GameStopSite.isSite(uri)) {
      throw new Error('invalid uri for GameStop: %s', uri);
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
    const selectors = [
      '.buy1 h3',
    ];

    const priceString = siteUtils.findContentOnPage($, selectors);

    if (!priceString) {
      logger.error('price was not found on gamestop page, uri: %s', this._uri);
      return -1;
    }

    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage() {
    // GameStop only has video games, so hard code it
    const category = siteUtils.categories.VIDEO_GAMES;

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    let name = $('.cartridgeProductHeader h1').html();
    if (!name || name.length < 1) {
      logger.error('name not found on gamestop page, uri: %s', this._uri);
      return null;
    }

    const citeIndex = name.indexOf('<cite>');
    if (citeIndex > -1) {
      name = name.slice(0, citeIndex);
    }

    name = name.trim();

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('www.gamestop.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = GameStopSite;
