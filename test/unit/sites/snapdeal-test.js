'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const SnapdealSite = require('../../../lib/sites/snapdeal');

const VALID_URI = 'http://www.snapdeal.com/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Snapdeal Site', () => {
  it('should exist', () => {
    should.exist(SnapdealSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(SnapdealSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(SnapdealSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new site with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new SnapdealSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new Snapdeal Site', () => {
    let site;

    beforeEach(() => {
      site = new SnapdealSite(VALID_URI);
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
        const nameFound = site.findNameOnPage($);
        should(nameFound).equal(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = site.findNameOnPage(bad$);
        should(nameFound).be.null();
      });
    });
  });
});
