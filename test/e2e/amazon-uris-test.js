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

/*
 * I've seen some CAPTCHA's from Amazon if you hit them too much too often,
 * so be fairly easy here. We need to try to hit the balance of testing that
 * the code works for Amazon, while not testing *too* much that CAPTCHA's
 * are thrown and the tests fail (and our IP is blacklisted).
 */
describe("price-finder for Amazon URIs", function() {

    // Digital Music
    describe("testing a Digital Music item", function() {
        // Atoms for Peace : Amok
        var uri = "http://www.amazon.com/Amok/dp/B00BIQ1EL4";

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
                verifyName(itemDetails.name, "Atoms For Peace: Amok");
                verifyCategory(itemDetails.category, "Digital Music");

                done();
            });
        });
    });

    /*
     * The remainder just test findItemDetails() to avoid too many hits to Amazon
     */

    // Video Games
    describe("testing a Video Games item", function() {
        // Pikmin 3 Wii U
        var uri = "http://www.amazon.com/Pikmin-3-Nintendo-Wii-U/dp/B0050SWBAE";

        it("should respond with a price, and the right category and name for findItemDetails()", function(done) {
            priceFinder.findItemDetails(uri, function(err, itemDetails) {
                expect(err).toBeNull();
                expect(itemDetails).toBeDefined();

                verifyPrice(itemDetails.price);
                verifyName(itemDetails.name, "Pikmin 3");
                verifyCategory(itemDetails.category, "Video Games");

                done();
            });
        });
    });

    // Mobile Apps
    describe("testing a Mobile Apps item", function() {
        // Minecraft
        var uri = "http://www.amazon.com/Mojang-Minecraft-Pocket-Edition/dp/B00992CF6W";

        it("should respond with a price, and the right category and name for findItemDetails()", function(done) {
            priceFinder.findItemDetails(uri, function(err, itemDetails) {
                expect(err).toBeNull();
                expect(itemDetails).toBeDefined();

                verifyPrice(itemDetails.price);
                verifyName(itemDetails.name, "Minecraft - Pocket Edition");
                verifyCategory(itemDetails.category, "Mobile Apps");

                done();
            });
        });
    });

    // Movies & TV
    describe("testing a Movies & TV item", function() {
        // Blues Brothers
        var uri = "http://www.amazon.com/product/dp/B001AQO446";

        it("should respond with a price, and the right category and name for findItemDetails()", function(done) {
            priceFinder.findItemDetails(uri, function(err, itemDetails) {
                expect(err).toBeNull();
                expect(itemDetails).toBeDefined();

                verifyPrice(itemDetails.price);
                verifyName(itemDetails.name, "The Blues Brothers [Blu-ray] (1980)");
                verifyCategory(itemDetails.category, "Movies & TV");

                done();
            });
        });
    });

});
