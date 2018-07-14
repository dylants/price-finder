'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

describe('price-finder for GreenmanGaming Store URIs', () => {
  describe('testing Homefront: The Revolution item', () => {
    const uri = 'http://www.greenmangaming.com/s/in/en/pc/games/action/homefront-revolution/';

    xit('should respond with a price for findItemPrice()', (done) => {
      priceFinder.findItemPrice(uri, (err, price) => {
        should(err).be.null();
        verifyPrice(price);
        done();
      });
    });

    xit('should respond with a price, and the right category and name for findItemDetails()', (done) => {
      priceFinder.findItemDetails(uri, (err, itemDetails) => {
        should(err).be.null();
        verifyItemDetails(itemDetails, 'Homefront: The Revolution', 'Video Games');
        done();
      });
    });
  });
});
