"use strict";

var siteUtils = require("../site-utils"),
    logger = require("../logger")();

function BestBuySite(uri, config) {
    // error check to make sure this is a valid uri for Best Buy
    if (!BestBuySite.isSite(uri)) {
        throw new Error("invalid uri for Best Buy: " + uri);
    }

    this._uri = uri;

    this.isJSON = function() {
        return true;
    };

    this.getURIForPageData = function() {
        var api_key = process.env.BESTBUY_KEY;
        if (config.keys && config.keys.bestbuy) {
            api_key = config.keys.bestbuy;
        }
        if (!api_key) {
            logger.error("Best Buy cannot be called unless an API key is provided");
            return null;
        }
        var sku = /skuId=(\d+)/.exec(this._uri);
        if (!sku || !sku[1]) {
            logger.error("Could not detect the SKU from the URL");
            return null;
        }
        return "https://api.remix.bestbuy.com/v1/products/" + sku[1] + ".json?show=sku,name,salePrice,categoryPath&apiKey=" + api_key;
    };

    this.findPriceOnPage = function(pageData) {
        if (typeof pageData !== 'object' || !pageData.salePrice) {
            return -1;
        }
        return pageData.salePrice;
    };

    this.findCategoryOnPage = function(pageData) {
        if (typeof pageData !== 'object') {
            return null;
        }
        var category, parentCategory;

        if (pageData.categoryPath.length < 2) {
            logger.error("category not found on best buy page, uri: " + this._uri);
            return null;
        }
        category = pageData.categoryPath[1].name;

        logger.log("raw category found: " + category);

        if (category === "Movies & Music") {
            // need to figure out which one: Movies or Music
            parentCategory = pageData.categoryPath[2].name;

            logger.log("raw parentCategory: " + parentCategory);

            if (parentCategory.indexOf("Movies") > -1) {
                category = siteUtils.categories.MOVIES_TV;
            } else {
                // assume (generic) Music if not Movies
                category = siteUtils.categories.MUSIC;
            }
        } else if (category === "Video Games") {
            category = siteUtils.categories.VIDEO_GAMES;
        } else {
            logger.log("category not setup, using 'other'");
            category = siteUtils.categories.OTHER;
        }

        logger.log("category: " + category);

        return category;
    };

    this.findNameOnPage = function(pageData, category) {
        if (typeof pageData !== 'object') {
            return null;
        }
        return pageData.name;
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
