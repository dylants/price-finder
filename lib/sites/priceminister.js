"use strict";

var siteUtils = require("../site-utils"),
    logger = require("../logger")();

function PriceMinisterSite(uri) {

    this._inputReg = /(http)[s]*(\:\/\/www.priceminister.com\/mfp)[\/](\d+)[\/](.+)[\#](pid\=)(\d+)(.)*/;
    this._outputReg = /$1$2?cid=$3&urlname=$4&pid=$6&action=advlstmeta/;
    this._uri = uri;

    // error check to make sure this is a valid uri for PriceMinister
    if (this._uri.match(this._inputReg) === null) {
        throw new Error("uri not recognized please use this format : http://www.priceminister.com/mfp/XXXXXX/YYYYYY#pid=ZZZZZZ");
    }

    this.getURIForPageData = function () {
        // transform uri to a parsable one
        this._uri = this._uri.replace(this._inputReg, this._outputReg);
        // remove first slash if any
        if (this._uri.substr(0,1) === '/') {
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

        if(!isNaN(shipping)){
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
        var name = $('.productTitle h1').text();

        if (!name || name.length < 1) {
            logger.error("name not found on PriceMinister page, uri: " + this._uri);
            return null;
        }

        name = siteUtils.cleanStr(name);

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
