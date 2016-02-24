'use strict';

const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for Google Play URIs', () => {
  // Digital Music
  describe('testing a Digital Music item', () => {
    // Atoms for Peace : Amok
    const uri = 'https://play.google.com/store/music/album/Atoms_For_Peace_AMOK?id=Be75bldondlktwhxyhnehpk6ozu';

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
        verifyItemDetails(itemDetails, 'AMOK', 'Digital Music');
        done();
      });
    });
  });

  // Movies & TV
  describe('testing a Movies & TV item', () => {
    // Big
    const uri = 'https://play.google.com/store/movies/details/Big?id=uBohu3ZBg9g';

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
        verifyItemDetails(itemDetails, 'Big', 'Movies & TV');
        done();
      });
    });
  });

  // Mobile Apps
  describe('testing a Mobile Apps item', () => {
    // Plants vs Zombies
    const uri = 'https://play.google.com/store/apps/details?id=com.popcap.pvz_na';

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
        verifyItemDetails(itemDetails, 'Plants vs. Zombies™', 'Mobile Apps');
        done();
      });
    });
  });
});
