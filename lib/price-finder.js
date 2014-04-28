"use strict";

var async = require("async"),
    request = require("request"),
    cheerio = require("cheerio"),
    extend = require("xtend"),
    siteManager = require("./site-manager"),
    logger = require("./logger");

function PriceFinder(options) {
    var defaultOptions;

    defaultOptions = {
        debug: false
    };

    // merge options, taking the user supplied if duplicates exist
    options = extend(defaultOptions, options);

    // enable debug logging if specified
    if (options.debug) {
        logger.DEBUG = true;
    }

    /**
     * Scrapes a website specified by the uri and finds the item price.
     *
     * @param  {String}   uri      The uri of the website to scan
     * @param  {Function} callback Callback called when complete, with first argument
     *                             a possible error object, and second argument the
     *                             item price (a Number).
     */
    this.findItemPrice = function(uri, callback) {
        var site;

        try {
            site = siteManager.loadSite(uri);
        } catch (error) {
            if (error.message) {
                callback(error.message);
            } else {
                callback(error);
            }
            return;
        }

        // page scrape the site to load the page data
        pageScrape(site, function(err, pageData) {
            var price;

            if (err) {
                callback(err);
                return;
            }

            // find the price on the website
            price = site.findPriceOnPage(pageData);

            // error check
            if (price === -1) {
                callback("unable to find price for uri: " + uri);
                return;
            }

            // call the callback with the item price (null error)
            callback(null, price);
        });
    };

    /**
     * Scrapes a website specified by the uri and gathers the item details, which
     * consists of the item's name, category, and current price found on the page.
     *
     * @param  {String}   uri      The uri of the website to scan
     * @param  {Function} callback Callback called when complete, with first argument
     *                             a possible error object, and second argument the
     *                             item details. The item details consists of a name,
     *                             category, and price.
     */
    this.findItemDetails = function(uri, callback) {
        var site;

        try {
            site = siteManager.loadSite(uri);
        } catch (error) {
            if (error.message) {
                callback(error.message);
            } else {
                callback(error);
            }
            return;
        }

        // page scrape the site to find the item details
        pageScrape(site, function(err, pageData) {
            var itemDetails;

            if (err) {
                callback(err);
                return;
            }

            itemDetails = {};

            // find the price on the website
            itemDetails.price = site.findPriceOnPage(pageData);

            // error check
            if (itemDetails.price === -1) {
                callback("unable to find price for uri: " + uri);
                return;
            }

            // find the category on the page
            itemDetails.category = site.findCategoryOnPage(pageData);

            // find the name on the page (if we have the category)
            if (itemDetails.category) {
                itemDetails.name = site.findNameOnPage(pageData, itemDetails.category);
            }

            // call the callback with our item details (null error)
            callback(null, itemDetails);
        });
    };

    function pageScrape(site, callback) {
        var pageData;

        async.whilst(
            function() {
                // run this until we get page data
                return !pageData;
            },
            function(whilstCallback) {
                // hit the site to get the item details
                request({
                    uri: site.getURIForPageData(),
                    headers: {
                        "User-Agent": "Mozilla/5.0"
                    }
                }, function(err, response, body) {
                    if (err) {
                        whilstCallback(err);
                        return;
                    }
                    if (response) {
                        if (response.statusCode === 200) {
                            // good response
                            if (site.isJSON()) {
                                // parse the body to grab the JSON
                                pageData = JSON.parse(body);
                            } else {
                                // build jquery object using cheerio
                                pageData = cheerio.load(body);
                            }
                            whilstCallback();
                            return;
                        } else if (response.statusCode === 503) {
                            // if we get a 503, try again
                            logger.log("response status 503, retrying...");
                            whilstCallback();
                            return;
                        } else {
                            // else it's a bad response status, all stop
                            whilstCallback("response status: " + response.statusCode);
                            return;
                        }
                    } else {
                        whilstCallback("no response object found!");
                        return;
                    }
                });
            },
            function(err) {
                callback(err, pageData);
            }
        );
    }
}

module.exports = PriceFinder;
