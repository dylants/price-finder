'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

describe('price-finder for Snapdeal Store URIs', () => {
  describe('testing item', () => {
    const uri = 'https://www.snapdeal.com/product/apple-iphone-7-32gb-gold/626098478748';

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
        verifyItemDetails(itemDetails, '\n   \t\t\tApple iPhone 7 ( 32GB , 2 GB ) Black', 'Mobile Phones');
        done();
      });
    });
  });
});
