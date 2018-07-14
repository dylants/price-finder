'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

describe('price-finder for Nintendo URIs', () => {
  // Wii U
  describe('testing a Wii U item', () => {
    // New Super Mario Bros. U
    const uri = 'https://www.nintendo.com/games/detail/new-super-mario-bros-u-wii-u';

    it('should respond with a price for findItemPrice()', (done) => {
      priceFinder.findItemPrice(uri, (err, price) => {
        should(err).be.null();
        verifyPrice(price);
        done();
      });
    });

    it('should respond with a price, and the right category and name for findItemDetails()', (done) => {
      priceFinder.findItemDetails(uri, (err, itemDetails) => {
        should(err).be.null();
        verifyItemDetails(itemDetails, 'New Super Mario Bros. U', 'Video Games');
        done();
      });
    });
  });
});
