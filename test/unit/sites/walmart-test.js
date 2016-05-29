'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const WalmartSite = require('../../../lib/sites/walmart');

const VALID_URI = 'http://walmart.com/123/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Walmart Site', () => {
  it('should exist', () => {
    should.exist(WalmartSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(WalmartSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(WalmartSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new site with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new WalmartSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new Walmart Site', () => {
    let site;

    beforeEach(() => {
      site = new WalmartSite(VALID_URI);
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
        price = 339.99;
        category = siteUtils.categories.ELECTRONICS;
        name = 'Intel Core i7-4790K Processor';

        $ = cheerio.load(`<div itemprop="price"><span class="Price-sup">$</span>339
          <span>.</span><span>99</span></div><h1 itemprop="name">
          <span>Intel Core i7-4790K Processor</span></h1><ol class="breadcrumb-list"><nav>
          <li class="breadcrumb"><a itemprop="url" href="/cp/Electronics/3944">
          <span itemprop="name">Electronics</span></a></li><li class="breadcrumb">
          <a itemprop="url" href="/cp/Computers/3951"><span itemprop="name">Computers</span>
          </a></li></nav></ol>`);
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
