'use strict';

const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for PriceMinister Store URIs', () => {
  // Video Games
  describe('testing a Video Game item', () => {
    // Grand Theft Auto IV sur PS3
    const uri = 'http://www.priceminister.com/mfp/2001701/gta-4-jeu-video#pid=63080574';

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
        verifyItemDetails(itemDetails, 'Gta 4 jeu video', 'Video Games');
        done();
      });
    });
  });
});
