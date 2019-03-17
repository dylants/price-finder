'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

describe('price-finder for Crutchfield Store URIs', () => {
  describe('testing an item', () => {
    // Sony Blu-ray Player
    const uri = 'https://www.crutchfield.com/p_158BDP3700/Sony-BDP-S3700.html';

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
        verifyItemDetails(itemDetails, 'Sony BDP-S3700', 'Television & Video');
        done();
      });
    });
  });
});
