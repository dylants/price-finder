'use strict';

const GreenmanGamingSite = require('../../../lib/sites/greenman-gaming');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');

const VALID_URI = 'http://greenmangaming.com/123/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The GreenmanGaming Site', () => {
  it('should exist', () => {
    expect(GreenmanGamingSite).toBeDefined();
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(GreenmanGamingSite.isSite(VALID_URI)).toBeTruthy();
    });

    it('should return false for a bad site', () => {
      expect(GreenmanGamingSite.isSite(INVALID_URI)).toBeFalsy();
    });
  });

  it('should throw an exception trying to create a new site with an incorrect uri', () => {
    expect(() => {
      /* eslint-disable no-new */
      new GreenmanGamingSite(INVALID_URI);
      /* eslint-enable no-new */
    }).toThrow();
  });

  describe('a new GreenmanGaming Site', () => {
    let site;

    beforeEach(() => {
      site = new GreenmanGamingSite(VALID_URI);
    });

    it('should exist', () => {
      expect(site).toBeDefined();
    });

    it('should return the same URI for getURIForPageData()', () => {
      expect(site.getURIForPageData()).toEqual(VALID_URI);
    });

    it('should return false for isJSON()', () => {
      expect(site.isJSON()).toBeFalsy();
    });

    describe('with a populated page', () => {
      let $;
      let bad$;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 4199.3;
        category = siteUtils.categories.VIDEO_GAMES;
        name = 'Homefront: The Revolution';

        $ = cheerio.load(`<strong class="curPrice">₹4199.30</strong>
          <h1 itemprop="name">Homefront: The Revolution</h1>
          <script>var utag_data = {"currency_code": "INR",
          "request_path": "/s/in/en/pc/games/action/far-cry-primal/"};</script>`);
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = site.findPriceOnPage($);
        expect(priceFound).toEqual(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = site.findPriceOnPage(bad$);
        expect(priceFound).toEqual(-1);
      });

      it('should always return the category', () => {
        const categoryFound = site.findCategoryOnPage($);
        expect(categoryFound).toEqual(category);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = site.findNameOnPage($, category);
        expect(nameFound).toEqual(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = site.findNameOnPage(bad$, category);
        expect(nameFound).toEqual(null);
      });
    });
  });
});
