'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

/*
 * These tests work with an API key and without. If we have an API key, then we
 * should use it in some of the tests to verify the API works. But we only want
 * to do that if it's available. We also want to (always) verify the default
 * scraping behavior without the API key.
 */

describe('price-finder for Best Buy URIs', () => {
  describe('attemping to verify the API (if API key is available)', () => {
    function waitForDone(done) {
      // if we're using the API, to avoid spamming, sleep a bit between tests
      setTimeout(() => done(), process.env.BESTBUY_KEY ? 5000 : 0);
    }

    // Music
    describe('testing a Music item', () => {
      // Queen: Greatest Hits
      const uri = 'https://www.bestbuy.com/site/greatest-hits-2-lp-lp-vinyl/5707458.p?skuId=5707458';

      it('should respond with a price for findItemPrice()', (done) => {
        priceFinder.findItemPrice(uri, (err, price) => {
          should(err).be.null();
          verifyPrice(price);
          waitForDone(done);
        });
      });

      it('should respond with a price, and the right category and name for findItemDetails()', (done) => {
        priceFinder.findItemDetails(uri, (err, itemDetails) => {
          should(err).be.null();
          verifyItemDetails(itemDetails, 'Greatest Hits [2 LP] [LP] - VINYL', 'Other');
          waitForDone(done);
        });
      });
    });
  });

  describe('verify scraping (without the use of the API)', () => {
    const EXISTING_ENV_KEY = process.env.BESTBUY_KEY;

    beforeEach(() => {
      process.env.BESTBUY_KEY = '';
    });

    afterEach(() => {
      process.env.BESTBUY_KEY = EXISTING_ENV_KEY;
    });

    // Video Games
    describe('testing a Video Games item', () => {
      // Legend of Zelda
      const uri = 'https://www.bestbuy.com/site/the-legend-of-zelda-breath-of-the-wild-nintendo-switch/5721500.p?skuId=5721500';

      it('should respond with a price, and the right category and name for findItemDetails()', (done) => {
        priceFinder.findItemDetails(uri, (err, itemDetails) => {
          should(err).be.null();
          verifyItemDetails(itemDetails, 'The Legend of Zelda: Breath of the Wild - Nintendo Switch', 'Other');
          done();
        });
      });
    });
  });
});
