"use strict";

var siteUtils = require("../site-utils"),
    logger = require("../logger")();

function EBagsSite(uri) {

    // error check to make sure this is a valid uri for eBags
    if (!EBagsSite.isSite(uri)) {
        throw new Error("invalid uri for eBags: " + uri);
    }

    this._uri = uri;

    this.getURIForPageData = function() {
        return this._uri;
    };

    this.isJSON = function() {
        return false;
    };

    this.findPriceOnPage = function($) {
        var selectors, price;

        // the various ways we can find the price on an ebags page
        selectors = [
            "#divPricing h2[itemprop='price']"
        ];

        // find the price on the page
        price = siteUtils.findContentOnPage($, selectors);

        // were we successful?
        if (!price) {
            logger.error($("body").text().trim());
            logger.error("price not found on eBags page, uri: " + this._uri);
            return -1;
        }

        // get the number value (remove dollar sign)
        price = +(price.slice(1));
        logger.log("price: " + price);

        return price;
    };

    this.findCategoryOnPage = function($) {
        var category;

        // we're assuming only luggage on ebags.com
        category = siteUtils.categories.LUGGAGE;

        logger.log("category: " + category);

        return category;
    };

    this.findNameOnPage = function($, category) {
        var name, selectors;

        selectors = [
            "#productCon span[itemprop='name']"
        ];

        // use the selectors to find the name on the page
        name = siteUtils.findContentOnPage($, selectors);

        if (!name) {
            logger.error("name not found on eBags page, uri: " + this._uri);
            return null;
        }

        logger.log("name: " + name);

        return name;
    };
}

EBagsSite.isSite = function(uri) {
    if (uri.indexOf("ebags.com") > -1) {
        return true;
    } else {
        return false;
    }
};

module.exports = EBagsSite;
