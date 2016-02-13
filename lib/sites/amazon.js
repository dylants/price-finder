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
      '#actualPriceValue',
      '#priceblock_ourprice',
      '#priceBlock .priceLarge',
      // Yes this is weird, but for some reason 'rentPrice' is the buy price
      '.buyNewOffers .rentPrice',
      '#buybox .a-color-price',
      '#buybox_feature_div .a-button-primary .a-text-bold',
      '#addToCart .header-price',
      '#priceblock_saleprice',
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
    const amazonCategory = $('#nav-subnav').data('category');
    if (!amazonCategory || amazonCategory.length < 1) {
      logger.error('category not found on amazon page, uri: %s', this._uri);
      return null;
    }

    let category;
    if (amazonCategory === 'dmusic') {
      category = siteUtils.categories.DIGITAL_MUSIC;
    } else if (amazonCategory === 'videogames') {
      category = siteUtils.categories.VIDEO_GAMES;
    } else if (amazonCategory === 'mobile-apps') {
      category = siteUtils.categories.MOBILE_APPS;
    } else if (amazonCategory === 'movies-tv') {
      category = siteUtils.categories.MOVIES_TV;
    } else if (amazonCategory === 'photo') {
      category = siteUtils.categories.CAMERA_VIDEO;
    } else if (amazonCategory === 'toys-and-games') {
      category = siteUtils.categories.TOYS_GAMES;
    } else if (amazonCategory === 'shared-fiona-attributes') {
      category = siteUtils.categories.KINDLE_BOOKS;
    } else if (amazonCategory === 'books') {
      category = siteUtils.categories.BOOKS;
    } else if (amazonCategory === 'hi') {
      category = siteUtils.categories.HOUSEHOLD;
    } else if (amazonCategory === 'hpc') {
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
      name = $('#ArtistLinkSection').text().trim() + ': ' +
        $('#title_feature_div').text().trim();
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
