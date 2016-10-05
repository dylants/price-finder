'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class BestBuySite {
  constructor(uri) {
    // error check to make sure this is a valid uri for Best Buy
    if (!BestBuySite.isSite(uri)) {
      throw new Error('invalid uri for Best Buy: %s', uri);
    }

    this._uri = uri;

    // if the user supplies an API key, use it (instead of scraping)
    if (process.env.BESTBUY_KEY) {
      this._apiKey = process.env.BESTBUY_KEY;
    }
  }

  isJSON() {
    // if we have an API key, then yes, the site returns JSON
    if (this._apiKey) {
      return true;
    } else {
      return false;
    }
  }

  getURIForPageData() {
    if (this._apiKey) {
      // if we have an API key, determine the API from the URI
      const sku = /skuId=(\d+)/.exec(this._uri);
      if (!sku || !sku[1]) {
        logger.error('Could not detect the SKU from the URL');
        return null;
      }

      return `https://api.remix.bestbuy.com/v1/products/${sku[1]}` +
        `.json?show=sku,name,salePrice,categoryPath&apiKey=${this._apiKey}`;
    } else {
      // else it's a normal page scrape, use the original URI
      return this._uri;
    }
  }

  findPriceOnPage($) {
    if (this._apiKey) {
      const pageData = $;
      if (typeof pageData !== 'object' || !pageData.salePrice) {
        return -1;
      }

      /*
       * The salePrice is a USD number (without the dollar sign). This also
       * means there is no need to strip the dollar sign from the price, or
       * process it further in any way. So there is no reason to call
       * siteUtils.processPrice on this salePrice, but instead just return it.
       */
      return pageData.salePrice;
    } else {
      const priceString = $("*[itemprop='price']").attr('content');

      if (!priceString) {
        logger.error('price not found on BestBuy page, uri: %s', this._uri);
        return -1;
      }

      // process the price string as dollars
      const price = siteUtils.processPrice(`$${priceString}`);

      return price;
    }
  }

  findCategoryOnPage($) {
    let category;
    let rawCategory;
    let parentCategory;

    if (this._apiKey) {
      const pageData = $;
      if (typeof pageData !== 'object') {
        return null;
      }

      if (pageData.categoryPath.length < 3) {
        logger.error('category not found on best buy page, uri: %s', this._uri);
        return null;
      }

      rawCategory = pageData.categoryPath[1].name;
      parentCategory = pageData.categoryPath[2].name;
    } else {
      // Use regex to find the category
      const rawCategoryRegex = /track.uberCatName = "([^,;]+)";/ig;
      const rawCategoryResults = rawCategoryRegex.exec($.html());
      if (rawCategoryResults && rawCategoryResults.length > 1) {
        rawCategory = rawCategoryResults[1];
      }

      const parentCategoryRegex = /track.parentCatName = "([^,;]+)";/ig;
      const parentCategoryResults = parentCategoryRegex.exec($.html());
      if (parentCategoryResults && parentCategoryResults.length > 1) {
        parentCategory = parentCategoryResults[1];
      }
    }

    logger.log('rawCategory: %s', rawCategory);
    logger.log('parentCategory: %s', parentCategory);

    if (rawCategory === 'Movies & Music') {
      // need to figure out which one: Movies or Music
      if (parentCategory && parentCategory.indexOf('Movies') > -1) {
        category = siteUtils.categories.MOVIES_TV;
      } else {
        // assume (generic) Music if not Movies
        category = siteUtils.categories.MUSIC;
      }
    } else if (rawCategory === 'Video Games') {
      category = siteUtils.categories.VIDEO_GAMES;
    } else {
      logger.log('category not setup, using "other"');
      category = siteUtils.categories.OTHER;
    }

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($) {
    let name;

    if (this._apiKey) {
      const pageData = $;

      if (typeof pageData !== 'object') {
        return null;
      }

      name = pageData.name;
    } else {
      name = $('#sku-title[itemprop="name"]').text();

      if (!name) {
        logger.error('name not found on BestBuy page, uri: %s', this._uri);
        return null;
      }
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('bestbuy.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = BestBuySite;
