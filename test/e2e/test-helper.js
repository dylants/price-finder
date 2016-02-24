'use strict';

// set the timeout for each test to 60 seconds (crazy! but necessary it seems)
const TEST_TIMEOUT = 60000;

// set the price-finder retry sleep time to 5 seconds
// (in an attempt to avoid spamming these sites should we need to retry)
const RETRY_SLEEP_TIME = 5000;

// populate the test timeout to all available jasmime listeners
jasmine.getEnv().defaultTimeoutInterval = TEST_TIMEOUT;
jasmine.DEFAULT_TIMEOUT_INTERVAL = TEST_TIMEOUT;

// create a single instance of price-finder that will be used by e2e tests
const PriceFinder = require('../../lib/price-finder');
exports.priceFinder = new PriceFinder({
  retrySleepTime: RETRY_SLEEP_TIME,
});

exports.verifyPrice = function verifyPrice(price) {
  expect(price).toBeDefined();

  // we can't guarantee the price, so just make sure it's a number
  // that's more than -1
  expect(price).toBeGreaterThan(-1);
};

function verifyName(actualName, expectedName) {
  expect(actualName).toEqual(expectedName);
}

function verifyCategory(actualCategory, expectedCategory) {
  expect(actualCategory).toEqual(expectedCategory);
}

exports.verifyItemDetails = function verifyItemDetails(itemDetails, name, category) {
  expect(itemDetails).toBeDefined();

  if (itemDetails) {
    exports.verifyPrice(itemDetails.price);
    verifyName(itemDetails.name, name);
    verifyCategory(itemDetails.category, category);
  }
};
