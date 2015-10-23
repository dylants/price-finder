"use strict";

var PriceMinisterSite = require("../../../lib/sites/priceminister"),
    cheerio = require("cheerio"),
    siteUtils = require("../../../lib/site-utils");

var VALID_URI = "http://www.priceminister.com/mfp/123/my-video-game#pid=456";
var TRANSLATED_URL = "http://www.priceminister.com/mfp?cid=123&urlname=my-video-game&pid=456&action=advlstmeta";
var INVALID_URI = "http://www.bad.com/123/product";

describe("The PriceMinister Site", function () {

    it("should exist", function () {
        expect(PriceMinisterSite).toBeDefined();
    });

    describe("isSite() function", function () {
        it("should return true for a correct site", function () {
            expect(PriceMinisterSite.isSite(VALID_URI)).toBeTruthy();
        });

        it("should return false for a bad site", function () {
            expect(PriceMinisterSite.isSite(INVALID_URI)).toBeFalsy();
        });
    });

    it("should throw an exception trying to create a new PriceMinisterSite with an incorrect uri", function () {
        expect(function () {
            new PriceMinisterSite(INVALID_URI);
        }).toThrow();
    });

    describe("a new PriceMinister Site", function () {
        var priceminister;

        beforeEach(function () {
            priceminister = new PriceMinisterSite(VALID_URI);
        });

        it("should exist", function () {
            expect(priceminister).toBeDefined();
        });

        it("should return the same URI for getURIForPageData()", function () {
            expect(priceminister.getURIForPageData()).toEqual(TRANSLATED_URL);
        });

        it("should return false for isJSON()", function () {
            expect(priceminister.isJSON()).toBeFalsy();
        });

        describe("with a populated page", function () {
            var $, bad$, price, category, name;

            beforeEach(function () {
                price = 19.99;
                category = siteUtils.categories.VIDEO_GAMES;
                name = "My video game";

                $ = cheerio.load(
                    "<div id='advert_list'>" +
                    "<ul class='priceInfos'>" +
                    "<li class='price'>" + price + " €</li></ul>" +
                    "</div>" +
                    "<div class='productTitle'><h1>" + name + "</h1></div>"
                );
                bad$ = cheerio.load("<h1>Nothing here</h1>");
            });

            it("should return the price when displayed on the page", function () {
                var priceFound = priceminister.findPriceOnPage($);
                expect(priceFound).toEqual(price);
            });

            it("should return -1 when the price is not found", function () {
                var priceFound = priceminister.findPriceOnPage(bad$);
                expect(priceFound).toEqual(-1);
            });

            it("should always return the VIDEO_GAMES category", function () {
                var categoryFound = priceminister.findCategoryOnPage($);
                expect(categoryFound).toEqual(category);
            });

            it("should return the name when displayed on the page", function () {
                var nameFound = priceminister.findNameOnPage($, category);
                expect(nameFound).toEqual(name);
            });

            it("should not return null when the name is not displayed on the page", function () {
                var nameFound = priceminister.findNameOnPage(bad$, category);
                expect(nameFound).toEqual(name);
            });

        });
    });

});