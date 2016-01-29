"use strict";

var siteUtils = require("../../lib/site-utils"),
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

    it("should have some known categories", function() {
        expect(siteUtils.categories.MUSIC).toEqual("Music");
        expect(siteUtils.categories.VIDEO_GAMES).toEqual("Video Games");
        expect(siteUtils.categories.BOOKS).toEqual("Books");
    });

    describe("findContentOnPage() with a populated page", function() {
        var $;

        beforeEach(function() {
            $ = cheerio.load("<div id='price-tag'>$9.99</div>");
        });

        it("should return the price given the correct selector", function() {
            var selectors, price;

            selectors = [
                "#price-tag"
            ];

            price = siteUtils.findContentOnPage($, selectors);

            expect(price).toEqual("$9.99");
        });

        it("should return null given incorrect selector", function() {
            var selectors, price;

            selectors = [
                "#name-tag"
            ];

            price = siteUtils.findContentOnPage($, selectors);

            expect(price).toEqual(null);
        });
    });

    describe("processPrice()", function() {
        it("should process $ price correctly", function() {
            expect(siteUtils.processPrice("$3.99")).toEqual(3.99);
        });

        it("should process EUR price correctly", function() {
            expect(siteUtils.processPrice("EUR 79,40")).toEqual(79.40);
        });

        it("should process eur price correctly", function() {
            expect(siteUtils.processPrice("eur 79,40")).toEqual(79.40);
        });

        it("should process Euros price correctly", function() {
            expect(siteUtils.processPrice("Euros 79,40")).toEqual(79.40);
        });

        it("should process € price correctly", function() {
            expect(siteUtils.processPrice("€ 79,40")).toEqual(79.40);
        });

        it("should process YEN_TEXT price correctly", function() {
            expect(siteUtils.processPrice("7,940 円")).toEqual(7940);
        });

        it("should process YEN_SYMBOL price correctly", function() {
            expect(siteUtils.processPrice("￥ 7,940")).toEqual(7940);
        });

        it("should process £ price correctly", function() {
            expect(siteUtils.processPrice("£3.99")).toEqual(3.99);
        });

        it("should process an unknown price correctly", function() {
            expect(siteUtils.processPrice("hey, how are you?")).toEqual(-1);
        });
    });
});
