'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const InfibeamSite = require('../../../lib/sites/infibeam');

const VALID_URI = 'http://www.infibeam.com/Home_Entertainment/sansui-sjx22fb-full-hd-led-tv/P-hoen-68091831042-cat-z.html#variantId=P-hoen-60492354794';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Infibeam Site', () => {
  it('should exist', () => {
    should.exist(InfibeamSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(InfibeamSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(InfibeamSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new site with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new InfibeamSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new Infibeam Site', () => {
    let site;

    beforeEach(() => {
      site = new InfibeamSite(VALID_URI);
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
        price = 9444;
        category = siteUtils.categories.ELECTRONICS;
        name = 'Sansui SJX22FB Full HD LED TV';

        $ = cheerio.load('<div id="price-after-discount">'
          + '<span style="font-family: rupee">R </span><span class="price">9,444</span></div>'
          + '<h1 class="product-title-big " itemprop="name">Sansui SJX22FB Full HD LED TV</h1>'
          + '<div class="breadcrumb-sdp no-padding-xs" itemscope="">'
          + '<a itemprop="url" href="/Electronics"><span itemprop="title">Electronics</span></a> '
          + '<a itemprop="url" href="/Home_Entertainment"><span itemprop="title">Entertainment'
          + '</span></a></div>');
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
