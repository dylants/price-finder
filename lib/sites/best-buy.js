"use strict";

var siteUtils = require("../site-utils"),
    logger = require("../logger");

function BestBuySite(uri) {

    // error check to make sure this is a valid uri for Best Buy
    if (!BestBuySite.isSite(uri)) {
        throw new Error("invalid uri for Best Buy: " + uri);
    }

    this._uri = uri;

    this.isJSON = function() {
        return false;
    };

    this.getURIForPageData = function() {
        return this._uri;
    };

    this.findPriceOnPage = function($) {
        var price;

        // best buy seems to use the same template for price
        price = $(".item-price").text().trim();

        if (!price) {
            logger.error("price was not found on best buy page, uri: " + this._uri);
            return -1;
        }

        // get the number value (remove dollar sign)
        price = +(price.slice(1));
        logger.log("price: " + price);

        return price;
    };

    this.findCategoryOnPage = function($) {
        // no category support for google play
        return null;
    };

    this.findNameOnPage = function($, category) {
        // no name support for google play
        return null;
    };
}

BestBuySite.isSite = function(uri) {
    if (uri.indexOf("bestbuy.com") > -1) {
        return true;
    } else {
        return false;
    }
};

module.exports = BestBuySite;
