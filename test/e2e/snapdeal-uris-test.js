'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for Snapdeal Store URIs', () => {
  describe('testing item', () => {
    const uri = 'http://www.snapdeal.com/product/iphone-6s-16gb/663413326062';

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
        verifyItemDetails(itemDetails, 'iPhone 6s (16GB)', 'Mobile Phones');
        done();
      });
    });
  });
});
