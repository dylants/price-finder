'use strict';

const siteUtils = require('../../lib/site-utils');
const cheerio = require('cheerio');

describe('The Site Utils', () => {
  it('should exist', () => {
    expect(siteUtils).toBeDefined();
  });

  it('should have categories', () => {
    expect(siteUtils.categories).toBeDefined();
  });

  it('should be at least 1 category in categories', () => {
    const keys = Object.keys(siteUtils.categories);
    expect(keys.length).toBeGreaterThan(0);
  });

  it('should have some known categories', () => {
    expect(siteUtils.categories.MUSIC).toEqual('Music');
    expect(siteUtils.categories.VIDEO_GAMES).toEqual('Video Games');
    expect(siteUtils.categories.BOOKS).toEqual('Books');
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

      expect(price).toEqual('$9.99');
    });

    it('should return the price given the multiple matches for selector', () => {
      const selectors = [
        '.multi-price',
      ];

      const price = siteUtils.findContentOnPage($, selectors);

      expect(price).toEqual('$1.99');
    });

    it('should return the price given a first() element', () => {
      const jQuery = $('.outer-multi').first();

      const selectors = [
        '.inner',
      ];

      const price = siteUtils.findContentOnPage(jQuery, selectors);

      expect(price).toEqual('$12.34');
    });

    it('should return null given incorrect selector', () => {
      const selectors = [
        '#name-tag',
      ];

      const price = siteUtils.findContentOnPage($, selectors);

      expect(price).toEqual(null);
    });
  });

  describe('processPrice()', () => {
    it('should process $ price correctly', () => {
      expect(siteUtils.processPrice('$3.99')).toEqual(3.99);
    });

    it('should process EUR price correctly', () => {
      expect(siteUtils.processPrice('EUR 79,40')).toEqual(79.40);
    });

    it('should process eur price correctly', () => {
      expect(siteUtils.processPrice('eur 79,40')).toEqual(79.40);
    });

    it('should process Euros price correctly', () => {
      expect(siteUtils.processPrice('Euros 79,40')).toEqual(79.40);
    });

    it('should process € price correctly', () => {
      expect(siteUtils.processPrice('€ 79,40')).toEqual(79.40);
    });

    it('should process YEN_TEXT price correctly', () => {
      expect(siteUtils.processPrice('7,940 円')).toEqual(7940);
    });

    it('should process YEN_SYMBOL price correctly', () => {
      expect(siteUtils.processPrice('￥ 7,940')).toEqual(7940);
    });

    it('should process £ price correctly', () => {
      expect(siteUtils.processPrice('£3.99')).toEqual(3.99);
    });

    it('should process an unknown price correctly', () => {
      expect(siteUtils.processPrice('hey, how are you?')).toEqual(-1);
    });
  });
});
