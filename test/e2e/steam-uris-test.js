'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

describe('price-finder for Steam Store URIs', () => {
  describe('testing a Video Game item', () => {
    // Don't Starve
    const uri = 'http://store.steampowered.com/app/219740/';

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
        verifyItemDetails(itemDetails, 'Don\'t Starve', 'Video Games');
        done();
      });
    });
  });
});
