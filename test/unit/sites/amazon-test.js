'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const AmazonSite = require('../../../lib/sites/amazon');

const VALID_URI = 'http://www.amazon.com/123/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Amazon Site', () => {
  it('should exist', () => {
    should.exist(AmazonSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(AmazonSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(AmazonSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new AmazonSite with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new AmazonSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new Amazon Site', () => {
    let amazon;

    beforeEach(() => {
      amazon = new AmazonSite(VALID_URI);
    });

    it('should exist', () => {
      should.exist(amazon);
    });

    it('should return the same URI for getURIForPageData()', () => {
      should(amazon.getURIForPageData()).equal(VALID_URI);
    });

    it('should return false for isJSON()', () => {
      should(amazon.isJSON()).be.false();
    });

    describe('with a populated page', () => {
      let $;
      let bad$;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 9.99;
        category = siteUtils.categories.BOOKS;
        name = 'The Cat in the Hat';

        $ = cheerio.load(`<div id='actualPriceValue'>$${price}</div>
          <div id='nav-subnav' data-category='books'>stuff</div>
          <div id='title'>${name}</div>`);
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = amazon.findPriceOnPage($);
        should(priceFound).equal(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = amazon.findPriceOnPage(bad$);
        should(priceFound).equal(-1);
      });

      it('should return the category when displayed on the page', () => {
        const categoryFound = amazon.findCategoryOnPage($);
        should(categoryFound).equal(category);
      });

      it('should return OTHER when the category is not setup', () => {
        $ = cheerio.load('<div id="nav-subnav" data-category="something-new">stuff</div>');
        const categoryFound = amazon.findCategoryOnPage($);
        should(categoryFound).equal(siteUtils.categories.OTHER);
      });

      it('should return null when the category does not exist', () => {
        const categoryFound = amazon.findCategoryOnPage(bad$);
        should(categoryFound).be.null();
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = amazon.findNameOnPage($, category);
        should(nameFound).equal(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = amazon.findNameOnPage(bad$, category);
        should(nameFound).be.null();
      });
    });
  });
});
