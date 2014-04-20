"use strict";

var rewire = require("rewire"),
    priceFinder = rewire("../../lib/price-finder");

describe("The Price Finder", function() {

    it("should exist", function() {
        expect(priceFinder).toBeDefined();
    });

    it("should throw an exception in findItemPrice() when presented with an unsupported URI", function(done) {
        priceFinder.findItemPrice("www.bad_uri.bad", function(error, price) {
            expect(error).toBeDefined();
            done();
        });
    });

    it("should throw an exception in findItemDetails() when presented with an unsupported URI", function(done) {
        priceFinder.findItemDetails("www.bad_uri.bad", function(error, itemDetails) {
            expect(error).toBeDefined();
            done();
        });
    });

    describe("with an Amazon URI and valid mock request data", function() {
        var testPrice, testCategory, testName, _request;

        testPrice = 19.99;
        testCategory = "Books";
        testName = "The Expensive Cat in the Hat";

        beforeEach(function() {
            // save off the request
            _request = priceFinder.__get__("request");

            // set request to return a specific body
            priceFinder.__set__("request", function(options, callback) {
                var response, body;

                // setup valid response
                response = {};
                response.statusCode = 200;

                // setup valid body
                body = "<div id='actualPriceValue'>$" + testPrice + "</div>" +
                    "<div id='nav-subnav' data-category='books'>stuff</div>" +
                    "<div id='title'>" + testName + "</div>";
                callback(null, response, body);
            });
        });

        it("should return the item price", function(done) {
            priceFinder.findItemPrice("http://www.amazon.com/product/cat-in-the-hat", function(error, price) {
                expect(error).toBe(null);
                expect(price).toEqual(testPrice);
                done();
            });
        });

        it("should return the item details", function(done) {
            priceFinder.findItemDetails("http://www.amazon.com/product/cat-in-the-hat", function(error, itemDetails) {
                expect(error).toBe(null);

                expect(itemDetails).toBeDefined();
                expect(itemDetails.price).toBeDefined();
                expect(itemDetails.price).toEqual(testPrice);
                expect(itemDetails.category).toBeDefined();
                expect(itemDetails.category).toEqual(testCategory);
                expect(itemDetails.name).toBeDefined();
                expect(itemDetails.name).toEqual(testName);
                done();
            });
        });

        afterEach(function() {
            priceFinder.__set__("request", _request);
        });
    });

    describe("with a valid URI and mock request data with status code 404", function() {
        var _request;

        beforeEach(function() {
            // save off the request
            _request = priceFinder.__get__("request");

            // set request to return a specific body
            priceFinder.__set__("request", function(options, callback) {
                var response, body;

                // setup invalid response code
                response = {};
                response.statusCode = 404;

                // setup valid body
                body = "Site Not Found";
                callback(null, response, body);
            });
        });

        it("should return an error for findItemPrice()", function(done) {
            priceFinder.findItemPrice("http://www.amazon.com/product/cat-in-the-hat", function(error, price) {
                expect(error).toBeDefined();
                done();
            });
        });

        it("should return the item details", function(done) {
            priceFinder.findItemDetails("http://www.amazon.com/product/cat-in-the-hat", function(error, itemDetails) {
                expect(error).toBeDefined();
                done();
            });
        });

        afterEach(function() {
            priceFinder.__set__("request", _request);
        });
    });

    describe("with a valid URI and invalid mock request data", function() {
        var _request;

        beforeEach(function() {
            // save off the request
            _request = priceFinder.__get__("request");

            // set request to return a specific body
            priceFinder.__set__("request", function(options, callback) {
                var response, body;

                // setup invalid response code
                response = {};
                response.statusCode = 200;

                // setup valid body
                body = "<h1>Nothin here</h1>";
                callback(null, response, body);
            });
        });

        it("should return an error for findItemPrice()", function(done) {
            priceFinder.findItemPrice("http://www.amazon.com/product/cat-in-the-hat", function(error, price) {
                expect(error).toBeDefined();
                done();
            });
        });

        it("should return the item details", function(done) {
            priceFinder.findItemDetails("http://www.amazon.com/product/cat-in-the-hat", function(error, itemDetails) {
                expect(error).toBeDefined();
                done();
            });
        });

        afterEach(function() {
            priceFinder.__set__("request", _request);
        });
    });
});
