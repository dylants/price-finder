"use strict";

var GooglePlaySite = require("../../lib/sites/google-play"),
    cheerio = require("cheerio"),
    siteUtils = require("../../lib/site-utils");

var VALID_URI = "https://play.google.com/store/product";
var INVALID_URI = "http://www.bad.com/123/product";

describe("The GooglePlay Site", function() {

    it("should exist", function() {
        expect(GooglePlaySite).toBeDefined();
    });

    describe("isSite() function", function() {
        it("should return true for a correct site", function() {
            expect(GooglePlaySite.isSite(VALID_URI)).toBeTruthy();
        });

        it("should return false for a bad site", function() {
            expect(GooglePlaySite.isSite(INVALID_URI)).toBeFalsy();
        });
    });

    it("should throw an exception trying to create a new GooglePlaySite with an incorrect uri", function() {
        expect(function() {
            new GooglePlaySite(INVALID_URI);
        }).toThrow();
    });

    describe("a new GooglePlay Site", function() {
        var googlePlay;

        beforeEach(function() {
            googlePlay = new GooglePlaySite(VALID_URI);
        });

        it("should exist", function() {
            expect(googlePlay).toBeDefined();
        });

        it("should return false for isJSON()", function() {
            expect(googlePlay.isJSON()).toBeFalsy();
        });

        it("should return the same URI for getURIForPageData()", function() {
            expect(googlePlay.getURIForPageData()).toEqual(VALID_URI);
        });

        describe("with a populated page", function() {
            var $, bad$, price;

            beforeEach(function() {
                price = 9.99;

                $ = cheerio.load(
                    "<div class='details-actions'>" +
                    "<div class='price'>" +
                    "<span> $" + price + " </span>" +
                    "<span> something </span>" +
                    "</div>" +
                    "</div>");
                bad$ = cheerio.load("<h1>Nothin here</h1>");
            });

            it("should return the price when displayed on the page", function() {
                var priceFound = googlePlay.findPriceOnPage($);
                expect(priceFound).toEqual(price);
            });

            it("should return -1 when the price is not found", function() {
                var priceFound = googlePlay.findPriceOnPage(bad$);
                expect(priceFound).toEqual(-1);
            });

            it("should return null for category because it's not supported", function() {
                expect(googlePlay.findCategoryOnPage($)).toEqual(null);
            });

            it("should return null for name because it's not supported", function() {
                expect(googlePlay.findNameOnPage($)).toEqual(null);
            });
        });
    });
});
