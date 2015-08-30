"use strict";

var EBagsSite = require("../../../lib/sites/ebags"),
    cheerio = require("cheerio"),
    siteUtils = require("../../../lib/site-utils");

var VALID_URI = "http://www.ebags.com/123/product";
var INVALID_URI = "http://www.bad.com/123/product";

describe("The eBags Site", function() {

    it("should exist", function() {
        expect(EBagsSite).toBeDefined();
    });

    describe("isSite() function", function() {
        it("should return true for a correct site", function() {
            expect(EBagsSite.isSite(VALID_URI)).toBeTruthy();
        });

        it("should return false for a bad site", function() {
            expect(EBagsSite.isSite(INVALID_URI)).toBeFalsy();
        });
    });

    it("should throw an exception trying to create a new EBagsSite with an incorrect uri", function() {
        expect(function() {
            new EBagsSite(INVALID_URI);
        }).toThrow();
    });

    describe("a new eBags Site", function() {
        var ebags;

        beforeEach(function() {
            ebags = new EBagsSite(VALID_URI);
        });

        it("should exist", function() {
            expect(ebags).toBeDefined();
        });

        it("should return the same URI for getURIForPageData()", function() {
            expect(ebags.getURIForPageData()).toEqual(VALID_URI);
        });

        it("should return false for isJSON()", function() {
            expect(ebags.isJSON()).toBeFalsy();
        });

        describe("with a populated page", function() {
            var $, bad$, price, category, name;

            beforeEach(function() {
                price = 129.99;
                category = siteUtils.categories.LUGGAGE;
                name = "Some Awesome eBag";

                $ = cheerio.load("<div id='productCon'>" +
                    "<span itemprop='name'>" + name + "</span>" +
                    "<div id='divPricing'>" +
                    "<h2 itemprop='price'>$" + price + "</h2>" +
                    "</div>" +
                    "</div>");
                bad$ = cheerio.load("<h1>Nothin here</h1>");
            });

            it("should return the price when displayed on the page", function() {
                var priceFound = ebags.findPriceOnPage($);
                expect(priceFound).toEqual(price);
            });

            it("should return -1 when the price is not found", function() {
                var priceFound = ebags.findPriceOnPage(bad$);
                expect(priceFound).toEqual(-1);
            });

            it("should always return the category", function() {
                var categoryFound = ebags.findCategoryOnPage($);
                expect(categoryFound).toEqual(category);
            });

            it("should return the name when displayed on the page", function() {
                var nameFound = ebags.findNameOnPage($, category);
                expect(nameFound).toEqual(name);
            });

            it("should return null when the name is not displayed on the page", function() {
                var nameFound = ebags.findNameOnPage(bad$, category);
                expect(nameFound).toEqual(null);
            });

        });
    });

});
