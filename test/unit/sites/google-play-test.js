'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const GooglePlaySite = require('../../../lib/sites/google-play');

const VALID_URI = 'https://play.google.com/store/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The GooglePlay Site', () => {
  it('should exist', () => {
    should.exist(GooglePlaySite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(GooglePlaySite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(GooglePlaySite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new site with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new GooglePlaySite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new GooglePlay Site', () => {
    let googlePlay;

    beforeEach(() => {
      googlePlay = new GooglePlaySite(VALID_URI);
    });

    it('should exist', () => {
      should.exist(googlePlay);
    });

    it('should return false for isJSON()', () => {
      should(googlePlay.isJSON()).be.false();
    });

    it('should return the same URI for getURIForPageData()', () => {
      should(googlePlay.getURIForPageData()).equal(VALID_URI);
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
           <meta content="$${price}" itemprop="price">
           <div class='details-info'>
           <div class='document-title'>Big</div></div>`,
        );
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = googlePlay.findPriceOnPage($);
        should(priceFound).equal(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = googlePlay.findPriceOnPage(bad$);
        should(priceFound).equal(-1);
      });

      it('should return the category when displayed on the page', () => {
        const categoryFound = googlePlay.findCategoryOnPage($);
        should(categoryFound).equal(category);
      });

      it('should return OTHER when the category is not setup', () => {
        $ = cheerio.load('<title>Big - Something Else on Google Play</title>');
        const categoryFound = googlePlay.findCategoryOnPage($);
        should(categoryFound).equal(siteUtils.categories.OTHER);
      });

      it('should return null when the category does not exist', () => {
        const categoryFound = googlePlay.findCategoryOnPage(bad$);
        should(categoryFound).be.null();
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = googlePlay.findNameOnPage($, category);
        should(nameFound).equal(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = googlePlay.findNameOnPage(bad$, category);
        should(nameFound).be.null();
      });
    });
  });
});
