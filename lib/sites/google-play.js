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
        var category;

        category = $(".nav .nav-list-item:first-child .title").text();
        if (!category || category.length < 1) {
            logger.error("category not found on google play page, uri: " + this._uri);
            return null;
        }
        category = category.trim();

        if (category === "Music") {
            category = siteUtils.categories.DIGITAL_MUSIC;
        } else if (category === "Movies & TV") {
            category = siteUtils.categories.MOVIES_TV;
        } else if (category === "Apps") {
            category = siteUtils.categories.MOBILE_APPS;
        } else {
            logger.log("category not setup, using 'other'");
            category = siteUtils.categories.OTHER;
        }

        logger.log("category: " + category);

        return category;
    };

    this.findNameOnPage = function($, category) {
        var name;

        name = $(".details-info .document-title").text();
        if (!name || name.length < 1) {
            logger.error("name not found on google play page, uri: " + this._uri);
            return null;
        }
        name = name.trim();

        logger.log("name: " + name);

        return name;
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
