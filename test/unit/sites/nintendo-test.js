'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const NintendoSite = require('../../../lib/sites/nintendo');

const VALID_URI = 'http://www.nintendo.com/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Nintendo Site', () => {
  it('should exist', () => {
    should.exist(NintendoSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(NintendoSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(NintendoSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new NintendoSite with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new NintendoSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new Nintento Site', () => {
    let nintendo;

    beforeEach(() => {
      nintendo = new NintendoSite(VALID_URI);
    });

    it('should exist', () => {
      should.exist(nintendo);
    });

    it('should return false for isJSON()', () => {
      should(nintendo.isJSON()).be.false();
    });

    it('should return the same URI for getURIForPageData()', () => {
      should(nintendo.getURIForPageData()).equal(VALID_URI);
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
        should(priceFound).equal(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = nintendo.findPriceOnPage(bad$);
        should(priceFound).equal(-1);
      });

      it('should return the category', () => {
        const categoryFound = nintendo.findCategoryOnPage($);
        should(categoryFound).equal(category);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = nintendo.findNameOnPage($, category);
        should(nameFound).equal(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = nintendo.findNameOnPage(bad$, category);
        should(nameFound).be.null();
      });
    });
  });
});
