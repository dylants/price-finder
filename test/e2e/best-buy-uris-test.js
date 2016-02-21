'use strict';

const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for Best Buy URIs', () => {
  it('should have the API key defined', (done) => {
    expect(process.env.BESTBUY_KEY).toBeDefined();
    done();
  });

  // Music
  describe('testing a Music item', () => {
    // Blues Brothers: Briefcase Full of Blues
    const uri = 'http://www.bestbuy.com/site/briefcase-full-of-blues-cd/17112312.p?id=1889657&skuId=17112312';

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
        verifyItemDetails(itemDetails, 'Briefcase Full of Blues - CD', 'Music');
        done();
      });
    });
  });

  // Movies & TV
  describe('testing a Movies & TV item', () => {
    // Ferris Bueller's Day Off
    const uri = 'http://www.bestbuy.com/site/ferris-buellers-day-off-dvd/7444513.p?id=47476&skuId=7444513';

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
        verifyItemDetails(itemDetails, 'Ferris Bueller\'s Day Off (DVD)', 'Movies & TV');
        done();
      });
    });
  });

  // Video Games
  describe('testing a Video Games item', () => {
    // Super Mario 3D Land
    const uri = 'http://www.bestbuy.com/site/super-mario-3d-land-nintendo-3ds/2809399.p?id=1218353391490&skuId=2809399';

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
        verifyItemDetails(itemDetails, 'Super Mario 3D Land - Nintendo 3DS', 'Video Games');
        done();
      });
    });
  });
});
