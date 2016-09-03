'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for PriceMinister Store URIs', () => {
  // Video Games
  describe('testing a Video Game item', () => {
    // Uncharted 4
    const uri = 'http://www.priceminister.com/mfp/5458480/uncharted-4-a-thief-s-end?pid=563103245';

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
        verifyItemDetails(itemDetails, 'Uncharted 4: A Thief\'s End', 'Video Games');
        done();
      });
    });
  });
});
