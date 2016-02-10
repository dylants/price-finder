'use strict';

const BestBuySite = require('../../../lib/sites/best-buy');
const siteUtils = require('../../../lib/site-utils');

const VALID_URI = 'http://www.bestbuy.com/site/product?skuId=123';
const INVALID_URI = 'http://www.bad.com/123/product';
const TRANSLATED_URI = 'https://api.remix.bestbuy.com/v1/products/123.json?show=sku,name,salePrice,categoryPath&apiKey=junkKey';
const CONFIG = { keys: { bestbuy: 'junkKey' } };

describe('The Best Buy Site', () => {
  it('should exist', () => {
    expect(BestBuySite).toBeDefined();
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(BestBuySite.isSite(VALID_URI)).toBeTruthy();
    });

    it('should return false for a bad site', () => {
      expect(BestBuySite.isSite(INVALID_URI)).toBeFalsy();
    });
  });

  it('should throw an exception trying to create a new BestBuySite with an incorrect uri', () => {
    expect(() => {
      /* eslint-disable no-new */
      new BestBuySite(INVALID_URI, CONFIG);
      /* eslint-enable no-new */
    }).toThrow();
  });

  it('should throw an exception trying to create a new BestBuySite without an API key', () => {
    expect(() => {
      /* eslint-disable no-new */
      new BestBuySite(VALID_URI, {});
      /* eslint-enable no-new */
    }).toThrow();
  });

  describe('with an API key in the environment', () => {
    beforeEach(() => {
      process.env.BESTBUY_KEY = '123';
    });

    afterEach(() => {
      process.env.BESTBUY_KEY = '';
    });

    it('should throw an exception trying to create a new BestBuySite without an API key', () => {
      expect(() => {
        /* eslint-disable no-new */
        new BestBuySite(VALID_URI, {});
        /* eslint-enable no-new */
      }).not.toThrow();
    });
  });

  describe('a new Best Buy Site', () => {
    let bestBuy;

    beforeEach(() => {
      bestBuy = new BestBuySite(VALID_URI, CONFIG);
    });

    it('should exist', () => {
      expect(bestBuy).toBeDefined();
    });

    it('should return the translated URI for getURIForPageData()', () => {
      expect(bestBuy.getURIForPageData()).toEqual(TRANSLATED_URI);
    });

    it('should return false for isJSON()', () => {
      expect(bestBuy.isJSON()).toBeTruthy();
    });

    describe('with a populated page', () => {
      let $;
      let bad$;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 9.99;
        category = siteUtils.categories.MOVIES_TV;
        name = 'The Blues Brothers';

        $ = require('./mock-data/bestbuy.full.json');
        try {
          bad$ = JSON.parse('<h1>Developer Inactive</h1>');
        } catch (err) {
          // do nothing
        }
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = bestBuy.findPriceOnPage($);
        expect(priceFound).toEqual(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = bestBuy.findPriceOnPage(bad$);
        expect(priceFound).toEqual(-1);
      });

      it('should return the category when displayed on the page', () => {
        const categoryFound = bestBuy.findCategoryOnPage($);
        expect(categoryFound).toEqual(category);
      });

      it('should return OTHER when the category is not setup', () => {
        $ = require('./mock-data/bestbuy-other_category.json');
        const categoryFound = bestBuy.findCategoryOnPage($);
        expect(categoryFound).toEqual(siteUtils.categories.OTHER);
      });

      it('should return null when the category does not exist', () => {
        const categoryFound = bestBuy.findCategoryOnPage(bad$);
        expect(categoryFound).toEqual(null);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = bestBuy.findNameOnPage($, category);
        expect(nameFound).toEqual(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = bestBuy.findNameOnPage(bad$, category);
        expect(nameFound).toEqual(null);
      });
    });
  });
});
