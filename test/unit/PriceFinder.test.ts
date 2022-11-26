import nock from 'nock';
import PriceFinder from '../../src/PriceFinder';

describe('PriceFinder', () => {
  let priceFinder: PriceFinder;
  beforeAll(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe('default priceFinder with no options', () => {
    beforeEach(() => {
      priceFinder = new PriceFinder();
    });

    it('should throw an exception in findItemPrice() when presented with an unsupported URI', (done) => {
      priceFinder.findItemPrice('www.bad_uri.bad', (error) => {
        expect(error).toBeDefined();
        done();
      });
    });

    it('should have the default options set', () => {
      const config = priceFinder.config;
      expect(config).toBeDefined();
      expect(config.retrySleepTime).toEqual(1000);
      expect(config.retryStatusCodes).toEqual([503]);
    });

    describe('with an Amazon URI and valid mock request data', () => {
      const testPrice = 19.99;

      beforeEach(() => {
        // set request to return a specific body
        nock('http://www.amazon.com')
          .get('/product/cat-in-the-hat')
          .reply(200, `<div id='actualPriceValue'>$${testPrice}</div>`);
      });

      it('should return the item price', (done) => {
        priceFinder.findItemPrice(
          'http://www.amazon.com/product/cat-in-the-hat',
          (error, price) => {
            expect(error).toBeNull();
            expect(price).toEqual(testPrice);
            done();
          }
        );
      });
    });

    describe('when the response status code is 404', () => {
      beforeEach(() => {
        nock('http://www.amazon.com').get('/product/cat-in-the-hat').reply(404);
      });

      it('should return an error for findItemPrice()', (done) => {
        priceFinder.findItemPrice(
          'http://www.amazon.com/product/cat-in-the-hat',
          (error) => {
            expect(error).toBeDefined();
            done();
          }
        );
      });
    });

    describe('with a valid URI and invalid mock request data', () => {
      beforeEach(() => {
        nock('http://www.amazon.com')
          .get('/product/cat-in-the-hat')
          .reply(200, '<h1>Nothin here</h1>');
      });

      it('should return an error for findItemPrice()', (done) => {
        priceFinder.findItemPrice(
          'http://www.amazon.com/product/cat-in-the-hat',
          (error) => {
            expect(error).toBeDefined();
            done();
          }
        );
      });
    });
  });

  describe('with options supplied', () => {
    it('should use the correct options', () => {
      const retryStatusCodes = [300, 301, 302];
      const retrySleepTime = 4000;

      // override some, but not all...
      priceFinder = new PriceFinder({
        retrySleepTime,
      });
      expect(priceFinder.config.retryStatusCodes).toEqual([503]);
      expect(priceFinder.config.retrySleepTime).toEqual(retrySleepTime);

      // override all
      priceFinder = new PriceFinder({
        retrySleepTime,
        retryStatusCodes,
      });
      expect(priceFinder.config.retryStatusCodes).toEqual(retryStatusCodes);
      expect(priceFinder.config.retrySleepTime).toEqual(retrySleepTime);
    });
  });
});
