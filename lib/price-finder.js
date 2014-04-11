"use strict";

var async = require("async"),
    request = require("request"),
    cheerio = require("cheerio"),
    siteManager = require("./site-manager");

// Categories
var CATEGORY_DIGITAL_MUSIC = "Digital Music",
    CATEGORY_VIDEO_GAMES = "Video Games",
    CATEGORY_MOVIES_TV = "Movies & TV",
    CATEGORY_CAMERA_VIDEO = "Camera & Video",
    CATEGORY_TOYS_GAMES = "Toys & Games",
    CATEGORY_BOOKS = "Books",
    CATEGORY_KINDLE_BOOKS = "Kindle Books",
    CATEGORY_HOUSEHOLD = "Household",
    CATEGORY_HEALTH_PERSONAL_CARE = "Health & Personal Care",
    CATEGORY_OTHER = "Other";

function PriceFinder() {

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

        site = siteManager.loadSite(uri);

        // page scrape the site to find the item details
        pageScrape(site, function(err, pageData) {
            var itemDetails;

            if (err) {
                callback(err);
                return;
            }

            itemDetails = {};

            // find the price on the website
            itemDetails.price = findPriceOnPage(uri, pageData);

            // error check
            if (itemDetails.price === -1) {
                callback("unable to find price for uri: " + uri);
                return;
            }

            // find the category on the page
            itemDetails.category = findCategoryOnPage(uri, pageData);

            // find the name on the page (if we have the category)
            if (itemDetails.category) {
                itemDetails.name = findNameOnPage(uri, pageData, itemDetails.category);
            }

            // call the callback with our item details (null error)
            callback(null, itemDetails);
        });
    };

    function pageScrape(site, callback) {
        var pageData;

        // test to see if this is a mock URI
        if (process.env.TEST && site.uri === "mock_uri") {
            // end here, this is just test
            callback();
            return;
        }

        async.whilst(
            function() {
                // run this until we get page data
                return !pageData;
            },
            function(whilstCallback) {
                // hit the site to get the item details
                request({
                    uri: site.uri,
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
                            console.log("response status 503, retrying...");
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

    function findPriceOnPage(uri, $) {
        var price, selectors;

        if (uri.indexOf("amazon.com") > -1) {
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
            price = findContentOnPage($, selectors);

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
        } else if (uri.indexOf("play.google.com") > -1) {
            // crazy, but this seems to be the way to get the price of an
            // item on the google play store
            price = $(".details-actions .price").text().replace(/\s+/g, " ").split(" ")[1];

            if (!price) {
                console.error("price was not found on google play page, uri: " + uri);
                return -1;
            }

            // get the number value (remove dollar sign)
            price = +(price.slice(1));
            console.log("price: " + price);

            return price;
        } else if (uri.indexOf("bestbuy.com") > -1) {
            // best buy seems to use the same template for price
            price = $(".item-price").text().trim();

            if (!price) {
                console.error("price was not found on best buy page, uri: " + uri);
                return -1;
            }

            // get the number value (remove dollar sign)
            price = +(price.slice(1));
            console.log("price: " + price);

            return price;
        } else if (process.env.TEST && (uri == "mock_uri")) {
            // if we're in the test environment, and we have a mock uri,
            // generate a random price
            price = Math.floor(Math.random() * 100);
            return price;
        } else {
            console.error("unknown site!! " + uri);
            return -1;
        }
    }

    function findCategoryOnPage(uri, $) {
        var category;

        if (uri.indexOf("amazon.com") > -1) {
            category = $("#nav-subnav").data("category");
            if (!category || category.length < 1) {
                console.error("category not found on amazon page, uri: " + uri);
                return null;
            }

            if (category === "dmusic") {
                category = CATEGORY_DIGITAL_MUSIC;
            } else if (category === "videogames") {
                category = CATEGORY_VIDEO_GAMES;
            } else if (category === "movies-tv") {
                category = CATEGORY_MOVIES_TV;
            } else if (category === "photo") {
                category = CATEGORY_CAMERA_VIDEO;
            } else if (category === "toys-and-games") {
                category = CATEGORY_TOYS_GAMES;
            } else if (category === "shared-fiona-attributes") {
                category = CATEGORY_KINDLE_BOOKS;
            } else if (category === "books") {
                category = CATEGORY_BOOKS;
            } else if (category === "hi") {
                category = CATEGORY_HOUSEHOLD;
            } else if (category === "hpc") {
                category = CATEGORY_HEALTH_PERSONAL_CARE;
            } else {
                console.log("category not setup, using 'other'");
                category = CATEGORY_OTHER;
            }

            console.log("category: " + category);

            return category;
        } else if (uri.indexOf("play.google.com") > -1) {
            // no category support for google play
            return null;
        } else if (uri.indexOf("bestbuy.com") > -1) {
            // no category support for best buy
            return null;
        } else if (process.env.TEST && (uri == "mock_uri")) {
            // if we're in the test environment, and we have a mock uri,
            // return the mock category
            return "Mock";
        } else {
            console.error("unknown site!! " + uri);
            return null;
        }
    }

    function findNameOnPage(uri, $, category) {
        var name, selectors;

        if (uri.indexOf("amazon.com") > -1) {
            if (category === CATEGORY_DIGITAL_MUSIC) {
                name = $("#artist_row").text().trim() + ": " +
                    $("#title_row").text().trim();
            } else {
                selectors = [
                    "#btAsinTitle",
                    "#title"
                ];

                // use the selectors to find the name on the page
                name = findContentOnPage($, selectors);
            }

            if (!name) {
                console.error("name not found on amazon page, uri: " + uri);
                return null;
            }

            console.log("name: " + name);

            return name;
        } else if (uri.indexOf("play.google.com") > -1) {
            // no name support for google play store
            return null;
        } else if (uri.indexOf("bestbuy.com") > -1) {
            // no name support for best buy
            return null;
        } else if (process.env.TEST && (uri == "mock_uri")) {
            // if we're in the test environment, and we have a mock uri,
            // generate a random name
            return "MockItem" + Math.floor(Math.random() * 100000);
        } else {
            console.error("unknown site!! " + uri);
            return null;
        }
    }

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
}

module.exports = new PriceFinder();
