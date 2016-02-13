'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class PriceMinisterSite {
  constructor(uri) {
    this._inputReg = null;
    /* eslint-disable max-len */
    this._inputRegDefault = /(http)[s]*(\:\/\/www.priceminister.com\/mfp)[\/](\d+)[\/](.+)[\#](pid\=)(\d+)(.)*/;
    this._inputRegAlt = /(http)[s]*(\:\/\/www.priceminister.com\/offer\/buy)[\/](\d+)[\/](.+)\.html+/;
    /* eslint-enable max-len */
    this._outputReg = /$1$2?cid=$3&urlname=$4&pid=$6&action=advlstmeta/;
    this._originalUri = uri;
    this._uri = uri;

    // error check to make sure this is a valid uri for PriceMinister
    if (this._uri.match(this._inputRegDefault)) {
      this._inputReg = this._inputRegDefault;
    } else if (this._uri.match(this._inputRegAlt)) {
      this._inputReg = this._inputRegAlt;
    } else {
      throw new Error('uri not recognized please use one of these formats : http://www.priceminister.com/mfp/XXXXXX/YYYYYY#pid=ZZZZZZ or http://www.priceminister.com/offer/buy/XXXXXX.html');
    }
  }

  getURIForPageData() {
    if (this._inputReg === this._inputRegDefault) {
      // transform uri to a parsable one
      this._uri = this._uri.replace(this._inputReg, this._outputReg);
    }

    // remove first slash if any
    if (this._uri.substr(0, 1) === '/') {
      this._uri = this._uri.substr(1);
    }

    // remove last slash if any
    if (this._uri.substr(-1) === '/') {
      this._uri = this._uri.substr(0, this._uri.length - 1);
    }

    return this._uri;
  }

  isJSON() {
    return false;
  }

  findPriceOnPage($) {
    const priceContainer = $('#advert_list .priceInfos').first();
    let price = priceContainer.find('.price').text().trim();
    let shipping = priceContainer.find('.shipping .value').text().trim();

    if (!price) {
      logger.error('price was not found on PriceMinister page, uri: %s', this._uri);
      return -1;
    }

    // get the number value (remove euro sign)
    price = parseFloat(price.replace(',', '.'));
    shipping = parseFloat(shipping.replace(',', '.'));

    if (!isNaN(shipping)) {
      price += shipping;
    }

    logger.log('price: %s', price);

    return price;
  }

  findCategoryOnPage() {
    // PriceMinister only has video games, so hard code it
    const category = siteUtils.categories.VIDEO_GAMES;

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage() {
    // Get name from the url is safer and does not contain too long titles or accents
    let name = '';
    if (this._originalUri.match(this._inputReg)) {
      name = this._originalUri.match(this._inputReg)[4].replace(/\-/g, ' ');
    }

    // remove first slash if any
    if (name.substr(0, 1) === '/') {
      name = name.substr(1);
    }

    // remove last slash if any
    if (name.substr(-1) === '/') {
      name = name.substr(0, name.length - 1);
    }

    if (!name || name.length < 1) {
      logger.error('name not found on PriceMinister page, uri: %s', this._uri);
      return null;
    }

    // uppercase first letter
    name = name.charAt(0).toUpperCase() + name.slice(1);

    logger.log('name: %s', name);

    return name;
  }

  static isSite(uri) {
    if (uri.indexOf('www.priceminister.com') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = PriceMinisterSite;
