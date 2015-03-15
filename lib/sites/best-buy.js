"use strict";

var siteUtils = require("../site-utils"),
    logger = require("../logger")();

function BestBuySite(uri) {

    // error check to make sure this is a valid uri for Best Buy
    if (!BestBuySite.isSite(uri)) {
        throw new Error("invalid uri for Best Buy: " + uri);
    }

    this._uri = uri;

    this.isJSON = function() {
        return false;
    };

    this.getURIForPageData = function() {
        return this._uri;
    };

    this.findPriceOnPage = function($) {
        var price;

        // best buy seems to use the same template for price
        price = $(".item-price").text().trim();

        if (!price) {
            logger.error("price was not found on best buy page, uri: " + this._uri);
            return -1;
        }

        // get the number value (remove dollar sign)
        price = +(price.slice(1));
        logger.log("price: " + price);

        return price;
    };

    this.findCategoryOnPage = function($) {
        var category, parentCategory;

        /*
         * Using jQuery .data("") to grab the uber-cat-name and
         * parent-cat-name doesn't seem to work reliably in the tests.
         * So just use straight attr to grab those data attributes.
         */

        category = $("#analytics-data").attr("data-uber-cat-name");
        if (!category || category.length < 1) {
            logger.error("category not found on best buy page, uri: " + this._uri);
            return null;
        }

        logger.log("raw category found: " + category);

        if (category === "Movies & Music") {
            // need to figure out which one: Movies or Music
            parentCategory = $("#analytics-data").attr("data-parent-cat-name");
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

    this.findNameOnPage = function($, category) {
        var name;

        name = $("#sku-title").text();
        if (!name || name.length < 1) {
            logger.error("name not found on best buy page, uri: " + this._uri);
            return null;
        }
        name = name.trim();

        logger.log("name: " + name);

        return name;
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
