"use strict";

var GameStopSite = require("../../../lib/sites/gamestop"),
    cheerio = require("cheerio"),
    siteUtils = require("../../../lib/site-utils");

var VALID_URI = "http://www.gamestop.com/games/product";
var INVALID_URI = "http://www.bad.com/123/product";

describe("The GameStop Site", function() {

    it("should exist", function() {
        expect(GameStopSite).toBeDefined();
    });

    describe("isSite() function", function() {
        it("should return true for a correct site", function() {
            expect(GameStopSite.isSite(VALID_URI)).toBeTruthy();
        });

        it("should return false for a bad site", function() {
            expect(GameStopSite.isSite(INVALID_URI)).toBeFalsy();
        });
    });

    it("should throw an exception trying to create a new GameStopSite with an incorrect uri", function() {
        expect(function() {
            new GameStopSite(INVALID_URI);
        }).toThrow();
    });

    describe("a new GameStop Site", function() {
        var gamestop;

        beforeEach(function() {
            gamestop = new GameStopSite(VALID_URI);
        });

        it("should exist", function() {
            expect(gamestop).toBeDefined();
        });

        it("should return false for isJSON()", function() {
            expect(gamestop.isJSON()).toBeFalsy();
        });

        it("should return the same URI for getURIForPageData()", function() {
            expect(gamestop.getURIForPageData()).toEqual(VALID_URI);
        });

        describe("with a populated page", function() {
            var $, bad$, price, category, name;

            beforeEach(function() {
                price = 59.99;
                category = siteUtils.categories.VIDEO_GAMES;
                name = "Mario Kart 8";

                $ = cheerio.load(
                    "<div class='cartridgeProductHeader'>" +
                    "<h1>Mario Kart 8 " +
                    "<cite>by " +
                    "Nintendo of America</cite>" +
                    "</h1>" +
                    "</div>" +
                    "<div class='buy1'>" +
                    "<h3>$59.99</h3>" +
                    "</div>"
                );
                bad$ = cheerio.load("<h1>Nothin here</h1>");
            });

            it("should return the price when displayed on the page", function() {
                var priceFound = gamestop.findPriceOnPage($);
                expect(priceFound).toEqual(price);
            });

            it("should return -1 when the price is not found", function() {
                var priceFound = gamestop.findPriceOnPage(bad$);
                expect(priceFound).toEqual(-1);
            });

            it("should always return the video games category", function() {
                var categoryFound = gamestop.findCategoryOnPage($);
                expect(categoryFound).toEqual(category);
            });

            it("should return the name when displayed on the page", function() {
                var nameFound = gamestop.findNameOnPage($, category);
                expect(nameFound).toEqual(name);
            });

            it("should return null when the name is not displayed on the page", function() {
                var nameFound = gamestop.findNameOnPage(bad$, category);
                expect(nameFound).toEqual(null);
            });
        });
    });
});
