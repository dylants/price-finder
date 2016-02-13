'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class BestBuySite {
  constructor(uri, config) {
    // error check to make sure this is a valid uri for Best Buy
    if (!BestBuySite.isSite(uri)) {
      throw new Error('invalid uri for Best Buy: %s', uri);
    }

    this._uri = uri;

    // attempt to find the API key
    if (config.keys && config.keys.bestbuy) {
      this.api_key = config.keys.bestbuy;
    }

    // allow the environment variable to override the config
    if (!!process.env.BESTBUY_KEY) {
      this.api_key = process.env.BESTBUY_KEY;
    }

    // if we still don't have an API key, abort!
    if (!this.api_key) {
      const errorMessage = 'Best Buy cannot be called unless an API key is provided';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

    isJSON() {
      return true;
    }

    getURIForPageData() {
      const sku = /skuId=(\d+)/.exec(this._uri);
      if (!sku || !sku[1]) {
        logger.error('Could not detect the SKU from the URL');
        return null;
      }

      /* eslint-disable prefer-template */
      return 'https://api.remix.bestbuy.com/v1/products/' +
        sku[1] +
        '.json?show=sku,name,salePrice,categoryPath&apiKey=' +
        this.api_key;
      /* eslint-enable prefer-template */
    }

    findPriceOnPage(pageData) {
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
    }

    findCategoryOnPage(pageData) {
      if (typeof pageData !== 'object') {
        return null;
      }

      if (pageData.categoryPath.length < 2) {
        logger.error('category not found on best buy page, uri: %s', this._uri);
        return null;
      }

      const rawCategory = pageData.categoryPath[1].name;

      logger.log('raw category found: %s', rawCategory);

      let category;
      if (rawCategory === 'Movies & Music') {
        // need to figure out which one: Movies or Music
        const parentCategory = pageData.categoryPath[2].name;

        logger.log('raw parentCategory: %s', parentCategory);

        if (parentCategory.indexOf('Movies') > -1) {
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

    findNameOnPage(pageData) {
      if (typeof pageData !== 'object') {
        return null;
      }

      return pageData.name;
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
