"use strict";

var siteUtils = require("../site-utils"),
    debug = require("debug")("price-finder:gamestop");

function GameStopSite(uri) {

    // error check to make sure this is a valid uri for GameStop
    if (!GameStopSite.isSite(uri)) {
        throw new Error("invalid uri for GameStop: " + uri);
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

        price = $(".buy1 h3").text();

        if (!price) {
            debug("price was not found on gamestop page, uri: " + this._uri);
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

        // GameStop only has video games, so hard code it
        category = siteUtils.categories.VIDEO_GAMES;

        debug("category: " + category);

        return category;
    };

    this.findNameOnPage = function($, category) {
        var name, citeIndex;

        name = $(".cartridgeProductHeader h1").html();
        if (!name || name.length < 1) {
            debug("name not found on gamestop page, uri: " + this._uri);
            return null;
        }

        citeIndex = name.indexOf("<cite>");
        if (citeIndex > -1) {
            name = name.slice(0, citeIndex);
        }

        name = name.trim();

        debug("name: " + name);

        return name;
    };
}

GameStopSite.isSite = function(uri) {
    if (uri.indexOf("www.gamestop.com") > -1) {
        return true;
    } else {
        return false;
    }
};

module.exports = GameStopSite;
