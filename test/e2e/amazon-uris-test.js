'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

/*
 * I've seen some CAPTCHA's from Amazon if you hit them too much too often,
 * so be fairly easy here. We need to try to hit the balance of testing that
 * the code works for Amazon, while not testing *too* much that CAPTCHA's
 * are thrown and the tests fail (and our IP is blacklisted).
 */
describe('price-finder for Amazon URIs', () => {
  // Digital Music
  describe('testing a Digital Music item', () => {
    // Coldplay: A Rush of Blood to the Head
    const uri = 'https://www.amazon.com/gp/product/B00KHEHEGM';

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
        verifyItemDetails(itemDetails, 'Coldplay: A Rush of Blood to the Head', 'Digital Music');
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
        should(err).be.null();
        verifyItemDetails(itemDetails, 'Pikmin 3', 'Video Games');
        done();
      });
    });
  });

  // Mobile Apps
  describe('testing a Mobile Apps item', () => {
    // Minecraft
    const uri = 'http://www.amazon.com/gp/product/B00992CF6W';

    it('should respond with a price for findItemPrice()', (done) => {
      priceFinder.findItemPrice(uri, (err, price) => {
        should(err).be.null();
        verifyPrice(price);
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
        should(err).be.null();
        verifyItemDetails(itemDetails, 'The Blues Brothers', 'Movies & TV');
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
        should(err).be.null();
        verifyItemDetails(itemDetails, 'Origins: Fourteen Billion Years of Cosmic Evolution', 'Books');
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
        should(err).be.null();

        // Amazon reports 'apparel' for luggage, so we default to 'other'
        verifyItemDetails(itemDetails, 'eBags TLS Mother Lode Mini 21" Wheeled Duffel Bag Luggage - Carry-On', 'Other');
        done();
      });
    });
  });
});
