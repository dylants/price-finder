'use strict';

const NintendoSite = require('../../../lib/sites/nintendo');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');

const VALID_URI = 'http://www.nintendo.com/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Nintendo Site', () => {
  it('should exist', () => {
    expect(NintendoSite).toBeDefined();
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(NintendoSite.isSite(VALID_URI)).toBeTruthy();
    });

    it('should return false for a bad site', () => {
      expect(NintendoSite.isSite(INVALID_URI)).toBeFalsy();
    });
  });

  it('should throw an exception trying to create a new NintendoSite with an incorrect uri', () => {
    expect(() => {
      /* eslint-disable no-new */
      new NintendoSite(INVALID_URI);
      /* eslint-enable no-new */
    }).toThrow();
  });

  describe('a new Nintento Site', () => {
    let nintendo;

    beforeEach(() => {
      nintendo = new NintendoSite(VALID_URI);
    });

    it('should exist', () => {
      expect(nintendo).toBeDefined();
    });

    it('should return false for isJSON()', () => {
      expect(nintendo.isJSON()).toBeFalsy();
    });

    it('should return the same URI for getURIForPageData()', () => {
      expect(nintendo.getURIForPageData()).toEqual(VALID_URI);
    });

    describe('with a populated page', () => {
      let $;
      let bad$;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 59.99;
        category = siteUtils.categories.VIDEO_GAMES;
        name = 'New Super Mario Bros. U';

        $ = cheerio.load(
          `<div itemprop='price'>
           $${price}<sup>*</sup>
           </div>
           <h1 itemprop='name'>${name}</h1>`
        );
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = nintendo.findPriceOnPage($);
        expect(priceFound).toEqual(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = nintendo.findPriceOnPage(bad$);
        expect(priceFound).toEqual(-1);
      });

      it('should return the category', () => {
        const categoryFound = nintendo.findCategoryOnPage($);
        expect(categoryFound).toEqual(category);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = nintendo.findNameOnPage($, category);
        expect(nameFound).toEqual(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = nintendo.findNameOnPage(bad$, category);
        expect(nameFound).toEqual(null);
      });
    });
  });
});
