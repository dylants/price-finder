'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class NewEggSite {
  constructor(uri) {
    // error check to make sure this is a valid uri for Amazon
    if (!NewEggSite.isSite(uri)) {
      throw new Error('invalid uri for NewEgg: %s', uri);
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
    /*
     * It looks like newegg is a bit unique, in that they don't (at this time)
     * return a page that contains the price within the HTML. Perhaps they inject
     * it later, but we're not sure. Because of this unfortunate situation, we
     * must read the price from some javascript loaded on the page. We do this
     * in a most yucky way: regex!
     */
    const regex = /product_sale_price:\['(.*)'\]/ig;
    const results = regex.exec($.html());
    let priceString;
    if (results && results.length > 1) {
      priceString = results[1];
    }

    // were we successful?
    if (!priceString) {
      logger.error('price not found on newgg page, uri: %s', this._uri);
      return -1;
    }

    // if we were successful, the code above assumes USD
    priceString = `$ ${priceString}`;

    // process the price string
    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage($) {
    const neweggCategory = $('#baBreadcrumbTop dl').children().eq(3).text().replace('>', '');
    if (!neweggCategory || neweggCategory.length < 1) {
      logger.error('category not found on newegg page, uri: %s', this._uri);
      return null;
    }

    let category;
    if (neweggCategory === 'TV & Video') {
      category = siteUtils.categories.TELEVISION_VIDEO;
    } else if (neweggCategory.indexOf('Cell Phones') !== -1) {
      category = siteUtils.categories.MOBILE;
    } else {
      logger.log('category not setup, using "other"');
      category = siteUtils.categories.OTHER;
    }

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    let name;
    const selectors = [
      '#grpDescrip_h',
    ];

    // use the selectors to find the name on the page
    name = siteUtils.findContentOnPage($, selectors);

    if (!name) {
      logger.error('name not found on newegg page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    // since
    if (uri.indexOf('www.newegg.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = NewEggSite;
