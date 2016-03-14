'use strict';

const proxyquire = require('proxyquire').noCallThru();
const should = require('should');

const MODULE_PATH = '../../lib/price-finder';

function mockModule(request) {
  return proxyquire(MODULE_PATH, {
    superagent: request,
  });
}

describe('PriceFinder', () => {
  let PriceFinder;

  beforeEach(() => {
    PriceFinder = require(MODULE_PATH);
  });

  it('should exist', () => {
    should.exist(PriceFinder);
  });

  describe('default priceFinder with no options', () => {
    let priceFinder;

    beforeEach(() => {
      priceFinder = new PriceFinder();
    });

    it('should throw an exception in findItemPrice() when presented with an unsupported URI',
    (done) => {
      priceFinder.findItemPrice('www.bad_uri.bad', (error) => {
        should.exist(error);
        done();
      });
    });

    it('should throw an exception in findItemDetails() when presented with an unsupported URI',
    (done) => {
      priceFinder.findItemDetails('www.bad_uri.bad', (error) => {
        should.exist(error);
        done();
      });
    });
  });

  describe('with an Amazon URI and valid mock request data', () => {
    let priceFinder;

    const testPrice = 19.99;
    const testCategory = 'Books';
    const testName = 'The Expensive Cat in the Hat';

    beforeEach(() => {
      // set request to return a specific body
      const request = {
        get() {
          return this;
        },

        end(callback) {
          // setup valid response
          const response = {};
          response.statusCode = 200;

          // setup valid response text
          response.text = `<div id='actualPriceValue'>$${testPrice}</div>
              <div id='nav-subnav' data-category='books'>stuff</div>
              <div id='title'>${testName}</div>`;
          return callback(null, response);
        },
      };
      PriceFinder = mockModule(request);
      priceFinder = new PriceFinder();
    });

    it('should return the item price', (done) => {
      priceFinder.findItemPrice('http://www.amazon.com/product/cat-in-the-hat', (error, price) => {
        should(error).be.null();
        should(price).equal(testPrice);
        done();
      });
    });

    it('should return the item details', (done) => {
      priceFinder.findItemDetails('http://www.amazon.com/product/cat-in-the-hat', (error, itemDetails) => {
        should(error).be.null();

        should.exist(itemDetails);
        should.exist(itemDetails.price);
        should(itemDetails.price).equal(testPrice);
        should.exist(itemDetails.category);
        should(itemDetails.category).equal(testCategory);
        should.exist(itemDetails.name);
        should(itemDetails.name).equal(testName);
        done();
      });
    });
  });

  describe('with a valid URI and mock request data with status code 404', () => {
    let priceFinder;

    beforeEach(() => {
      // set request to return a specific body
      const request = {
        get() {
          return this;
        },

        end(callback) {
          // setup invalid response code
          const response = {};
          response.statusCode = 404;

          // setup valid response text
          response.text = 'Site Not Found';
          return callback(null, response);
        },
      };
      PriceFinder = mockModule(request);
      priceFinder = new PriceFinder();
    });

    it('should return an error for findItemPrice()', (done) => {
      priceFinder.findItemPrice('http://www.amazon.com/product/cat-in-the-hat', (error) => {
        should.exist(error);
        done();
      });
    });

    it('should return the item details', (done) => {
      priceFinder.findItemDetails('http://www.amazon.com/product/cat-in-the-hat', (error) => {
        should.exist(error);
        done();
      });
    });
  });

  describe('with a valid URI and invalid mock request data', () => {
    let priceFinder;

    beforeEach(() => {
      // set request to return a specific body
      const request = {
        get() {
          return this;
        },

        end(callback) {
          // setup valid response code
          const response = {};
          response.statusCode = 200;

          // setup invalid body
          response.text = '<h1>Nothin here</h1>';
          return callback(null, response);
        },
      };
      PriceFinder = mockModule(request);
      priceFinder = new PriceFinder();
    });

    it('should return an error for findItemPrice()', (done) => {
      priceFinder.findItemPrice('http://www.amazon.com/product/cat-in-the-hat', (error) => {
        should.exist(error);
        done();
      });
    });

    it('should return the item details', (done) => {
      priceFinder.findItemDetails('http://www.amazon.com/product/cat-in-the-hat', (error) => {
        should.exist(error);
        done();
      });
    });
  });

  describe('with no options supplied', () => {
    let priceFinder;

    beforeEach(() => {
      priceFinder = new PriceFinder();
    });

    it('should have the default options set', () => {
      const config = priceFinder._config;
      should.exist(config);
      should(config.retryStatusCodes).deepEqual([503]);
    });
  });

  describe('with options supplied', () => {
    it('should use the correct options', () => {
      const retryStatusCodes = [300, 301, 302];
      const retrySleepTime = 4000;
      let priceFinder;

      // override some, but not all...
      priceFinder = new PriceFinder({
        retrySleepTime,
      });
      should(priceFinder._config.retryStatusCodes).deepEqual([503]);
      should(priceFinder._config.retrySleepTime).equal(retrySleepTime);

      // override all
      priceFinder = new PriceFinder({
        retryStatusCodes,
        retrySleepTime,
      });
      should(priceFinder._config.retryStatusCodes).equal(retryStatusCodes);
      should(priceFinder._config.retrySleepTime).equal(retrySleepTime);
    });
  });
});
