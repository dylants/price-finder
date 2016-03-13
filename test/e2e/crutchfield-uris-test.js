'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const priceFinder = testHelper.priceFinder;
const verifyPrice = testHelper.verifyPrice;
const verifyItemDetails = testHelper.verifyItemDetails;

describe('price-finder for Crutchfield Store URIs', () => {
  // Television & Video
  describe('testing a Television & Video item', () => {
    // Samsung Blu-ray Player
    const uri = 'http://www.crutchfield.com/p_305BDJ5700/Samsung-BD-J5700.html';

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
        verifyItemDetails(itemDetails, 'Samsung BD-J5700', 'Television & Video');
        done();
      });
    });
  });

  // Home Audio
  describe('testing a Home Audio item', () => {
    // Marantz Receiver
    const uri = 'http://www.crutchfield.com/p_642NR1504/Marantz-NR1504.html';

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
        verifyItemDetails(itemDetails, 'Marantz NR1504', 'Home Audio');
        done();
      });
    });
  });
});
