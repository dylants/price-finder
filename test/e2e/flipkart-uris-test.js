'use strict';

const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for Flipkart Store URIs', () => {
  describe('testing Nexus 6 item', () => {
    const uri = 'http://www.flipkart.com/apple-iphone-6/p/itme8dvfeuxxbm4r?pid=MOBEYHZ2YAXZMF2J';

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
        verifyItemDetails(itemDetails, 'Apple iPhone 6', 'Other');
        done();
      });
    });
  });
});
