'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

describe('price-finder for Walmart Store URIs', () => {
  describe('testing Intel Core i5-4690K Processor item', () => {
    const uri = 'http://www.walmart.com/ip/Intel-Core-i5-4690K-Processor-Quad-Core-3.5GHz-6M-Cache-up-to-3.90-GHz-2-Memory-Channels-16-Max-PCI-Express-Lane/41996623';

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
        verifyItemDetails(itemDetails, 'Intel Core i5-4690K Processor', 'Other');
        done();
      });
    });
  });
});
