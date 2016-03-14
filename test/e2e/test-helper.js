'use strict';

const should = require('should');

// set the price-finder retry sleep time to 5 seconds
// (in an attempt to avoid spamming these sites should we need to retry)
const RETRY_SLEEP_TIME = 5000;

// create a single instance of price-finder that will be used by e2e tests
const PriceFinder = require('../../lib/price-finder');
exports.priceFinder = new PriceFinder({
  retrySleepTime: RETRY_SLEEP_TIME,
});

exports.verifyPrice = function verifyPrice(price) {
  should.exist(price);

  // we can't guarantee the price, so just make sure it's a number
  // that's more than -1
  should(price).be.above(-1);
};

function verifyName(actualName, expectedName) {
  should(actualName).equal(expectedName);
}

function verifyCategory(actualCategory, expectedCategory) {
  should(actualCategory).equal(expectedCategory);
}

exports.verifyItemDetails = function verifyItemDetails(itemDetails, name, category) {
  should.exist(itemDetails);

  if (itemDetails) {
    exports.verifyPrice(itemDetails.price);
    verifyName(itemDetails.name, name);
    verifyCategory(itemDetails.category, category);
  }
};
