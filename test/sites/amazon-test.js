"use strict";

var AmazonSite = require("../../lib/sites/amazon");

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
        var site;

        beforeEach(function() {
            site = new AmazonSite();
        });

        it("should exist", function() {
            expect(site).toBeDefined();
        });

        it("should return false for isJSON()", function() {
            expect(site.isJSON()).toBeFalsy();
        });
    });

});
