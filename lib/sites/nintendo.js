"use strict";

var _ = require("lodash"),
    siteUtils = require("../site-utils"),
    logger = require("../logger")();

function NintendoSite(uri) {

    // error check to make sure this is a valid uri for Nintendo
    if (!NintendoSite.isSite(uri)) {
        throw new Error("invalid uri for Nintendo: " + uri);
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

        price = $("*[itemprop='price']").text();

        if (!price) {
            logger.error("price was not found on nintendo page, uri: " + this._uri);
            return -1;
        }
        price = price.trim();

        // process the price string
        price = siteUtils.processPrice(price);

        return price;
    };

    this.findCategoryOnPage = function($) {
        var category;

        // Nintendo only has video games, so hard code it
        category = siteUtils.categories.VIDEO_GAMES;

        logger.log("category: " + category);

        return category;
    };

    this.findNameOnPage = function($, category) {
        var name;

        name = $("h1[itemprop='name']").text();

        if (!name) {
            logger.error("name not found on nintendo page, uri: " + this._uri);
            return null;
        }

        logger.log("name: " + name);

        return name;
    };
}

NintendoSite.isSite = function(uri) {
    if (_.contains(uri, "www.nintendo.com")) {
        return true;
    } else {
        return false;
    }
};

module.exports = NintendoSite;
