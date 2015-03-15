"use strict";

var siteUtils = require("../site-utils"),
    logger = require("../logger")();

function Crutchfield(uri) {

    // error check to make sure this is a valid uri for Crutchfield
    if (!Crutchfield.isSite(uri)) {
        throw new Error("invalid uri for Crutchfield: " + uri);
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

        price = $(".finalPrice").text();

        if (!price) {
            logger.error("price was not found on crutchfield page, uri: " + this._uri);
            return -1;
        }
        price = price.trim();

        // get the number value (remove dollar sign)
        price = +(price.slice(1));
        logger.log("price: " + price);

        return price;
    };

    this.findCategoryOnPage = function($) {
        var category;

        category = $("#breadCrumbNav .crumb:nth-child(2)").text();
        if (!category || category.length < 1) {
            logger.error("category not found on crutchfield page, uri: " + this._uri);
            return null;
        }

        if (category.indexOf("TVs & Video") > -1) {
            category = siteUtils.categories.TELEVISION_VIDEO;
        } else if (category.indexOf("Home Audio") > -1) {
            category = siteUtils.categories.HOME_AUDIO;
        } else {
            logger.log("unknown category: '" + category + "' for uri: " + this._uri);
            category = siteUtils.categories.OTHER;
        }

        logger.log("category: " + category);

        return category;
    };

    this.findNameOnPage = function($, category) {
        var name, citeIndex;

        name = $("h1.productTitleMain").text();
        if (!name || name.length < 1) {
            logger.error("name not found on crutchfield page, uri: " + this._uri);
            return null;
        }
        name = name.trim();

        logger.log("name: " + name);

        return name;
    };
}

Crutchfield.isSite = function(uri) {
    if (uri.indexOf("www.crutchfield.com") > -1) {
        return true;
    } else {
        return false;
    }
};

module.exports = Crutchfield;
