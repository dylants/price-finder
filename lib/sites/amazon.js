"use strict";

var siteUtils = require("../site-utils"),
    logger = require("../logger")();

function AmazonSite(uri) {

    // error check to make sure this is a valid uri for Amazon
    if (!AmazonSite.isSite(uri)) {
        throw new Error("invalid uri for Amazon: " + uri);
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

        // the various ways we can find the price on an amazon page
        selectors = [
            "#actualPriceValue",
            "#priceblock_ourprice",
            "#priceBlock .priceLarge",
            // Yes this is weird, but for some reason "rentPrice"
            // is the buy price
            ".buyNewOffers .rentPrice",
            "#buybox .a-color-price",
            "#buybox_feature_div .a-button-primary .a-text-bold",
            "#newOfferAccordionRow .header-price"
        ];

        // find the price on the page
        price = siteUtils.findContentOnPage($, selectors);

        // were we successful?
        if (!price) {
            logger.error($("body").text().trim());
            logger.error("price not found on amazon page, uri: " + this._uri);
            return -1;
        }

        // get the number value (remove dollar sign)
        price = +(price.slice(1));
        logger.log("price: " + price);

        return price;
    };

    this.findCategoryOnPage = function($) {
        var category;

        category = $("#nav-subnav").data("category");
        if (!category || category.length < 1) {
            logger.error("category not found on amazon page, uri: " + this._uri);
            return null;
        }

        if (category === "dmusic") {
            category = siteUtils.categories.DIGITAL_MUSIC;
        } else if (category === "videogames") {
            category = siteUtils.categories.VIDEO_GAMES;
        } else if (category === "mobile-apps") {
            category = siteUtils.categories.MOBILE_APPS;
        } else if (category === "movies-tv") {
            category = siteUtils.categories.MOVIES_TV;
        } else if (category === "photo") {
            category = siteUtils.categories.CAMERA_VIDEO;
        } else if (category === "toys-and-games") {
            category = siteUtils.categories.TOYS_GAMES;
        } else if (category === "shared-fiona-attributes") {
            category = siteUtils.categories.KINDLE_BOOKS;
        } else if (category === "books") {
            category = siteUtils.categories.BOOKS;
        } else if (category === "hi") {
            category = siteUtils.categories.HOUSEHOLD;
        } else if (category === "hpc") {
            category = siteUtils.categories.HEALTH_PERSONAL_CARE;
        } else {
            logger.log("category not setup, using 'other'");
            category = siteUtils.categories.OTHER;
        }

        logger.log("category: " + category);

        return category;
    };

    this.findNameOnPage = function($, category) {
        var name, selectors;

        if (category === siteUtils.categories.DIGITAL_MUSIC) {
            name = $("#ArtistLinkSection").text().trim() + ": " +
                $("#title_feature_div").text().trim();
        } else {
            selectors = [
                "#btAsinTitle",
                "#productTitle",
                "#title"
            ];

            // use the selectors to find the name on the page
            name = siteUtils.findContentOnPage($, selectors);
        }

        if (!name) {
            logger.error("name not found on amazon page, uri: " + this._uri);
            return null;
        }

        logger.log("name: " + name);

        return name;
    };
}

AmazonSite.isSite = function(uri) {
    if (uri.indexOf("amazon.com") > -1) {
        return true;
    } else {
        return false;
    }
};

module.exports = AmazonSite;
