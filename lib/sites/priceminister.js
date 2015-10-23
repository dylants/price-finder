"use strict";

var siteUtils = require("../site-utils"),
    logger = require("../logger")();

function PriceMinisterSite(uri) {

    this._inputReg;
    this._inputRegDefault = /(http)[s]*(\:\/\/www.priceminister.com\/mfp)[\/](\d+)[\/](.+)[\#](pid\=)(\d+)(.)*/;
    this._inputRegAlt = /(http)[s]*(\:\/\/www.priceminister.com\/offer\/buy)[\/](\d+)[\/](.+)\.html+/;
    this._outputReg = /$1$2?cid=$3&urlname=$4&pid=$6&action=advlstmeta/;
    this._originalUri = uri;
    this._uri = uri;

    // error check to make sure this is a valid uri for PriceMinister
    if (this._uri.match(this._inputRegDefault)) {
        this._inputReg = this._inputRegDefault;
    } else if (this._uri.match(this._inputRegAlt)) {
        this._inputReg = this._inputRegAlt;
    } else {
        throw new Error("uri not recognized please use one of these formats : http://www.priceminister.com/mfp/XXXXXX/YYYYYY#pid=ZZZZZZ or http://www.priceminister.com/offer/buy/XXXXXX.html");
    }

    this.getURIForPageData = function () {

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
    };

    this.isJSON = function () {
        return false;
    };

    this.findPriceOnPage = function ($) {

        var priceContainer = $('#advert_list .priceInfos').first();
        var price = priceContainer.find('.price').text().trim();
        var shipping = priceContainer.find('.shipping .value').text().trim();

        if (!price) {
            logger.error("price was not found on PriceMinister page, uri: " + this._uri);
            return -1;
        }

        // get the number value (remove euro sign)
        price = parseFloat(price.replace(',', '.'));
        shipping = parseFloat(shipping.replace(',', '.'));

        if (!isNaN(shipping)) {
            price += shipping;
        }

        logger.log("price: " + price);

        return price;
    };

    this.findCategoryOnPage = function ($) {
        var category;

        // PriceMinister only has video games, so hard code it
        category = siteUtils.categories.VIDEO_GAMES;

        logger.log("category: " + category);

        return category;
    };

    this.findNameOnPage = function ($, category) {

        // Get name from the url is safer and does not contain too long titles or accents
        var name = '';
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
            logger.error("name not found on PriceMinister page, uri: " + this._uri);
            return null;
        }

        // uppercase first letter
        name = name.charAt(0).toUpperCase() + name.slice(1);

        logger.log("name: " + name);

        return name;
    };
}

PriceMinisterSite.isSite = function (uri) {
    if (uri.indexOf("www.priceminister.com") > -1) {
        return true;
    } else {
        return false;
    }
};

module.exports = PriceMinisterSite;