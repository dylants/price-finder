'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const FlipkartSite = require('../../../lib/sites/flipkart');

const VALID_URI = 'http://www.flipkart.com/123/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Flipkart Site', () => {
  it('should exist', () => {
    should.exist(FlipkartSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(FlipkartSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(FlipkartSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new site with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new FlipkartSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new Flipkart Site', () => {
    let site;

    beforeEach(() => {
      site = new FlipkartSite(VALID_URI);
    });

    it('should exist', () => {
      should.exist(site);
    });

    it('should return the same URI for getURIForPageData()', () => {
      should(site.getURIForPageData()).equal(VALID_URI);
    });

    it('should return false for isJSON()', () => {
      should(site.isJSON()).be.false();
    });

    describe('with a populated page', () => {
      let $;
      let bad$;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 24999;
        category = siteUtils.categories.OTHER;
        name = 'Some Product';

        // TODO provide content for unit test here!
        $ = cheerio.load(`
          <title>${name}</title>
          <meta name="Description" content="Buy this thing for Rs.24999 Online">
        `);
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = site.findPriceOnPage($);
        should(priceFound).equal(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = site.findPriceOnPage(bad$);
        should(priceFound).equal(-1);
      });

      it('should always return the category', () => {
        const categoryFound = site.findCategoryOnPage($);
        should(categoryFound).equal(category);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = site.findNameOnPage($, category);
        should(nameFound).equal(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = site.findNameOnPage(bad$, category);
        should(nameFound).be.null();
      });
    });
  });
});
