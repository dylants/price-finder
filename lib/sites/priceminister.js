"use strict";

var siteUtils = require("../site-utils"),
    logger = require("../logger")();

function PriceMinisterSite(uri) {

    // error check to make sure this is a valid uri for PriceMinister
    if (!PriceMinisterSite.isSite(uri)) {
        throw new Error("invalid uri for PriceMinister: " + uri);
    }

    this._uri = uri;

    this.getURIForPageData = function () {
        var inputReg = /[\/](mfp)[\/](\d+)[\/](.+)[\#](pid\=)(\d+)/g;
        var outputReg = /$1?cid=$2&urlname=$3&pid=$5&action=advlstmeta/;
        this._uri = this._uri.replace(inputReg, outputReg);
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
