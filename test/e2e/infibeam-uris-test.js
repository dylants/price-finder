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

describe('price-finder for Infibeam Store URIs', () => {
  describe('testing [ENTER ITEM NAME HERE] item', () => {
    // TODO provide URI and contents for test here!
    const uri = 'http://www.infibeam.com/Home_Entertainment/sansui-sjx22fb-full-hd-led-tv/P-hoen-68091831042-cat-z.html#variantId=P-hoen-60492354794';

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
        verifyName(itemDetails.name, 'Sansui SJX22FB Full HD LED TV');
        verifyCategory(itemDetails.category, 'Electronics');

        done();
      });
    });
  });
});
