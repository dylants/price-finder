'use strict';

const SnapdealSite = require('../../../lib/sites/snapdeal');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');

const VALID_URI = 'http://www.snapdeal.com/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Snapdeal Site', () => {
  it('should exist', () => {
    expect(SnapdealSite).toBeDefined();
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(SnapdealSite.isSite(VALID_URI)).toBeTruthy();
    });

    it('should return false for a bad site', () => {
      expect(SnapdealSite.isSite(INVALID_URI)).toBeFalsy();
    });
  });

  it('should throw an exception trying to create a new site with an incorrect uri', () => {
    expect(() => {
      /* eslint-disable no-new */
      new SnapdealSite(INVALID_URI);
      /* eslint-enable no-new */
    }).toThrow();
  });

  describe('a new Snapdeal Site', () => {
    let site;

    beforeEach(() => {
      site = new SnapdealSite(VALID_URI);
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
        price = 299;
        category = siteUtils.categories.TELEVISION_VIDEO;
        name = 'Product Name';

        $ = cheerio.load(`
          <span itemprop="price">${price}</span>
          <h1 itemprop="name">${name}</h1>
          <div id="catUrl" value="tv"></div>
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
        const nameFound = site.findNameOnPage($);
        expect(nameFound).toEqual(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = site.findNameOnPage(bad$);
        expect(nameFound).toEqual(null);
      });
    });
  });
});
