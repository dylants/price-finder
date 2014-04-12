"use strict";

var siteUtils = require("../lib/site-utils"),
    cheerio = require("cheerio");

describe("The Site Utils", function() {

    it("should exist", function() {
        expect(siteUtils).toBeDefined();
    });

    it("should have categories", function() {
        expect(siteUtils.categories).toBeDefined();
    });

    it("should be at least 1 category in categories", function() {
        var keys;

        keys = Object.keys(siteUtils.categories);
        expect(keys.length).toBeGreaterThan(0);
    });

    describe("with a populated page", function() {
        var $;

        beforeEach(function() {
            $ = cheerio.load("<div id='price-tag'>$9.99</div>");
        });

        it("findContentOnPage() should return the price given the correct selector", function() {
            var selectors, price;

            selectors = [
                "#price-tag"
            ];

            price = siteUtils.findContentOnPage($, selectors);

            expect(price).toEqual("$9.99");
        });

        it("findContentOnPage() should return null given incorrect selector", function() {
            var selectors, price;

            selectors = [
                "#name-tag"
            ];

            price = siteUtils.findContentOnPage($, selectors);

            expect(price).toEqual(null);
        });
    });
});
