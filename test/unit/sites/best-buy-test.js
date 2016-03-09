'use strict';

const BestBuySite = require('../../../lib/sites/best-buy');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');

const VALID_URI = 'http://www.bestbuy.com/site/product?skuId=123';
const INVALID_URI = 'http://www.bad.com/123/product';
const TRANSLATED_URI = 'https://api.remix.bestbuy.com/v1/products/123.json?show=sku,name,salePrice,categoryPath&apiKey=123';

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
      new BestBuySite(INVALID_URI);
      /* eslint-enable no-new */
    }).toThrow();
  });

  describe('without an API key in the environment', () => {
    let site;
    const EXISTING_ENV_KEY = process.env.BESTBUY_KEY;

    beforeEach(() => {
      process.env.BESTBUY_KEY = '';

      site = new BestBuySite(VALID_URI);
    });

    afterEach(() => {
      process.env.BESTBUY_KEY = EXISTING_ENV_KEY;
    });

    it('should not throw an exception trying to create a new BestBuySite', () => {
      expect(() => {
        /* eslint-disable no-new */
        new BestBuySite(VALID_URI);
        /* eslint-enable no-new */
      }).not.toThrow();
    });

    it('should exist', () => {
      expect(site).toBeDefined();
    });

    it('should return the same URI for getURIForPageData()', () => {
      expect(site.getURIForPageData()).toEqual(VALID_URI);
    });

    it('should return false for isJSON()', () => {
      expect(site.isJSON()).toBeFalsy();
    });

    describe('with a populated page', () => {
      let $;
      let bad$;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 2.99;
        category = siteUtils.categories.MUSIC;
        name = 'Awesome Product';

        $ = cheerio.load(`
          <meta itemprop="price" content="${price}">
          <div id="analytics-data"
            data-uber-cat-name="Movies & Music"
            data-parent-cat-name="Music (CDs & Vinyl): R&B & Soul">
          </div>
          <div id="sku-title" itemprop="name">${name}</div>
        `);
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = site.findPriceOnPage($);
        expect(priceFound).toEqual(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = site.findPriceOnPage(bad$);
        expect(priceFound).toEqual(-1);
      });

      it('should always return the category', () => {
        const categoryFound = site.findCategoryOnPage($);
        expect(categoryFound).toEqual(category);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = site.findNameOnPage($, category);
        expect(nameFound).toEqual(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = site.findNameOnPage(bad$, category);
        expect(nameFound).toEqual(null);
      });
    });
  });

  describe('with an API key in the environment', () => {
    let bestBuy;

    beforeEach(() => {
      process.env.BESTBUY_KEY = '123';

      bestBuy = new BestBuySite(VALID_URI);
    });

    afterEach(() => {
      process.env.BESTBUY_KEY = '';
    });

    it('should not throw an exception trying to create a new BestBuySite', () => {
      expect(() => {
        /* eslint-disable no-new */
        new BestBuySite(VALID_URI, {});
        /* eslint-enable no-new */
      }).not.toThrow();
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
