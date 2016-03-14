'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for PriceMinister Store URIs', () => {
  // Video Games
  describe('testing a Video Game item', () => {
    // Call Of Duty : Black Ops III sur PS4
    const uri = 'http://www.priceminister.com/offer/buy/999031035/call-of-duty-black-ops-iii.html';

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
        verifyItemDetails(itemDetails, 'Call of duty black ops iii', 'Video Games');
        done();
      });
    });
  });
});
