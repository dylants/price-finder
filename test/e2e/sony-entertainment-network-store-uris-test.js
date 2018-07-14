'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

describe('price-finder for Sony Entertainment Network Store URIs', () => {
  // Video Games
  describe('testing a Video Game item', () => {
    // PixelJunk™ Monsters
    const uri = 'https://store.playstation.com/#!/en-us/games/pixeljunk-monsters/cid=UP9000-NPUA80108_00-PJMONSTSFULL0001';

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
        verifyItemDetails(itemDetails, 'PixelJunk™ Monsters', 'Video Games');
        done();
      });
    });
  });
});
