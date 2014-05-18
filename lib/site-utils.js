"use strict";

var debug = require("debug")("price-finder:site-utils");

// Represents the various categories of an online item
module.exports.categories = {
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
    OTHER: "Other"
};

/**
 * Finds content on a page, returning either the text or null.
 *
 * @param  {Object} $         jQuery-like object
 * @param  {Array} selectors  An array of selectors to search with
 * @return {String}           The content found (or null)
 */
module.exports.findContentOnPage = function($, selectors) {
    var i, content;

    debug("selectors: " + selectors);

    // loop until we find the content, or we exhaust our selectors
    for (i = 0; i < selectors.length; i++) {
        content = $(selectors[i]);
        if (content && content.length > 0) {
            debug("found content with selector: " + selectors[i]);
            return content.text().trim();
        }
    }

    // if we've not found anything, return null to signify that
    return null;
};
