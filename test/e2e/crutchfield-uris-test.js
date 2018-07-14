'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

describe('price-finder for Crutchfield Store URIs', () => {
  // Television & Video
  describe('testing a Television & Video item', () => {
    // Samsung Blu-ray Player
    const uri = 'https://www.crutchfield.com/p_305BDJ5700/Samsung-BD-J5700.html';

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
    // Sony Receiver
    const uri = 'https://www.crutchfield.com/p_158STDH790/Sony-STR-DH790.html';

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
        verifyItemDetails(itemDetails, 'Sony STR-DH790', 'Home Audio');
        done();
      });
    });
  });
});
