"use strict";

var _ = require("lodash"),
    accounting = require("accounting"),
    logger = require("./logger")();

// Represents the various categories of an online item
exports.categories = Object.freeze({
    DIGITAL_MUSIC: "Digital Music",
    MUSIC: "Music",
    VIDEO_GAMES: "Video Games",
    MOBILE_APPS: "Mobile Apps",
    MOVIES_TV: "Movies & TV",
    CAMERA_VIDEO: "Camera & Video",
    TOYS_GAMES: "Toys & Games",
    BOOKS: "Books",
    KINDLE_BOOKS: "Kindle Books",
    HOUSEHOLD: "Household",
    HEALTH_PERSONAL_CARE: "Health & Personal Care",
    TELEVISION_VIDEO: "Television & Video",
    HOME_AUDIO: "Home Audio",
    LUGGAGE: "Luggage",
    OTHER: "Other"
});

/**
 * Finds content on a page, returning either the text or null.
 *
 * @param  {Object} $         jQuery-like object
 * @param  {Array} selectors  An array of selectors to search with
 * @return {String}           The content found (or null)
 */
exports.findContentOnPage = function($, selectors) {
    var i, content;

    logger.log("selectors: " + selectors);

    // loop until we find the content, or we exhaust our selectors
    for (i = 0; i < selectors.length; i++) {
        content = $(selectors[i]);
        if (!_.isEmpty(content)) {
            logger.log("found content with selector: " + selectors[i]);
            return content.text().trim();
        }
    }

    // if we've not found anything, return null to signify that
    return null;
};

var DOLLAR_PREFIX = "$";
var EURO_TEXT_PREFIX = "eur";
var EURO_SYMBOL_PREFIX = "€";
var YEN_TEXT_PREFIX = "円";
var YEN_SYMBOL_PREFIX = "￥";
var GBP_SYMBOL_PREFIX = "£";

exports.processPrice = function(priceString) {
    var price;

    priceString = priceString.toLowerCase();

    logger.log("price string (lowercased): " + priceString);

    // currency specific processing
    if (_.includes(priceString, DOLLAR_PREFIX)) {
        logger.log("found dollar in price, converting to number...");
        price = accounting.unformat(priceString);
    } else if (_.includes(priceString, EURO_TEXT_PREFIX) ||
        _.includes(priceString, EURO_SYMBOL_PREFIX)) {
        logger.log("found euro in price, converting to number...");
        price = accounting.unformat(priceString, ",");
    } else if (_.includes(priceString, YEN_TEXT_PREFIX) ||
        _.includes(priceString, YEN_SYMBOL_PREFIX)) {
        logger.log("found yen in price, converting to number...");
        price = accounting.unformat(priceString);
    } else if (_.includes(priceString, GBP_SYMBOL_PREFIX) ||
        _.includes(priceString, GBP_SYMBOL_PREFIX)) {
        logger.log("found gbp in price, converting to number...");
        price = accounting.unformat(priceString);
    } else {
        // unknown price type!!
        logger.error("unknown price type, unable to process, returning -1");
        price = -1;
    }

    logger.log("price (post-process): " + price);
    return price;
};
