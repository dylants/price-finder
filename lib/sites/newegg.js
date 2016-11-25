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
     * It looks like newegg is a bit unique, in that they don't (sometimes)
     * return a page that contains the price within the HTML. At this time they
     * sometimes return a page with an itemprop for price (yay!), and sometimes
     * return a page without the itemprop, and we have to dig much deeper (yuck!).
     * Because of this unfortunate situation, we must read the price from some
     * javascript loaded on the page. We do this in a most yucky way: regex!
     */
    let priceString;
    priceString = $("*[itemprop='price']").attr('content');
    if (!priceString) {
      // try the regex path!
      const regex = /product_sale_price:\['(.*)'\]/ig; // eslint-disable-line no-useless-escape
      const results = regex.exec($.html());
      if (results && results.length > 1) {
        priceString = results[1];
      }
    }

    if (!priceString) {
      logger.error('price was not found on newegg page, uri: %s', this._uri);
      return -1;
    }

    // process the price string as dollars
    const price = siteUtils.processPrice(`$${priceString}`);

    return price;
  }

  findCategoryOnPage($) {
    const neweggCategory = $('#baBreadcrumbTop dl')
      .children()
      .eq(3)
      .text()
      .replace('>', '');
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
    const selectors = [
      '#grpDescrip_h',
    ];

    // use the selectors to find the name on the page
    const name = siteUtils.findContentOnPage($, selectors);

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
