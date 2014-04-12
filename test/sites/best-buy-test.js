"use strict";

var BestBuySite = require("../../lib/sites/best-buy"),
    cheerio = require("cheerio"),
    siteUtils = require("../../lib/site-utils");

var VALID_URI = "http://www.bestbuy.com/site/product";

describe("The Best Buy Site", function() {

    it("should exist", function() {
        expect(BestBuySite).toBeDefined();
    });

    describe("isSite() function", function() {
        it("should return true for a correct site", function() {
            expect(BestBuySite.isSite(VALID_URI)).toBeTruthy();
        });

        it("should return false for a bad site", function() {
            expect(BestBuySite.isSite("www.bad.com/123/product")).toBeFalsy();
        });
    });

    it("should throw an exception trying to create a new BestBuySite with an incorrect uri", function() {
        expect(function() {
            new BestBuySite("www.bad_uri.bad");
        }).toThrow();
    });

    describe("a new Best Buy Site", function() {
        var bestBuy;

        beforeEach(function() {
            bestBuy = new BestBuySite(VALID_URI);
        });

        it("should exist", function() {
            expect(bestBuy).toBeDefined();
        });

        it("should return false for isJSON()", function() {
            expect(bestBuy.isJSON()).toBeFalsy();
        });

        describe("with a populated page", function() {
            var $, bad$, price;

            beforeEach(function() {
                price = 9.99;

                $ = cheerio.load(
                    "<div class='item-price'>$" + price + "</div>");
                bad$ = cheerio.load("<h1>Nothin here</h1>");
            });

            it("should return the price when displayed on the page", function() {
                var priceFound = bestBuy.findPriceOnPage($);
                expect(priceFound).toEqual(price);
            });

            it("should return -1 when the price is not found", function() {
                var priceFound = bestBuy.findPriceOnPage(bad$);
                expect(priceFound).toEqual(-1);
            });

            it("should return null for category because it's not supported", function() {
                expect(bestBuy.findCategoryOnPage($)).toEqual(null);
            });

            it("should return null for name because it's not supported", function() {
                expect(bestBuy.findNameOnPage($)).toEqual(null);
            });
        });
    });
});
