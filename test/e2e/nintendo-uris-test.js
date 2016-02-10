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

describe('price-finder for Nintendo URIs', () => {
  // Wii U
  describe('testing a Wii U item', () => {
    // New Super Mario Bros. U
    const uri = 'https://www.nintendo.com/games/detail/hf_6AALqLd22OOdNFfAmJVGEfQ7pTpke';

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
        verifyName(itemDetails.name, 'New Super Mario Bros. U');
        verifyCategory(itemDetails.category, 'Video Games');

        done();
      });
    });
  });

  // 3DS
  describe('testing a 3DS item', () => {
    // Super Smash Bros.
    const uri = 'https://www.nintendo.com/games/detail/zC34HnrON-_wV0ZUkSfQFC6ub3Ea8DQ6';

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
        verifyName(itemDetails.name, 'Super Smash Bros.');
        verifyCategory(itemDetails.category, 'Video Games');

        done();
      });
    });
  });
});
