'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const PriceMinisterSite = require('../../../lib/sites/priceminister');

const VALID_URI = 'http://www.priceminister.com/mfp/123/my-video-game#pid=456';
const TRANSLATED_URL = 'http://www.priceminister.com/mfp?cid=123&urlname=my-video-game&pid=456&action=advlstmeta';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The PriceMinister Site', () => {
  it('should exist', () => {
    should.exist(PriceMinisterSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(PriceMinisterSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(PriceMinisterSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new site with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new PriceMinisterSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new PriceMinister Site', () => {
    let priceminister;

    beforeEach(() => {
      priceminister = new PriceMinisterSite(VALID_URI);
    });

    it('should exist', () => {
      should.exist(priceminister);
    });

    it('should return the same URI for getURIForPageData()', () => {
      should(priceminister.getURIForPageData()).equal(TRANSLATED_URL);
    });

    it('should return false for isJSON()', () => {
      should(priceminister.isJSON()).be.false();
    });

    describe('with a populated page', () => {
      let $;
      let bad$;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 19.99;
        category = siteUtils.categories.VIDEO_GAMES;
        name = 'My video game';

        $ = cheerio.load(
          `<div id='advert_list'>
           <ul class='priceInfos'>
           <li class='price'>${price}€</li></ul>
           </div>
           <div class='productTitle'>
           <h1>${name}</h1>
           </div>`
        );
        bad$ = cheerio.load('<h1>Nothing here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = priceminister.findPriceOnPage($);
        should(priceFound).equal(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = priceminister.findPriceOnPage(bad$);
        should(priceFound).equal(-1);
      });

      it('should always return the VIDEO_GAMES category', () => {
        const categoryFound = priceminister.findCategoryOnPage($);
        should(categoryFound).equal(category);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = priceminister.findNameOnPage($, category);
        should(nameFound).equal(name);
      });

      it('should return the name without displayed on page, from uri', () => {
        const nameFound = priceminister.findNameOnPage(bad$, category);
        should(nameFound).equal(name);
      });
    });
  });
});
