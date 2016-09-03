'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for Target Store URIs', () => {
  describe('testing Video Game item', () => {
    // Super Mario Maker Wii U
    const uri = 'http://www.target.com/p/super-mario-maker-nintendo-wii-u/-/A-47904515';

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
        verifyItemDetails(itemDetails, 'Super Mario Maker (Nintendo Wii U)', 'Video Game - Console Games');
        done();
      });
    });
  });
});
