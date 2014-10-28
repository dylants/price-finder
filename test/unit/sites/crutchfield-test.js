"use strict";

var CrutchfieldSite = require("../../../lib/sites/crutchfield"),
    cheerio = require("cheerio"),
    siteUtils = require("../../../lib/site-utils");

var VALID_URI = "http://www.crutchfield.com/product";
var INVALID_URI = "http://www.bad.com/123/product";

describe("The Crutchfield Site", function() {

    it("should exist", function() {
        expect(CrutchfieldSite).toBeDefined();
    });

    describe("isSite() function", function() {
        it("should return true for a correct site", function() {
            expect(CrutchfieldSite.isSite(VALID_URI)).toBeTruthy();
        });

        it("should return false for a bad site", function() {
            expect(CrutchfieldSite.isSite(INVALID_URI)).toBeFalsy();
        });
    });

    it("should throw an exception trying to create a new CrutchfieldSite with an incorrect uri", function() {
        expect(function() {
            new CrutchfieldSite(INVALID_URI);
        }).toThrow();
    });

    describe("a new Crutchfield Site", function() {
        var crutchfield;

        beforeEach(function() {
            crutchfield = new CrutchfieldSite(VALID_URI);
        });

        it("should exist", function() {
            expect(crutchfield).toBeDefined();
        });

        it("should return false for isJSON()", function() {
            expect(crutchfield.isJSON()).toBeFalsy();
        });

        it("should return the same URI for getURIForPageData()", function() {
            expect(crutchfield.getURIForPageData()).toEqual(VALID_URI);
        });

        describe("with a populated page", function() {
            var $, bad$, price, category, name;

            beforeEach(function() {
                price = 59.99;
                category = siteUtils.categories.TELEVISION_VIDEO;
                name = "Samsung Blu-Ray Player";

                $ = cheerio.load(
                    "<div id='crumb-trail'>" +
                    "<div class='crumb'>Home  /  </div>" +
                    "<div class='crumb'>TVs & Video  /  </div>" +
                    "<div class='crumb'>Category  /  </div>" +
                    "</div>" +
                    "<h1 class='productHeading'>" +
                    "Samsung Blu-Ray Player" +
                    "</h1>" +
                    "<div class='finalPrice'>" +
                    "$59.99" +
                    "</div>"
                );
                bad$ = cheerio.load("<h1>Nothin here</h1>");
            });

            it("should return the price when displayed on the page", function() {
                var priceFound = crutchfield.findPriceOnPage($);
                expect(priceFound).toEqual(price);
            });

            it("should return -1 when the price is not found", function() {
                var priceFound = crutchfield.findPriceOnPage(bad$);
                expect(priceFound).toEqual(-1);
            });

            it("should return the category when displayed on the page", function() {
                var categoryFound = crutchfield.findCategoryOnPage($);
                expect(categoryFound).toEqual(category);
            });

            it("should return OTHER when the category is not setup", function() {
                var categoryFound;

                $ = cheerio.load(
                    "<div id='crumb-trail'>" +
                    "<div class='crumb'>Home  /  </div>" +
                    "<div class='crumb'>Category  /  </div>" +
                    "</div>"
                );
                categoryFound = crutchfield.findCategoryOnPage($);
                expect(categoryFound).toEqual(siteUtils.categories.OTHER);
            });

            it("should return null when the category does not exist", function() {
                var categoryFound = crutchfield.findCategoryOnPage(bad$);
                expect(categoryFound).toEqual(null);
            });

            it("should return the name when displayed on the page", function() {
                var nameFound = crutchfield.findNameOnPage($, category);
                expect(nameFound).toEqual(name);
            });

            it("should return null when the name is not displayed on the page", function() {
                var nameFound = crutchfield.findNameOnPage(bad$, category);
                expect(nameFound).toEqual(null);
            });
        });
    });
});
