"use strict";

var siteUtils = require("../site-utils"),
    debug = require("debug")("price-finder:google-play");

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
            debug("price was not found on google play page, uri: " + this._uri);
            return -1;
        }

        // get the number value (remove dollar sign)
        price = +(price.slice(1));
        debug("price: " + price);

        return price;
    };

    this.findCategoryOnPage = function($) {
        var category;

        // this doesn't seem to work regularly, so use the regex on the
        // title instead, below
        // category = $(".nav .nav-list-item:first-child .title").text();
        category = / - (.*) on Google Play/.exec($("title").text().trim());
        if (!category || category.length < 1) {
            debug("category not found on google play page, uri: " + this._uri);
            return null;
        }
        category = category[1];

        if (category === "Music") {
            category = siteUtils.categories.DIGITAL_MUSIC;
        } else if (category === "Movies & TV") {
            category = siteUtils.categories.MOVIES_TV;
        } else if (category === "Android Apps") {
            category = siteUtils.categories.MOBILE_APPS;
        } else {
            debug("category not setup, using 'other'");
            category = siteUtils.categories.OTHER;
        }

        debug("category: " + category);

        return category;
    };

    this.findNameOnPage = function($, category) {
        var name;

        name = $(".details-info .document-title").text();
        if (!name || name.length < 1) {
            debug("name not found on google play page, uri: " + this._uri);
            return null;
        }
        name = name.trim();

        debug("name: " + name);

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
