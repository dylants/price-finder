'use strict';

const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for GreenmanGaming Store URIs', () => {
  describe('testing Homefront: The Revolution item', () => {
    const uri = 'http://www.greenmangaming.com/s/in/en/pc/games/action/homefront-revolution/';

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
        verifyItemDetails(itemDetails, 'Homefront: The Revolution item', 'Video Games');
        done();
      });
    });
  });
});
