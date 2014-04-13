"use strict";

var siteUtils = require("../site-utils"),
    logger = require("../logger");

function GooglePlaySite(uri) {

    // error check to make sure this is a valid uri for Google Play
    if (!GooglePlaySite.isSite(uri)) {
        throw new Error("invalid uri for Google Play: " + uri);
    }

    this._uri = uri;

    this.getURIForPageData = function() {
        return this._uri;
    };

    this.isJSON = function() {
        return false;
    };

    this.findPriceOnPage = function($) {
        var price;

        // crazy, but this seems to be the way to get the price of an
        // item on the google play store
        price = $(".details-actions .price").text().replace(/\s+/g, " ").split(" ")[1];

        if (!price) {
            logger.error("price was not found on google play page, uri: " + this._uri);
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

GooglePlaySite.isSite = function(uri) {
    if (uri.indexOf("play.google.com") > -1) {
        return true;
    } else {
        return false;
    }
};

module.exports = GooglePlaySite;
