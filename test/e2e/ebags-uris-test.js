'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

describe('price-finder for eBags Store URIs', () => {
  // Luggage
  describe('testing a Luggage item', () => {
    // TLS Mother Lode
    const uri = 'http://www.ebags.com/product/ebags/mother-lode-tls-mini-21-wheeled-duffel/125538?productid=1325216';

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
        verifyItemDetails(itemDetails, 'TLS Mother Lode Mini 21" Wheeled Carry-On Duffel', 'Luggage');
        done();
      });
    });
  });
});
