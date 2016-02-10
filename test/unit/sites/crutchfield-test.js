'use strict';

const CrutchfieldSite = require('../../../lib/sites/crutchfield');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');

const VALID_URI = 'http://www.crutchfield.com/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Crutchfield Site', () => {
  it('should exist', () => {
    expect(CrutchfieldSite).toBeDefined();
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(CrutchfieldSite.isSite(VALID_URI)).toBeTruthy();
    });

    it('should return false for a bad site', () => {
      expect(CrutchfieldSite.isSite(INVALID_URI)).toBeFalsy();
    });
  });

  it('should throw an exception trying to create a new CrutchfieldSite with an bad uri', () => {
    expect(() => {
      /* eslint-disable no-new */
      new CrutchfieldSite(INVALID_URI);
      /* eslint-enable no-new */
    }).toThrow();
  });

  describe('a new Crutchfield Site', () => {
    let crutchfield;

    beforeEach(() => {
      crutchfield = new CrutchfieldSite(VALID_URI);
    });

    it('should exist', () => {
      expect(crutchfield).toBeDefined();
    });

    it('should return false for isJSON()', () => {
      expect(crutchfield.isJSON()).toBeFalsy();
    });

    it('should return the same URI for getURIForPageData()', () => {
      expect(crutchfield.getURIForPageData()).toEqual(VALID_URI);
    });

    describe('with a populated page', () => {
      let $;
      let bad$;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 59.99;
        category = siteUtils.categories.TELEVISION_VIDEO;
        name = 'Samsung Blu-Ray Player';

        $ = cheerio.load(
          '<div id="breadCrumbNav">' +
          '<div class="crumb">Home  /  </div>' +
          '<div class="crumb">TVs & Video  /  </div>' +
          '<div class="crumb">Category  /  </div>' +
          '</div>' +
          '<h1 class="productTitleMain">' +
          'Samsung Blu-Ray Player' +
          '</h1>' +
          '<div class="finalPrice">' +
          '$59.99' +
          '</div>'
        );
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = crutchfield.findPriceOnPage($);
        expect(priceFound).toEqual(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = crutchfield.findPriceOnPage(bad$);
        expect(priceFound).toEqual(-1);
      });

      it('should return the category when displayed on the page', () => {
        const categoryFound = crutchfield.findCategoryOnPage($);
        expect(categoryFound).toEqual(category);
      });

      it('should return OTHER when the category is not setup', () => {
        $ = cheerio.load(
          '<div id="breadCrumbNav">' +
          '<div class="crumb">Home  /  </div>' +
          '<div class="crumb">Category  /  </div>' +
          '</div>'
        );
        const categoryFound = crutchfield.findCategoryOnPage($);
        expect(categoryFound).toEqual(siteUtils.categories.OTHER);
      });

      it('should return null when the category does not exist', () => {
        const categoryFound = crutchfield.findCategoryOnPage(bad$);
        expect(categoryFound).toEqual(null);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = crutchfield.findNameOnPage($, category);
        expect(nameFound).toEqual(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = crutchfield.findNameOnPage(bad$, category);
        expect(nameFound).toEqual(null);
      });
    });
  });
});
