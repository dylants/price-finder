'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const GogSite = require('../../../lib/sites/gog');

const VALID_URI = 'http://www.gog.com/123/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Gog Site', () => {
  it('should exist', () => {
    should.exist(GogSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(GogSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(GogSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new site with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new GogSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new Gog Site', () => {
    let site;

    beforeEach(() => {
      site = new GogSite(VALID_URI);
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
        price = 1.99;
        category = siteUtils.categories.VIDEO_GAMES;
        name = 'Some Product';

        $ = cheerio.load(`
          <h1 class="header__title" itemprop="name">${name}</h1>
          <span itemprop="price">${price}</span>
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
