'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

xdescribe('price-finder for Infibeam Store URIs', () => {
  describe('testing Sansui SJX22FB Full HD LED TV item', () => {
    const uri = 'http://www.infibeam.com/Home_Entertainment/sansui-sjx22fb-full-hd-led-tv/P-hoen-68091831042-cat-z.html#variantId=P-hoen-60492354794';

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
        verifyItemDetails(itemDetails, 'Sansui SJX22FB Full HD LED TV', 'Electronics');
        done();
      });
    });
  });
});
