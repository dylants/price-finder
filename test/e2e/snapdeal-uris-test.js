'use strict';

const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for Snapdeal Store URIs', () => {
  describe('testing Cheqqers Fashion PeachPuff Cotton Unstitched Dress Material item', () => {
    const uri = 'http://www.snapdeal.com/product/cheqqers-fashion-peachpuff-cotton-unstitched/649789962874';

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
        verifyItemDetails(itemDetails, 'Cheqqers Fashion PeachPuff Cotton Unstitched Dress Material', 'Other');
        done();
      });
    });
  });
});
