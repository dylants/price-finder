"use strict";

// set the timeout of these tests to 10 seconds
jasmine.getEnv().defaultTimeoutInterval = 10000;

var PriceFinder = require("../../lib/price-finder"),
    priceFinder = new PriceFinder();

function verifyPrice(price) {
    expect(price).toBeDefined();
    // we can't guarantee the price, so just make sure it's a number
    // that's more than -1
    expect(price).toBeGreaterThan(-1);
}

function verifyName(actualName, expectedName) {
    expect(actualName).toEqual(expectedName);
}

function verifyCategory(actualCategory, expectedCategory) {
    expect(actualCategory).toEqual(expectedCategory);
}

describe("price-finder for eBags Store URIs", function() {

    // Luggage
    describe("testing a Luggage item", function() {

        // TLS Mother Lode
        var uri = "http://www.ebags.com/product/ebags/mother-lode-tls-mini-21-wheeled-duffel/125538?productid=1325216";

        it("should respond with a price for findItemPrice()", function(done) {
            priceFinder.findItemPrice(uri, function(err, price) {
                expect(err).toBeNull();
                verifyPrice(price);
                done();
            });
        });

        it("should respond with a price, and the right category and name for findItemDetails()", function(done) {
            priceFinder.findItemDetails(uri, function(err, itemDetails) {
                expect(err).toBeNull();
                expect(itemDetails).toBeDefined();

                verifyPrice(itemDetails.price);
                verifyName(itemDetails.name, "TLS Mother Lode Mini 21\" Wheeled Duffel");
                verifyCategory(itemDetails.category, "Luggage");

                done();
            });
        });
    });
});
