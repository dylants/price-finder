'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for Nintendo URIs', () => {
  // Wii U
  describe('testing a Wii U item', () => {
    // New Super Mario Bros. U
    const uri = 'https://www.nintendo.com/games/detail/hf_6AALqLd22OOdNFfAmJVGEfQ7pTpke';

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

  // 3DS
  describe('testing a 3DS item', () => {
    // Super Smash Bros.
    const uri = 'https://www.nintendo.com/games/detail/zC34HnrON-_wV0ZUkSfQFC6ub3Ea8DQ6';

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
        verifyItemDetails(itemDetails, 'Super Smash Bros.', 'Video Games');
        done();
      });
    });
  });
});
