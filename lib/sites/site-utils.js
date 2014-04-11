"use strict";

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

module.exports.findContentOnPage = findContentOnPage;
