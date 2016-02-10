'use strict';

const PriceMinisterSite = require('../../../lib/sites/priceminister');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');

const VALID_URI = 'http://www.priceminister.com/mfp/123/my-video-game#pid=456';
const TRANSLATED_URL = 'http://www.priceminister.com/mfp?cid=123&urlname=my-video-game&pid=456&action=advlstmeta';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The PriceMinister Site', () => {
  it('should exist', () => {
    expect(PriceMinisterSite).toBeDefined();
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(PriceMinisterSite.isSite(VALID_URI)).toBeTruthy();
    });

    it('should return false for a bad site', () => {
      expect(PriceMinisterSite.isSite(INVALID_URI)).toBeFalsy();
    });
  });

  it('should throw an exception trying to create a new site with an incorrect uri', () => {
    expect(() => {
      /* eslint-disable no-new */
      new PriceMinisterSite(INVALID_URI);
      /* eslint-enable no-new */
    }).toThrow();
  });

  describe('a new PriceMinister Site', () => {
    let priceminister;

    beforeEach(() => {
      priceminister = new PriceMinisterSite(VALID_URI);
    });

    it('should exist', () => {
      expect(priceminister).toBeDefined();
    });

    it('should return the same URI for getURIForPageData()', () => {
      expect(priceminister.getURIForPageData()).toEqual(TRANSLATED_URL);
    });

    it('should return false for isJSON()', () => {
      expect(priceminister.isJSON()).toBeFalsy();
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
        expect(priceFound).toEqual(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = priceminister.findPriceOnPage(bad$);
        expect(priceFound).toEqual(-1);
      });

      it('should always return the VIDEO_GAMES category', () => {
        const categoryFound = priceminister.findCategoryOnPage($);
        expect(categoryFound).toEqual(category);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = priceminister.findNameOnPage($, category);
        expect(nameFound).toEqual(name);
      });

      it('should not return null when the name is not displayed on the page', () => {
        const nameFound = priceminister.findNameOnPage(bad$, category);
        expect(nameFound).toEqual(name);
      });
    });
  });
});
