'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const CrutchfieldSite = require('../../../lib/sites/crutchfield');

const VALID_URI = 'http://www.crutchfield.com/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Crutchfield Site', () => {
  it('should exist', () => {
    should.exist(CrutchfieldSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(CrutchfieldSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(CrutchfieldSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new CrutchfieldSite with an bad uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new CrutchfieldSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new Crutchfield Site', () => {
    let crutchfield;

    beforeEach(() => {
      crutchfield = new CrutchfieldSite(VALID_URI);
    });

    it('should exist', () => {
      should.exist(crutchfield);
    });

    it('should return false for isJSON()', () => {
      should(crutchfield.isJSON()).be.false();
    });

    it('should return the same URI for getURIForPageData()', () => {
      should(crutchfield.getURIForPageData()).equal(VALID_URI);
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
          '<div id="breadCrumbNav">'
          + '<div class="breadcrumb-item">Home  /  </div>'
          + '<div class="breadcrumb-item">TVs & video  /  </div>'
          + '<div class="breadcrumb-item">Category  /  </div>'
          + '</div>'
          + `<h1 class="prod-title">${name}</span>`
          + '</h1>'
          + `<meta data-cf-price="${price}">`,
        );
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = crutchfield.findPriceOnPage($);
        should(priceFound).equal(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = crutchfield.findPriceOnPage(bad$);
        should(priceFound).equal(-1);
      });

      it('should return the category when displayed on the page', () => {
        const categoryFound = crutchfield.findCategoryOnPage($);
        should(categoryFound).equal(category);
      });

      it('should return OTHER when the category is not setup', () => {
        $ = cheerio.load(
          '<div id="breadCrumbNav">'
          + '<div class="breadcrumb-item">Home  /  </div>'
          + '<div class="breadcrumb-item">Category  /  </div>'
          + '</div>',
        );
        const categoryFound = crutchfield.findCategoryOnPage($);
        should(categoryFound).equal(siteUtils.categories.OTHER);
      });

      it('should return null when the category does not exist', () => {
        const categoryFound = crutchfield.findCategoryOnPage(bad$);
        should(categoryFound).be.null();
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = crutchfield.findNameOnPage($, category);
        should(nameFound).equal(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = crutchfield.findNameOnPage(bad$, category);
        should(nameFound).be.null();
      });
    });
  });
});
