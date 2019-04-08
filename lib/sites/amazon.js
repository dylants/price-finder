'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class AmazonSite {
  constructor(uri) {
    // error check to make sure this is a valid uri for Amazon
    if (!AmazonSite.isSite(uri)) {
      throw new Error('invalid uri for Amazon: %s', uri);
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
    // the various ways we can find the price on an amazon page
    const selectors = [
      // used in amazon fashion, home audio and video, and when sale price not in buy box
      '#priceblock_saleprice',

      // these specific selectors were added to support new pages, that did NOT contain
      // a decimal point in the price... so we're just grabbing the dollar amount (not cents)
      // https://github.com/dylants/price-finder/issues/97
      // used in (at least) video games
      '#price #newPrice .buyingPrice',
      '#price #newPitchPrice .price-large',

      // used in (at least) mobile apps
      '#actualPriceValue',

      // used in electronics, subscription items (without subscription)
      '#priceblock_ourprice',

      // used in CDs, DVDs, tools and home improvement, household items
      '#buybox .a-color-price',

      // used in (at least) digital music
      '#buybox_feature_div .a-button-primary .a-text-bold',

      // used in (at least) books
      '.a-color-price.header-price',

      // used when amazon is NOT showing their price, to instead look at other seller's price
      '#moreBuyingChoices_feature_div .a-color-price',

      // used in (at least) video games, when new price is NOT available
      '#price #usedPrice .buyingPrice',
      '#price #usedPitchPrice .price-large',
    ];

    // find the price on the page
    const priceString = siteUtils.findContentOnPage($, selectors);

    // were we successful?
    if (!priceString) {
      logger.error($('body').text().trim());
      logger.error('price not found on amazon page, uri: %s', this._uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage($) {
    // first check for #nav-subnav
    let amazonCategory = $('#nav-subnav').data('category');

    if (!amazonCategory || amazonCategory.length < 1) {
      // other ways we can find the category on an amazon page
      const selectors = [
        // this specific selector is added to support pages, that did NOT contain
        // data-category attribute in #nav-subnav selector, e.g.
        // https://www.amazon.com/SHUX-DualShock-Wireless-Controller-Playstation/dp/B07KW67PFX
        // used in (at-least) Video Games
        '#wayfinding-breadcrumbs_container ul li span a',
      ];

      // find the category on the page
      amazonCategory = siteUtils.findContentOnPage($, selectors);

      // were we successful?
      if (!amazonCategory || amazonCategory.length < 1 || amazonCategory === 'Back to results') {
        logger.error('category not found on amazon page, uri: %s', this._uri);
        return null;
      }
    }

    let category;
    if (amazonCategory === 'dmusic' || amazonCategory === 'Digital Music') {
      category = siteUtils.categories.DIGITAL_MUSIC;
    } else if (amazonCategory === 'videogames' || amazonCategory === 'Video Games') {
      category = siteUtils.categories.VIDEO_GAMES;
    } else if (amazonCategory === 'mobile-apps' || amazonCategory === 'Mobile Apps') {
      category = siteUtils.categories.MOBILE_APPS;
    } else if (amazonCategory === 'movies-tv' || amazonCategory === 'Movies & TV') {
      category = siteUtils.categories.MOVIES_TV;
    } else if (amazonCategory === 'photo' || amazonCategory === 'Camera & Video') {
      category = siteUtils.categories.CAMERA_VIDEO;
    } else if (amazonCategory === 'toys-and-games' || amazonCategory === 'Toys & Games') {
      category = siteUtils.categories.TOYS_GAMES;
    } else if (amazonCategory === 'shared-fiona-attributes' || amazonCategory === 'Kindle Books') {
      category = siteUtils.categories.KINDLE_BOOKS;
    } else if (amazonCategory === 'books' || amazonCategory === 'Books') {
      category = siteUtils.categories.BOOKS;
    } else if (amazonCategory === 'hi' || amazonCategory === 'Household') {
      category = siteUtils.categories.HOUSEHOLD;
    } else if (amazonCategory === 'hpc' || amazonCategory === 'Health & Personal Care') {
      category = siteUtils.categories.HEALTH_PERSONAL_CARE;
    } else {
      logger.log('category not setup, using "other"');
      category = siteUtils.categories.OTHER;
    }

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($, category) {
    let name;
    if (category === siteUtils.categories.DIGITAL_MUSIC) {
      /* eslint-disable prefer-template */
      name = $('#ArtistLinkSection').text().trim() + ': '
        + $('#dmusicProductTitle_feature_div').text().trim();
      /* eslint-enable prefer-template */
    } else {
      const selectors = [
        '#btAsinTitle',
        '#productTitle',
        '#title',
      ];

      // use the selectors to find the name on the page
      name = siteUtils.findContentOnPage($, selectors);
    }

    if (!name) {
      logger.error('name not found on amazon page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    // (attempt) to support more countries than just amazon.com
    // we'll see how many we can actually support...
    if (uri.indexOf('www.amazon.') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = AmazonSite;
