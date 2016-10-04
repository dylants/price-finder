'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

/*
 * TODO Skip the tests until we can work out Flipkart's problems
 * See:
 * https://github.com/dylants/price-finder/issues/98
 * https://github.com/dylants/price-finder/issues/106
 */
describe.skip('price-finder for Flipkart Store URIs', () => {
  describe('testing Nexus 6 item', () => {
    const uri = 'https://www.flipkart.com/apple-iphone-6/p/itme8dvfeuxxbm4r?pid=MOBEYHZ2YAXZMF2J';

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
        verifyItemDetails(itemDetails,
          'Apple iPhone 6 (Space Grey, 16 GB) | Buy Apple iPhone 6 (Space Grey, 16 GB) Mobile Phone Online at Best Price in India | Flipkart.com',
          'Other');
        done();
      });
    });
  });
});
