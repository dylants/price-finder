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
 * I've seen some CAPTCHA's from NewEgg if you hit them too much too often,
 * so be fairly easy here. We need to try to hit the balance of testing that
 * the code works for NewEgg, while not testing *too* much that CAPTCHA's
 * are thrown and the tests fail (and our IP is blacklisted).
 */
describe('price-finder for NewEgg URIs', () => {
  // Digital Music
  describe('testing a Mobile Phone item', () => {
    // Atoms for Peace : Amok
    const uri = 'http://www.newegg.com/Product/Product.aspx?Item=N82E16875705040&cm_sp=Homepage_FDD-_-P1_75-705-040-_-02162016';

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
        verifyName(itemDetails.name, 'Axon by ZTE Unlocked GSM, 5.5", Qualcomm Snapdragon 801 2.4 GHz Quad-Core, 2GB Ram, ' +
          '32GB Rom, 4G/LTE, JBL E13 Headphones in package - Gold');
        verifyCategory(itemDetails.category, 'Mobile Phones');

        done();
      });
    });
  });
});
