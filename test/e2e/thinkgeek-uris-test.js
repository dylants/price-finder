'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

describe('price-finder for Thinkgeek Store URIs', () => {
  describe('testing BB-8 Tea Set item', () => {
    const uri = 'http://www.thinkgeek.com/product/ivom/?pfm=HP_TopCMD_ivom';

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
        verifyItemDetails(itemDetails, 'BB-8 Tea Set', 'Other');
        done();
      });
    });
  });
});
