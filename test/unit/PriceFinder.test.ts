import PriceFinder from '../../src/PriceFinder';
import nock from 'nock';

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

    it('should throw an exception in findItemPrice() when presented with an unsupported URI', async () => {
      expect(
        async () => await priceFinder.findItemPrice('www.bad_uri.bad'),
      ).rejects.toThrow();
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
          .reply(
            200,
            `<input id='twister-plus-price-data-price' value='${testPrice}'>`,
          );
      });

      it('should return the item price', async () => {
        const price = await priceFinder.findItemPrice(
          'http://www.amazon.com/product/cat-in-the-hat',
        );
        expect(price).toEqual(testPrice);
      });
    });

    describe('when the response status code is 404', () => {
      beforeEach(() => {
        nock('http://www.amazon.com').get('/product/cat-in-the-hat').reply(404);
      });

      it('should return an error for findItemPrice()', async () => {
        expect(
          async () =>
            await priceFinder.findItemPrice(
              'http://www.amazon.com/product/cat-in-the-hat',
            ),
        ).rejects.toThrow();
      });
    });

    describe('with a valid URI and invalid mock request data', () => {
      beforeEach(() => {
        nock('http://www.amazon.com')
          .get('/product/cat-in-the-hat')
          .reply(200, '<h1>Nothin here</h1>');
      });

      it('should return an error for findItemPrice()', async () => {
        expect(
          async () =>
            await priceFinder.findItemPrice(
              'http://www.amazon.com/product/cat-in-the-hat',
            ),
        ).rejects.toThrowError();
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
