'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const EBagsSite = require('../../../lib/sites/ebags');

const VALID_URI = 'http://www.ebags.com/123/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The eBags Site', () => {
  it('should exist', () => {
    should.exist(EBagsSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(EBagsSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(EBagsSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new EBagsSite with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new EBagsSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new eBags Site', () => {
    let ebags;

    beforeEach(() => {
      ebags = new EBagsSite(VALID_URI);
    });

    it('should exist', () => {
      should.exist(ebags);
    });

    it('should return the same URI for getURIForPageData()', () => {
      should(ebags.getURIForPageData()).equal(VALID_URI);
    });

    it('should return false for isJSON()', () => {
      should(ebags.isJSON()).be.false();
    });

    describe('with a populated page', () => {
      let $;
      let bad$;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 129.99;
        category = siteUtils.categories.LUGGAGE;
        name = 'Some Awesome eBag';

        $ = cheerio.load(`<div id='productCon'>
          <span itemprop='name'>${name}</span>
          <div id='divPricing'>
          <h2 itemprop='price'>$${price}</h2>
          </div>
          </div>`);
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = ebags.findPriceOnPage($);
        should(priceFound).equal(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = ebags.findPriceOnPage(bad$);
        should(priceFound).equal(-1);
      });

      it('should always return the category', () => {
        const categoryFound = ebags.findCategoryOnPage($);
        should(categoryFound).equal(category);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = ebags.findNameOnPage($, category);
        should(nameFound).equal(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = ebags.findNameOnPage(bad$, category);
        should(nameFound).be.null();
      });
    });
  });
});
