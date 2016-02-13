'use strict';

const rewire = require('rewire');
const PriceFinder = rewire('../../lib/price-finder');

describe('PriceFinder', () => {
  it('should exist', () => {
    expect(PriceFinder).toBeDefined();
  });

  describe('default priceFinder with no options', () => {
    let priceFinder;

    beforeEach(() => {
      priceFinder = new PriceFinder();
    });

    it('should throw an exception in findItemPrice() when presented with an unsupported URI',
    (done) => {
      priceFinder.findItemPrice('www.bad_uri.bad', (error) => {
        expect(error).toBeDefined();
        done();
      });
    });

    it('should throw an exception in findItemDetails() when presented with an unsupported URI',
    (done) => {
      priceFinder.findItemDetails('www.bad_uri.bad', (error) => {
        expect(error).toBeDefined();
        done();
      });
    });
  });

  describe('with an Amazon URI and valid mock request data', () => {
    let _request;
    let priceFinder;

    const testPrice = 19.99;
    const testCategory = 'Books';
    const testName = 'The Expensive Cat in the Hat';

    beforeEach(() => {
      // save off the request
      _request = PriceFinder.__get__('request');

      // set request to return a specific body
      PriceFinder.__set__('request', (options, callback) => {
        // setup valid response
        const response = {};
        response.statusCode = 200;

        // setup valid body
        const body = `<div id='actualPriceValue'>$${testPrice}</div>
            <div id='nav-subnav' data-category='books'>stuff</div>
            <div id='title'>${testName}</div>`;
        callback(null, response, body);
      });

      priceFinder = new PriceFinder();
    });

    it('should return the item price', (done) => {
      priceFinder.findItemPrice('http://www.amazon.com/product/cat-in-the-hat', (error, price) => {
        expect(error).toBeNull();
        expect(price).toEqual(testPrice);
        done();
      });
    });

    it('should return the item details', (done) => {
      priceFinder.findItemDetails('http://www.amazon.com/product/cat-in-the-hat', (error, itemDetails) => {
        expect(error).toBe(null);

        expect(itemDetails).toBeDefined();
        expect(itemDetails.price).toBeDefined();
        expect(itemDetails.price).toEqual(testPrice);
        expect(itemDetails.category).toBeDefined();
        expect(itemDetails.category).toEqual(testCategory);
        expect(itemDetails.name).toBeDefined();
        expect(itemDetails.name).toEqual(testName);
        done();
      });
    });

    afterEach(() => {
      PriceFinder.__set__('request', _request);
    });
  });

  describe('with a valid URI and mock request data with status code 404', () => {
    let _request;
    let priceFinder;

    beforeEach(() => {
      // save off the request
      _request = PriceFinder.__get__('request');

      // set request to return a specific body
      PriceFinder.__set__('request', (options, callback) => {
        // setup invalid response code
        const response = {};
        response.statusCode = 404;

        // setup valid body
        const body = 'Site Not Found';
        callback(null, response, body);
      });

      priceFinder = new PriceFinder();
    });

    it('should return an error for findItemPrice()', (done) => {
      priceFinder.findItemPrice('http://www.amazon.com/product/cat-in-the-hat', (error) => {
        expect(error).toBeDefined();
        done();
      });
    });

    it('should return the item details', (done) => {
      priceFinder.findItemDetails('http://www.amazon.com/product/cat-in-the-hat', (error) => {
        expect(error).toBeDefined();
        done();
      });
    });

    afterEach(() => {
      PriceFinder.__set__('request', _request);
    });
  });

  describe('with a valid URI and invalid mock request data', () => {
    let _request;
    let priceFinder;

    beforeEach(() => {
      // save off the request
      _request = PriceFinder.__get__('request');

      // set request to return a specific body
      PriceFinder.__set__('request', (options, callback) => {
        // setup invalid response code
        const response = {};
        response.statusCode = 200;

        // setup valid body
        const body = '<h1>Nothin here</h1>';
        callback(null, response, body);
      });

      priceFinder = new PriceFinder();
    });

    it('should return an error for findItemPrice()', (done) => {
      priceFinder.findItemPrice('http://www.amazon.com/product/cat-in-the-hat', (error) => {
        expect(error).toBeDefined();
        done();
      });
    });

    it('should return the item details', (done) => {
      priceFinder.findItemDetails('http://www.amazon.com/product/cat-in-the-hat', (error) => {
        expect(error).toBeDefined();
        done();
      });
    });

    afterEach(() => {
      PriceFinder.__set__('request', _request);
    });
  });

  describe('with no options supplied', () => {
    let priceFinder;

    beforeEach(() => {
      priceFinder = new PriceFinder();
    });

    it('should have the default options set', () => {
      const config = priceFinder._config;
      expect(config).toBeDefined();
      expect(config.headers).toEqual({
        'User-Agent': 'Mozilla/5.0',
      });
      expect(config.retryStatusCodes).toEqual([503]);
    });
  });

  describe('with options supplied', () => {
    it('should use the correct options', () => {
      const headers = '123';
      const retryStatusCodes = [300, 301, 302];
      const retrySleepTime = 4000;
      let priceFinder;

      // override some, but not all...
      priceFinder = new PriceFinder({
        headers,
      });
      expect(priceFinder._config.headers).toEqual(headers);
      expect(priceFinder._config.retryStatusCodes).toEqual([503]);
      expect(priceFinder._config.retrySleepTime).toEqual(1000);

      // override all
      priceFinder = new PriceFinder({
        headers,
        retryStatusCodes,
        retrySleepTime,
      });
      expect(priceFinder._config.headers).toEqual(headers);
      expect(priceFinder._config.retryStatusCodes).toEqual(retryStatusCodes);
      expect(priceFinder._config.retrySleepTime).toEqual(retrySleepTime);
    });
  });
});
