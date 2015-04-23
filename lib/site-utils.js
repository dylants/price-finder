"use strict";

var logger = require("./logger")();

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
    TELEVISION_VIDEO: "Television & Video",
    HOME_AUDIO: "Home Audio",
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

    logger.log("selectors: " + selectors);

    // loop until we find the content, or we exhaust our selectors
    for (i = 0; i < selectors.length; i++) {
        content = $(selectors[i]);
        if (content && content.length > 0) {
            logger.log("found content with selector: " + selectors[i]);
            return content.text().trim();
        }
    }

    // if we've not found anything, return null to signify that
    return null;
};

module.exports.cleanStr = function(str){
    return str.replace(/\W+/g, " ").trim();
}