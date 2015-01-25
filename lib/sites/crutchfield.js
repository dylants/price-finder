"use strict";

var siteUtils = require("../site-utils"),
    debug = require("debug")("price-finder:crutchfield");

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
            debug("price was not found on crutchfield page, uri: " + this._uri);
            return -1;
        }
        price = price.trim();

        // get the number value (remove dollar sign)
        price = +(price.slice(1));
        debug("price: " + price);

        return price;
    };

    this.findCategoryOnPage = function($) {
        var category;

        category = $("#breadCrumbNav .crumb:nth-child(2)").text();
        if (!category || category.length < 1) {
            debug("category not found on crutchfield page, uri: " + this._uri);
            return null;
        }

        if (category.indexOf("TVs & Video") > -1) {
            category = siteUtils.categories.TELEVISION_VIDEO;
        } else if (category.indexOf("Home Audio") > -1) {
            category = siteUtils.categories.HOME_AUDIO;
        } else {
            debug("unknown category: '" + category + "' for uri: " + this._uri);
            category = siteUtils.categories.OTHER;
        }

        debug("category: " + category);

        return category;
    };

    this.findNameOnPage = function($, category) {
        var name, citeIndex;

        name = $("h1.productTitleMain").text();
        if (!name || name.length < 1) {
            debug("name not found on crutchfield page, uri: " + this._uri);
            return null;
        }
        name = name.trim();

        debug("name: " + name);

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
