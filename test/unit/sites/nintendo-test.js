"use strict";

var NintendoSite = require("../../../lib/sites/nintendo"),
    cheerio = require("cheerio"),
    siteUtils = require("../../../lib/site-utils");

var VALID_URI = "http://www.nintendo.com/product";
var INVALID_URI = "http://www.bad.com/123/product";

describe("The Nintendo Site", function() {

    it("should exist", function() {
        expect(NintendoSite).toBeDefined();
    });

    describe("isSite() function", function() {
        it("should return true for a correct site", function() {
            expect(NintendoSite.isSite(VALID_URI)).toBeTruthy();
        });

        it("should return false for a bad site", function() {
            expect(NintendoSite.isSite(INVALID_URI)).toBeFalsy();
        });
    });

    it("should throw an exception trying to create a new NintendoSite with an incorrect uri", function() {
        expect(function() {
            new NintendoSite(INVALID_URI);
        }).toThrow();
    });

    describe("a new Nintento Site", function() {
        var nintendo;

        beforeEach(function() {
            nintendo = new NintendoSite(VALID_URI);
        });

        it("should exist", function() {
            expect(nintendo).toBeDefined();
        });

        it("should return false for isJSON()", function() {
            expect(nintendo.isJSON()).toBeFalsy();
        });

        it("should return the same URI for getURIForPageData()", function() {
            expect(nintendo.getURIForPageData()).toEqual(VALID_URI);
        });

        describe("with a populated page", function() {
            var $, bad$, price, category, name;

            beforeEach(function() {
                price = 59.99;
                category = siteUtils.categories.VIDEO_GAMES;
                name = "New Super Mario Bros. U";

                $ = cheerio.load(
                    "<div itemprop='price'>" +
                    "$" + price + "<sup>*</sup>" +
                    "</div>" +
                    "<h1 itemprop='name'>" + name + "</h1>"
                );
                bad$ = cheerio.load("<h1>Nothin here</h1>");
            });

            it("should return the price when displayed on the page", function() {
                var priceFound = nintendo.findPriceOnPage($);
                expect(priceFound).toEqual(price);
            });

            it("should return -1 when the price is not found", function() {
                var priceFound = nintendo.findPriceOnPage(bad$);
                expect(priceFound).toEqual(-1);
            });

            it("should return the category", function() {
                var categoryFound = nintendo.findCategoryOnPage($);
                expect(categoryFound).toEqual(category);
            });

            it("should return the name when displayed on the page", function() {
                var nameFound = nintendo.findNameOnPage($, category);
                expect(nameFound).toEqual(name);
            });

            it("should return null when the name is not displayed on the page", function() {
                var nameFound = nintendo.findNameOnPage(bad$, category);
                expect(nameFound).toEqual(null);
            });
        });
    });
});
