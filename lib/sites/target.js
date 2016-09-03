'use strict';

const _ = require('lodash');
const logger = require('../logger')();

const API_URI = 'http://redsky.target.com/v1/pdp/tcin/';

class TargetSite {
  constructor(uri) {
    if (!TargetSite.isSite(uri)) {
      throw new Error('invalid uri for Target: %s', uri);
    }

    this._uri = uri;

    // pull the product ID from the URI
    const regex = /.*\/A-(\d+)$/ig;
    const results = regex.exec(this._uri);
    if (results && results.length > 1) {
      this._apiUri = `${API_URI}${results[1]}`;
    } else {
      throw new Error('Unable to find product ID in Target URI: %s', uri);
    }
  }

  getURIForPageData() {
    return this._apiUri;
  }

  isJSON() {
    return true;
  }

  findPriceOnPage(pageData) {
    const price = _.get(pageData, 'product.price.offerPrice.price');

    if (!price) {
      logger.error('price not found on Target page, uri: %s', this._uri);
      return -1;
    }

    return price;
  }

  findCategoryOnPage(pageData) {
    const category = _.get(pageData, 'product.item.product_classification.item_type_name');

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage(pageData) {
    const name = _.get(pageData, 'product.item.product_description.title');

    // were we successful?
    if (!name) {
      logger.error('name not found on Target page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('www.target.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = TargetSite;
