"use strict";

var categories = {};
categories.DIGITAL_MUSIC = "Digital Music";
categories.VIDEO_GAMES = "Video Games";
categories.MOVIES_TV = "Movies & TV";
categories.CAMERA_VIDEO = "Camera & Video";
categories.TOYS_GAMES = "Toys & Games";
categories.BOOKS = "Books";
categories.KINDLE_BOOKS = "Kindle Books";
categories.HOUSEHOLD = "Household";
categories.HEALTH_PERSONAL_CARE = "Health & Personal Care";
categories.OTHER = "Other";


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
