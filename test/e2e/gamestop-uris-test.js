'use strict';

const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for GameStop Store URIs', () => {
  // Video Games
  describe('testing a Video Game item', () => {
    // Mario Kart 8
    const uri = 'http://www.gamestop.com/wii-u/games/mario-kart-8/113373';

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
        verifyItemDetails(itemDetails, 'Mario Kart 8', 'Video Games');
        done();
      });
    });
  });
});
