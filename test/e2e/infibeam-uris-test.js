'use strict';

const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for Infibeam Store URIs', () => {
  describe('testing Sansui SJX22FB Full HD LED TV item', () => {
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
        verifyItemDetails(itemDetails, 'Sansui SJX22FB Full HD LED TV', 'Electronics');
        done();
      });
    });
  });
});
