'use strict';

const siteUtils = require('../../lib/site-utils');
const cheerio = require('cheerio');
const should = require('should');

describe('The Site Utils', () => {
  it('should exist', () => {
    should.exist(siteUtils);
  });

  it('should have categories', () => {
    should.exist(siteUtils.categories);
  });

  it('should be at least 1 category in categories', () => {
    const keys = Object.keys(siteUtils.categories);
    should(keys.length).be.above(0);
  });

  it('should have some known categories', () => {
    should(siteUtils.categories.MUSIC).equal('Music');
    should(siteUtils.categories.VIDEO_GAMES).equal('Video Games');
    should(siteUtils.categories.BOOKS).equal('Books');
  });

  describe('findContentOnPage() with a populated page', () => {
    let $;

    beforeEach(() => {
      $ = cheerio.load(`
        <div id='price-tag'>$9.99</div>
        <div class='multi-price'>$1.99</div>
        <div class='multi-price'>$2.99</div>
        <div class='multi-price'>$3.99</div>
        <div class='outer-multi'>
          <div class='inner'>$12.34</div>
        </div>
        <div class='outer-multi'>
          <div class='inner'>$56.78</div>
        </div>
      `);
    });

    it('should return the price given the correct selector', () => {
      const selectors = [
        '#price-tag',
      ];

      const price = siteUtils.findContentOnPage($, selectors);

      should(price).equal('$9.99');
    });

    it('should return the price given the multiple matches for selector', () => {
      const selectors = [
        '.multi-price',
      ];

      const price = siteUtils.findContentOnPage($, selectors);

      should(price).equal('$1.99');
    });

    it('should return the price given a first() element', () => {
      const jQuery = $('.outer-multi').first();

      const selectors = [
        '.inner',
      ];

      const price = siteUtils.findContentOnPage(jQuery, selectors);

      should(price).equal('$12.34');
    });

    it('should return null given incorrect selector', () => {
      const selectors = [
        '#name-tag',
      ];

      const price = siteUtils.findContentOnPage($, selectors);

      should(price).be.null();
    });
  });

  describe('processPrice()', () => {
    it('should process $ price correctly', () => {
      should(siteUtils.processPrice('$3.99')).equal(3.99);
    });

    it('should process EUR price correctly', () => {
      should(siteUtils.processPrice('EUR 79,40')).equal(79.40);
    });

    it('should process eur price correctly', () => {
      should(siteUtils.processPrice('eur 79,40')).equal(79.40);
    });

    it('should process Euros price correctly', () => {
      should(siteUtils.processPrice('Euros 79,40')).equal(79.40);
    });

    it('should process € price correctly', () => {
      should(siteUtils.processPrice('€ 79,40')).equal(79.40);
    });

    it('should process YEN_TEXT price correctly', () => {
      should(siteUtils.processPrice('7,940 円')).equal(7940);
    });

    it('should process YEN_SYMBOL price correctly', () => {
      should(siteUtils.processPrice('￥ 7,940')).equal(7940);
    });

    it('should process £ price correctly', () => {
      should(siteUtils.processPrice('£3.99')).equal(3.99);
    });

    it('should process INR price correctly', () => {
      should(siteUtils.processPrice('R 9,444')).equal(9444);
    });

    it('should process an unknown price correctly', () => {
      should(siteUtils.processPrice('hey, without symbol?')).equal(-1);
    });
  });
});
