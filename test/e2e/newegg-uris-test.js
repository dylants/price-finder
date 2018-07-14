'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

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
        should(err).be.null();
        verifyPrice(price);
        done();
      });
    });

    it('should respond with a price, and the right category and name for findItemDetails()', (done) => {
      priceFinder.findItemDetails(uri, (err, itemDetails) => {
        should(err).be.null();
        verifyItemDetails(itemDetails, 'ZTE AXON Unlocked Smartphone, 32GB '
          + 'Storage 2GB RAM, 5.5" Gold Color (North America Warranty)',
        'Mobile Phones');
        done();
      });
    });
  });
});
