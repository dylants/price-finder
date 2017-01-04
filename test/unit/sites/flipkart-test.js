'use strict';

const FlipkartSite = require('../../../lib/sites/flipkart');
const siteUtils = require('../../../lib/site-utils');

const VALID_URI = 'http://www.flipkart.com/nexus-6/p/itme7zd6w6qwgjuy?pid=MOBEFHHGZFKAZKY3';
const INVALID_URI = 'http://www.bad.com/123/product';
const TRANSLATED_URI = 'https://affiliate-api.flipkart.net/affiliate/product/json?id=MOBEFHHGZFKAZKY3';
const CONFIG = {
  headers: {
    'Fk-Affiliate-Id': 'affiliateId',
    'Fk-Affiliate-Token': 'affiliateToken',
  },
};

describe('The Flipkart Site', () => {
  it('should exist', () => {
    expect(FlipkartSite).toBeDefined();
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(FlipkartSite.isSite(VALID_URI)).toBeTruthy();
    });

    it('should return false for a bad site', () => {
      expect(FlipkartSite.isSite(INVALID_URI)).toBeFalsy();
    });
  });

  it('should throw an exception trying to create a new FlipkartSite with an incorrect uri', () => {
    expect(() => {
      /* eslint-disable no-new */
      new FlipkartSite(INVALID_URI, CONFIG);
      /* eslint-enable no-new */
    }).toThrow();
  });

  describe('without an API key in the environment', () => {
    it('should throw an exception trying to create a new FlipkartSite', () => {
      expect(() => {
        /* eslint-disable no-new */
        new FlipkartSite(VALID_URI, {});
        /* eslint-enable no-new */
      }).toThrow();
    });
  });

  describe('with an API key in the environment', () => {
    it('should not throw an exception trying to create a new FlipkartSite', () => {
      expect(() => {
        /* eslint-disable no-new */
        new FlipkartSite(VALID_URI, CONFIG);
        /* eslint-enable no-new */
      }).not.toThrow();
    });
  });

  describe('a new Flipkart Site', () => {
    let flipkart;

    beforeEach(() => {
      flipkart = new FlipkartSite(VALID_URI, CONFIG);
    });

    it('should exist', () => {
      expect(flipkart).toBeDefined();
    });

    it('should return the translated URI for getURIForPageData()', () => {
      expect(flipkart.getURIForPageData()).toEqual(TRANSLATED_URI);
    });

    it('should return false for isJSON()', () => {
      expect(flipkart.isJSON()).toBeTruthy();
    });

    describe('with a populated page', () => {
      let $;
      let bad$;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 19990;
        category = siteUtils.categories.TELEVISION_VIDEO;
        name = 'Vu 80cm (32) HD Ready Smart LED TV';

        $ = require('./mock-data/flipkart.full.json');
        try {
          bad$ = JSON.parse('<h1>Developer Inactive</h1>');
        } catch (err) {
          // do nothing
        }
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = flipkart.findPriceOnPage($);
        expect(priceFound).toEqual(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = flipkart.findPriceOnPage(bad$);
        expect(priceFound).toEqual(-1);
      });

      it('should return the category when displayed on the page', () => {
        const categoryFound = flipkart.findCategoryOnPage($);
        expect(categoryFound).toEqual(category);
      });

      it('should return null when the category does not exist', () => {
        const categoryFound = flipkart.findCategoryOnPage(bad$);
        expect(categoryFound).toEqual(null);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = flipkart.findNameOnPage($);
        expect(nameFound).toEqual(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = flipkart.findNameOnPage(bad$);
        expect(nameFound).toEqual(null);
      });
    });
  });
});
