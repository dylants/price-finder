'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

describe('price-finder for Google Play URIs', () => {
  // Digital Music
  describe('testing a Digital Music item', () => {
    // Atoms for Peace : Amok
    const uri = 'https://play.google.com/store/music/album/Atoms_For_Peace_AMOK?id=Be75bldondlktwhxyhnehpk6ozu';

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
        verifyItemDetails(itemDetails, 'AMOK', 'Digital Music');
        done();
      });
    });
  });
});
