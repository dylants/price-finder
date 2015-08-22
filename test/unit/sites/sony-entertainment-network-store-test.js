"use strict";

var SonyENSSite = require("../../../lib/sites/sony-entertainment-network-store"),
    siteUtils = require("../../../lib/site-utils");

var VALID_URI = "https://store.sonyentertainmentnetwork.com/#!/en-us/games/my-game/cid=123ABC",
    VALID_URI_2 = "https://store.playstation.com/#!/en-us/games/my-game/cid=123ABC",
    VALID_API_URL = "https://store.playstation.com/store/api/chihiro/00_09_000/container/US/en/999/123ABC",
    INVALID_URI = "http://www.bad.com/123/product";

describe("The Sony Entertainment Network Store Site", function() {

    it("should exist", function() {
        expect(SonyENSSite).toBeDefined();
    });

    describe("isSite() function", function() {
        it("should return true for a correct site", function() {
            expect(SonyENSSite.isSite(VALID_URI)).toBeTruthy();
        });

        it("should return true for a correct (alternate) site", function() {
            expect(SonyENSSite.isSite(VALID_URI_2)).toBeTruthy();
        });

        it("should return false for a bad site", function() {
            expect(SonyENSSite.isSite(INVALID_URI)).toBeFalsy();
        });
    });

    it("should throw an exception trying to create a new SonyENSSite with an incorrect uri", function() {
        expect(function() {
            new SonyENSSite(INVALID_URI);
        }).toThrow();
    });

    describe("a new Sony Entertainment Network Store Site", function() {
        var sony;

        beforeEach(function() {
            sony = new SonyENSSite(VALID_URI);
        });

        it("should exist", function() {
            expect(sony).toBeDefined();
        });

        it("should return the API URI for getURIForPageData()", function() {
            expect(sony.getURIForPageData()).toEqual(VALID_API_URL);
        });

        it("should return true for isJSON()", function() {
            expect(sony.isJSON()).toBeTruthy();
        });

        describe("with page data", function() {
            var pageData, pageDataWithPlaystationPlus, badPageData,
                price, playstationPlusPrice, category, name;

            beforeEach(function() {
                price = 9.99;
                playstationPlusPrice = 0;
                category = siteUtils.categories.VIDEO_GAMES;
                name = "PixelJunk Monsters";

                pageData = {
                    default_sku: {
                        display_price: "$9.99"
                    },
                    bucket: "games",
                    name: name
                };

                pageDataWithPlaystationPlus = {
                    default_sku: {
                        display_price: "$9.99",
                        rewards: [{
                            display_price: "Free"
                        }]
                    },
                    bucket: "games",
                    name: name
                };

                badPageData = {};
            });

            it("should return the price when displayed on the page", function() {
                var priceFound = sony.findPriceOnPage(pageData);
                expect(priceFound).toEqual(price);
            });

            it("should return -1 when the price is not found", function() {
                var priceFound = sony.findPriceOnPage(badPageData);
                expect(priceFound).toEqual(-1);
            });

            it("should return the playstation plus price when available", function() {
                var priceFound = sony.findPriceOnPage(pageDataWithPlaystationPlus);
                expect(priceFound).toEqual(playstationPlusPrice);
            });

            it("should return the category when displayed on the page", function() {
                var categoryFound = sony.findCategoryOnPage(pageData);
                expect(categoryFound).toEqual(category);
            });

            it("should return OTHER when the category is not setup", function() {
                var categoryFound;

                pageData.bucket = "somethingElse";
                categoryFound = sony.findCategoryOnPage(pageData);
                expect(categoryFound).toEqual(siteUtils.categories.OTHER);
            });

            it("should return null when the category does not exist", function() {
                var categoryFound = sony.findCategoryOnPage(badPageData);
                expect(categoryFound).toEqual(null);
            });

            it("should return the name when displayed on the page", function() {
                var nameFound = sony.findNameOnPage(pageData, category);
                expect(nameFound).toEqual(name);
            });

            it("should return null when the name is not displayed on the page", function() {
                var nameFound = sony.findNameOnPage(badPageData, category);
                expect(nameFound).toEqual(null);
            });

        });
    });
});
