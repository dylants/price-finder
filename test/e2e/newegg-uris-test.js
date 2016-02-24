'use strict';

const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

/*
 * I've seen some CAPTCHA's from NewEgg if you hit them too much too often,
 * so be fairly easy here. We need to try to hit the balance of testing that
 * the code works for NewEgg, while not testing *too* much that CAPTCHA's
 * are thrown and the tests fail (and our IP is blacklisted).
 */
describe('price-finder for NewEgg URIs', () => {
  describe('testing a Mobile Phone item', () => {
    const uri = 'http://www.newegg.com/Product/Product.aspx?Item=N82E16875705040';

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
        verifyItemDetails(itemDetails, 'Axon - ZTE Unlocked Smartphone, 5.5" ' +
          'Qualcomm Snapdragon 801, 2GB RAM, 4G LTE, Quick-charge 2.0 - 32GB Gold',
          'Mobile Phones');
        done();
      });
    });
  });
});
