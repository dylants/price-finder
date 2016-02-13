'use strict';

const GooglePlaySite = require('../../../lib/sites/google-play');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');

const VALID_URI = 'https://play.google.com/store/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The GooglePlay Site', () => {
  it('should exist', () => {
    expect(GooglePlaySite).toBeDefined();
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(GooglePlaySite.isSite(VALID_URI)).toBeTruthy();
    });

    it('should return false for a bad site', () => {
      expect(GooglePlaySite.isSite(INVALID_URI)).toBeFalsy();
    });
  });

  it('should throw an exception trying to create a new site with an incorrect uri', () => {
    expect(() => {
      /* eslint-disable no-new */
      new GooglePlaySite(INVALID_URI);
      /* eslint-enable no-new */
    }).toThrow();
  });

  describe('a new GooglePlay Site', () => {
    let googlePlay;

    beforeEach(() => {
      googlePlay = new GooglePlaySite(VALID_URI);
    });

    it('should exist', () => {
      expect(googlePlay).toBeDefined();
    });

    it('should return false for isJSON()', () => {
      expect(googlePlay.isJSON()).toBeFalsy();
    });

    it('should return the same URI for getURIForPageData()', () => {
      expect(googlePlay.getURIForPageData()).toEqual(VALID_URI);
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
        name = 'Big';

        $ = cheerio.load(
          `<title>Big - Movies & TV on Google Play</title>
           <div class='details-actions-right'>
           <div class='price'>
           <span> $${price}</span>
           <span> something </span>
           </div>
           </div>
           <div class='details-info'>
           <div class='document-title'>Big</div></div>`);
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = googlePlay.findPriceOnPage($);
        expect(priceFound).toEqual(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = googlePlay.findPriceOnPage(bad$);
        expect(priceFound).toEqual(-1);
      });

      it('should return the category when displayed on the page', () => {
        const categoryFound = googlePlay.findCategoryOnPage($);
        expect(categoryFound).toEqual(category);
      });

      it('should return OTHER when the category is not setup', () => {
        $ = cheerio.load('<title>Big - Something Else on Google Play</title>');
        const categoryFound = googlePlay.findCategoryOnPage($);
        expect(categoryFound).toEqual(siteUtils.categories.OTHER);
      });

      it('should return null when the category does not exist', () => {
        const categoryFound = googlePlay.findCategoryOnPage(bad$);
        expect(categoryFound).toEqual(null);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = googlePlay.findNameOnPage($, category);
        expect(nameFound).toEqual(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = googlePlay.findNameOnPage(bad$, category);
        expect(nameFound).toEqual(null);
      });
    });
  });
});
