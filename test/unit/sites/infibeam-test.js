'use strict';

const InfibeamSite = require('../../../lib/sites/infibeam');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');

const VALID_URI = 'http://www.infibeam.com/Home_Entertainment/sansui-sjx22fb-full-hd-led-tv/P-hoen-68091831042-cat-z.html#variantId=P-hoen-60492354794';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Infibeam Site', () => {
  it('should exist', () => {
    expect(InfibeamSite).toBeDefined();
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(InfibeamSite.isSite(VALID_URI)).toBeTruthy();
    });

    it('should return false for a bad site', () => {
      expect(InfibeamSite.isSite(INVALID_URI)).toBeFalsy();
    });
  });

  it('should throw an exception trying to create a new site with an incorrect uri', () => {
    expect(() => {
      /* eslint-disable no-new */
      new InfibeamSite(INVALID_URI);
      /* eslint-enable no-new */
    }).toThrow();
  });

  describe('a new Infibeam Site', () => {
    let site;

    beforeEach(() => {
      site = new InfibeamSite(VALID_URI);
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
        price = 9444;
        category = siteUtils.categories.ELECTRONICS;
        name = 'Sansui SJX22FB Full HD LED TV';

        // TODO provide content for unit test here!
        $ = cheerio.load('<div id="price-after-discount">' +
          '<span style="font-family: rupee">R </span><span class="price">9,444</span></div>' +
          '<h1 class="product-title-big " itemprop="name">Sansui SJX22FB Full HD LED TV</h1>' +
          '<div class="breadcrumb-sdp no-padding-xs" itemscope="">' +
          '<a itemprop="url" href="/Electronics"><span itemprop="title">Electronics</span></a> ' +
          '<a itemprop="url" href="/Home_Entertainment"><span itemprop="title">Entertainment' +
          '</span></a></div>');
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
