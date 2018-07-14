'use strict';

const should = require('should');
const testHelper = require('./test-helper');

const { priceFinder, verifyPrice, verifyItemDetails } = testHelper;

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
    // Sony Receiver
    const uri = 'http://www.crutchfield.com/p_158STDH770/Sony-STR-DH770.html?tp=179';

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
        verifyItemDetails(itemDetails, 'Sony STR-DH770', 'Home Audio');
        done();
      });
    });
  });
});
