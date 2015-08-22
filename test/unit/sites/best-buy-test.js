"use strict";

var BestBuySite = require("../../../lib/sites/best-buy"),
    siteUtils = require("../../../lib/site-utils");

var VALID_URI = "http://www.bestbuy.com/site/product?skuId=123";
var INVALID_URI = "http://www.bad.com/123/product";
var TRANSLATED_URI = "https://api.remix.bestbuy.com/v1/products/123.json?show=sku,name,salePrice,categoryPath&apiKey=junkKey";
var CONFIG = {keys: {bestbuy: "junkKey"}};

describe("The Best Buy Site", function() {

    it("should exist", function() {
        expect(BestBuySite).toBeDefined();
    });

    describe("isSite() function", function() {
        it("should return true for a correct site", function() {
            expect(BestBuySite.isSite(VALID_URI)).toBeTruthy();
        });

        it("should return false for a bad site", function() {
            expect(BestBuySite.isSite(INVALID_URI)).toBeFalsy();
        });
    });

    it("should throw an exception trying to create a new BestBuySite with an incorrect uri", function() {
        expect(function() {
            new BestBuySite(INVALID_URI, CONFIG);
        }).toThrow();
    });

    it("should throw an exception trying to create a new BestBuySite without an API key", function() {
        expect(function() {
            new BestBuySite(VALID_URI, {});
        }).toThrow();
    });

    describe("with an API key in the environment", function() {
        beforeEach(function() {
            process.env.BESTBUY_KEY = "123";
        });

        afterEach(function() {
            process.env.BESTBUY_KEY = "";
        });

        it("should throw an exception trying to create a new BestBuySite without an API key", function() {
            expect(function() {
                new BestBuySite(VALID_URI, {});
            }).not.toThrow();
        });
    });

    describe("a new Best Buy Site", function() {
        var bestBuy;

        beforeEach(function() {
            bestBuy = new BestBuySite(VALID_URI, CONFIG);
        });

        it("should exist", function() {
            expect(bestBuy).toBeDefined();
        });

        it("should return the translated URI for getURIForPageData()", function() {
            expect(bestBuy.getURIForPageData()).toEqual(TRANSLATED_URI);
        });

        it("should return false for isJSON()", function() {
            expect(bestBuy.isJSON()).toBeTruthy();
        });

        describe("with a populated page", function() {
            var $, bad$, price, category, name;

            beforeEach(function() {
                price = 9.99;
                category = siteUtils.categories.MOVIES_TV;
                name = "The Blues Brothers";

                $ = require('./mock-data/bestbuy.full.json');
                try {
                    bad$ = JSON.parse("<h1>Developer Inactive</h1>");
                } catch (err) {}
            });

            it("should return the price when displayed on the page", function() {
                var priceFound = bestBuy.findPriceOnPage($);
                expect(priceFound).toEqual(price);
            });

            it("should return -1 when the price is not found", function() {
                var priceFound = bestBuy.findPriceOnPage(bad$);
                expect(priceFound).toEqual(-1);
            });

            it("should return the category when displayed on the page", function() {
                var categoryFound = bestBuy.findCategoryOnPage($);
                expect(categoryFound).toEqual(category);
            });

            it("should return OTHER when the category is not setup", function() {
                var categoryFound;

                $ = require('./mock-data/bestbuy-other_category.json');
                categoryFound = bestBuy.findCategoryOnPage($);
                expect(categoryFound).toEqual(siteUtils.categories.OTHER);
            });

            it("should return null when the category does not exist", function() {
                var categoryFound = bestBuy.findCategoryOnPage(bad$);
                expect(categoryFound).toEqual(null);
            });

            it("should return the name when displayed on the page", function() {
                var nameFound = bestBuy.findNameOnPage($, category);
                expect(nameFound).toEqual(name);
            });

            it("should return null when the name is not displayed on the page", function() {
                var nameFound = bestBuy.findNameOnPage(bad$, category);
                expect(nameFound).toEqual(null);
            });
        });
    });
});
