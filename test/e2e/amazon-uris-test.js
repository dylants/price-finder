'use strict';

// set the timeout of these tests to 10 seconds
jasmine.getEnv().defaultTimeoutInterval = 10000;

const PriceFinder = require('../../lib/price-finder');
const priceFinder = new PriceFinder();

function verifyPrice(price) {
  expect(price).toBeDefined();
  // we can't guarantee the price, so just make sure it's a number
  // that's more than -1
  expect(price).toBeGreaterThan(-1);
}

function verifyName(actualName, expectedName) {
  expect(actualName).toEqual(expectedName);
}

function verifyCategory(actualCategory, expectedCategory) {
  expect(actualCategory).toEqual(expectedCategory);
}

/*
 * I've seen some CAPTCHA's from Amazon if you hit them too much too often,
 * so be fairly easy here. We need to try to hit the balance of testing that
 * the code works for Amazon, while not testing *too* much that CAPTCHA's
 * are thrown and the tests fail (and our IP is blacklisted).
 */
describe('price-finder for Amazon URIs', () => {
  // Digital Music
  describe('testing a Digital Music item', () => {
    // Atoms for Peace : Amok
    const uri = 'http://www.amazon.com/Amok/dp/B00BIQ1EL4';

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
        expect(itemDetails).toBeDefined();

        verifyPrice(itemDetails.price);
        verifyName(itemDetails.name, 'Atoms For Peace: Amok');
        verifyCategory(itemDetails.category, 'Digital Music');

        done();
      });
    });
  });

  /*
   * The remainder just test findItemDetails() to avoid too many hits to Amazon
   */

  // Video Games
  describe('testing a Video Games item', () => {
    // Pikmin 3 Wii U
    const uri = 'http://www.amazon.com/Pikmin-3-Nintendo-Wii-U/dp/B0050SWBAE';

    it('should respond with a price, and the right category and name for findItemDetails()', (done) => {
      priceFinder.findItemDetails(uri, (err, itemDetails) => {
        expect(err).toBeNull();
        expect(itemDetails).toBeDefined();

        verifyPrice(itemDetails.price);
        verifyName(itemDetails.name, 'Pikmin 3');
        verifyCategory(itemDetails.category, 'Video Games');

        done();
      });
    });
  });

  // Mobile Apps
  describe('testing a Mobile Apps item', () => {
    // Minecraft
    const uri = 'http://www.amazon.com/Mojang-Minecraft-Pocket-Edition/dp/B00992CF6W';

    it('should respond with a price, and the right category and name for findItemDetails()', (done) => {
      priceFinder.findItemDetails(uri, (err, itemDetails) => {
        expect(err).toBeNull();
        expect(itemDetails).toBeDefined();

        verifyPrice(itemDetails.price);
        verifyName(itemDetails.name, 'Minecraft - Pocket Edition');
        verifyCategory(itemDetails.category, 'Mobile Apps');

        done();
      });
    });
  });

  // Movies & TV
  describe('testing a Movies & TV item', () => {
    // Blues Brothers
    const uri = 'http://www.amazon.com/product/dp/B001AQO446';

    it('should respond with a price, and the right category and name for findItemDetails()', (done) => {
      priceFinder.findItemDetails(uri, (err, itemDetails) => {
        expect(err).toBeNull();
        expect(itemDetails).toBeDefined();

        verifyPrice(itemDetails.price);
        verifyName(itemDetails.name, 'The Blues Brothers [Blu-ray]');
        verifyCategory(itemDetails.category, 'Movies & TV');

        done();
      });
    });
  });

  // Books
  describe('testing a Books item', () => {
    // Origins / Neil deGrasse Tyson
    const uri = 'http://www.amazon.com/Origins-Fourteen-Billion-Cosmic-Evolution/dp/0393350398';

    it('should respond with a price, and the right category and name for findItemDetails()', (done) => {
      priceFinder.findItemDetails(uri, (err, itemDetails) => {
        expect(err).toBeNull();
        expect(itemDetails).toBeDefined();

        verifyPrice(itemDetails.price);
        verifyName(itemDetails.name, 'Origins: Fourteen Billion Years of Cosmic Evolution');
        verifyCategory(itemDetails.category, 'Books');

        done();
      });
    });
  });

  // Luggage
  describe('testing a Luggage item', () => {
    // eBags
    const uri = 'http://www.amazon.com/eBags-Mother-Wheeled-Duffel-Yonder/dp/B001N85VMK';

    it('should respond with a price, and the right category and name for findItemDetails()', (done) => {
      priceFinder.findItemDetails(uri, (err, itemDetails) => {
        expect(err).toBeNull();
        expect(itemDetails).toBeDefined();

        verifyPrice(itemDetails.price);
        verifyName(itemDetails.name, 'eBags TLS Mother Lode Mini 21" Wheeled Duffel');
        // Amazon reports 'apparel' for luggage, so we default to 'other'
        verifyCategory(itemDetails.category, 'Other');

        done();
      });
    });
  });
});
