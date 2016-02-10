'use strict';

// set the timeout of these tests to 10 seconds
jasmine.getEnv().defaultTimeoutInterval = 10000;

const PriceFinder = require('../../lib/price-finder');
const priceFinder = new PriceFinder();

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

describe('price-finder for Crutchfield Store URIs', () => {
  // Television & Video
  describe('testing a Television & Video item', () => {
    // Samsung Blu-ray Player
    const uri = 'http://www.crutchfield.com/p_305BDJ5700/Samsung-BD-J5700.html';

    it('should respond with a price for findItemPrice()', (done) => {
      priceFinder.findItemPrice(uri, (err, price) => {
        expect(err).toBeNull();
        verifyPrice(price);
        done();
      });
    });

    it('should respond with a price, and the right category and name for findItemDetails()', (done) => {
      priceFinder.findItemDetails(uri, (err, itemDetails) => {
        expect(err).toBeNull();
        expect(itemDetails).toBeDefined();

        verifyPrice(itemDetails.price);
        verifyName(itemDetails.name, 'Samsung BD-J5700');
        verifyCategory(itemDetails.category, 'Television & Video');

        done();
      });
    });
  });

  // Home Audio
  describe('testing a Home Audio item', () => {
    // Marantz Receiver
    const uri = 'http://www.crutchfield.com/p_642NR1504/Marantz-NR1504.html';

    it('should respond with a price for findItemPrice()', (done) => {
      priceFinder.findItemPrice(uri, (err, price) => {
        expect(err).toBeNull();
        verifyPrice(price);
        done();
      });
    });

    it('should respond with a price, and the right category and name for findItemDetails()', (done) => {
      priceFinder.findItemDetails(uri, (err, itemDetails) => {
        expect(err).toBeNull();
        expect(itemDetails).toBeDefined();

        verifyPrice(itemDetails.price);
        verifyName(itemDetails.name, 'Marantz NR1504');
        verifyCategory(itemDetails.category, 'Home Audio');

        done();
      });
    });
  });
});
