"use strict";

var siteUtils = require("./site-utils");

function AmazonSite(uri) {

    this.uri = uri;

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
            ".buyNewOffers .rentPrice"
        ];

        // find the price on the page
        price = siteUtils.findContentOnPage($, selectors);

        // were we successful?
        if (!price) {
            console.log($("body").text().trim());
            console.error("price not found on amazon page, uri: " + uri);
            return -1;
        }

        // get the number value (remove dollar sign)
        price = +(price.slice(1));
        console.log("price: " + price);

        return price;
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
