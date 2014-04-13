"use strict";

// Represents the various categories of an online item
var categories = {
    DIGITAL_MUSIC: "Digital Music",
    VIDEO_GAMES: "Video Games",
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
function findContentOnPage($, selectors) {
    var i, content;

    // loop until we find the content, or we exhaust our selectors
    for (i = 0; i < selectors.length; i++) {
        content = $(selectors[i]);
        if (content && content.length > 0) {
            return content.text().trim();
        }
    }

    // if we've not found anything, return null to signify that
    return null;
}

module.exports.categories = categories;
module.exports.findContentOnPage = findContentOnPage;
