'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

describe('price-finder for GameStop Store URIs', () => {
  // Video Games
  describe('testing a Video Game item', () => {
    // Mario Kart 8
    const uri = 'https://www.gamestop.com/wii-u/games/mario-kart-8/113373';

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
        verifyItemDetails(itemDetails, 'Mario Kart 8', 'Video Games');
        done();
      });
    });
  });
});
