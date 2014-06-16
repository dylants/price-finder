"use strict";

var siteUtils = require("../site-utils"),
    debug = require("debug")("price-finder:sony-entertainment-network-store");

function SonyEntertainmentNetworkStoreSite(uri) {

    // error check to make sure this is a valid uri for Sony
    if (!SonyEntertainmentNetworkStoreSite.isSite(uri)) {
        throw new Error("invalid uri for Sony Entertainment Network Store: " + uri);
    }

    this._uri = uri;

    this.isJSON = function() {
        return true;
    };

    this.getURIForPageData = function() {
        var apiURI = "https://store.sonyentertainmentnetwork.com/store/api/chihiro/00_09_000/container/US/en/999/";
        // add the CID of the URI to the API URI
        apiURI = apiURI + this._uri.slice(this._uri.indexOf("cid=") + "cid=".length);

        return apiURI;
    };

    this.findPriceOnPage = function(pageData) {
        var price;

        // verify the default_sku exists (valid page data)
        if (!pageData || !pageData.default_sku) {
            debug("price was not found on sony entertainment network store page, uri: " + this._uri);
            return -1;
        }

        // try to get the PS Plus price first
        if (pageData.default_sku.rewards && pageData.default_sku.rewards.length > 0) {
            price = pageData.default_sku.rewards[0].display_price;

            // account for free
            if (price === "Free") {
                price = "$0";
            }
        } else {
            // find the default price
            price = pageData.default_sku.display_price;
        }

        if (!price) {
            debug("price was not found on sony entertainment network store page, uri: " + this._uri);
            return -1;
        }

        // get the number value (remove dollar sign)
        price = +(price.slice(1));
        debug("price: " + price);

        return price;
    };

    this.findCategoryOnPage = function(pageData) {
        var category;

        category = pageData.bucket;
        if (!category || category.length < 1) {
            debug("category not found on sony entertainment network store page, uri: " + this._uri);
            return null;
        }

        if (category === "games") {
            category = siteUtils.categories.VIDEO_GAMES;
        } else {
            debug("category not setup, using 'other'");
            category = siteUtils.categories.OTHER;
        }

        debug("category: " + category);

        return category;
    };

    this.findNameOnPage = function(pageData, category) {
        var name;

        name = pageData.name;

        if (!name || name.length < 1) {
            debug("name not found on sony entertainment network store page, uri: " + this._uri);
            return null;
        }

        debug("name: " + name);

        return name;
    };
}

SonyEntertainmentNetworkStoreSite.isSite = function(uri) {
    if (uri.indexOf("store.sonyentertainmentnetwork.com") > -1) {
        return true;
    } else {
        return false;
    }
};

module.exports = SonyEntertainmentNetworkStoreSite;
