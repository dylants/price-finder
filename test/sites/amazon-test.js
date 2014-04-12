"use strict";

var AmazonSite = require("../../lib/sites/amazon"),
    cheerio = require("cheerio"),
    siteUtils = require("../../lib/site-utils");

describe("The Amazon Site", function() {

    it("should exist", function() {
        expect(AmazonSite).toBeDefined();
    });

    describe("isSite() function", function() {
        it("should return true for a correct site", function() {
            expect(AmazonSite.isSite("www.amazon.com/123/product")).toBeTruthy();
        });

        it("should return false for a bad site", function() {
            expect(AmazonSite.isSite("www.bad.com/123/product")).toBeFalsy();
        });
    });

    describe("A new Amazon Site", function() {
        var amazon;

        beforeEach(function() {
            amazon = new AmazonSite();
        });

        it("should exist", function() {
            expect(amazon).toBeDefined();
        });

        it("should return false for isJSON()", function() {
            expect(amazon.isJSON()).toBeFalsy();
        });

        describe("with a populated page", function() {
            var $, bad$, price, category, name;

            beforeEach(function() {
                price = 9.99;
                category = siteUtils.categories.BOOKS;
                name = "The Cat in the Hat";

                $ = cheerio.load("<div id='actualPriceValue'>$" + price + "</div>" +
                    "<div id='nav-subnav' data-category='books'>stuff</div>" +
                    "<div id='title'>" + name + "</div>");
                bad$ = cheerio.load("<h1>Nothin here</h1>");
            });

            it("should return the price when displayed on the page", function() {
                var priceFound = amazon.findPriceOnPage($);
                expect(priceFound).toEqual(price);
            });

            it("should return -1 when the price is not found", function() {
                var priceFound = amazon.findPriceOnPage(bad$);
                expect(priceFound).toEqual(-1);
            });

            it("should return the category when displayed on the page", function() {
                var categoryFound = amazon.findCategoryOnPage($);
                expect(categoryFound).toEqual(category);
            });

            it("should return OTHER when the category is not setup", function() {
                var categoryFound;

                $ = cheerio.load("<div id='nav-subnav' data-category='something-new'>stuff</div>");
                categoryFound = amazon.findCategoryOnPage($);
                expect(categoryFound).toEqual(siteUtils.categories.OTHER);
            });

            it("should return null when the category does not exist", function() {
                var categoryFound = amazon.findCategoryOnPage(bad$);
                expect(categoryFound).toEqual(null);
            });

            it("should return the name when displayed on the page", function() {
                var nameFound = amazon.findNameOnPage($, category);
                expect(nameFound).toEqual(name);
            });

            it("should return the name when displayed on the page", function() {
                var nameFound = amazon.findNameOnPage(bad$, category);
                expect(nameFound).toEqual(null);
            });

        });
    });

});
