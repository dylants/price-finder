import * as cheerio from 'cheerio';
import * as siteUtils from '../../lib/site-utils';

describe('The Site Utils', () => {
  it('should have categories', () => {
    expect(siteUtils.categories).toBeTruthy();
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
    let $: cheerio.CheerioAPI;

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
      const selectors = ['#price-tag'];

      const price = siteUtils.findContentOnPage($, selectors);

      expect(price).toEqual('$9.99');
    });

    it('should return the price given the multiple matches for selector', () => {
      const selectors = ['.multi-price'];

      const price = siteUtils.findContentOnPage($, selectors);

      expect(price).toEqual('$1.99');
    });

    it('should return the price given a first() element', () => {
      const jQuery = $('.outer-multi').first();

      const selectors = ['.inner'];

      const price = siteUtils.findContentOnPage(jQuery, selectors);

      expect(price).toEqual('$12.34');
    });

    it('should return null given incorrect selector', () => {
      const selectors = ['#name-tag'];

      const price = siteUtils.findContentOnPage($, selectors);

      expect(price).toBeNull();
    });
  });

  describe('processPrice()', () => {
    it('should process $ price correctly', () => {
      expect(siteUtils.processPrice('$3.99')).toEqual(3.99);
    });

    it('should process USD price correctly', () => {
      expect(siteUtils.processPrice('USD 3.99')).toEqual(3.99);
    });

    it('should process EUR price correctly', () => {
      expect(siteUtils.processPrice('EUR 79,40')).toEqual(79.4);
    });

    it('should process eur price correctly', () => {
      expect(siteUtils.processPrice('eur 79,40')).toEqual(79.4);
    });

    it('should process Euros price correctly', () => {
      expect(siteUtils.processPrice('Euros 79,40')).toEqual(79.4);
    });

    it('should process € price correctly', () => {
      expect(siteUtils.processPrice('€ 79,40')).toEqual(79.4);
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

    it('should process GBP price correctly', () => {
      expect(siteUtils.processPrice('GBP 3.99')).toEqual(3.99);
    });

    it('should process R (INR) price correctly', () => {
      expect(siteUtils.processPrice('R 9,444')).toEqual(9444);
    });

    it('should process INR price correctly', () => {
      expect(siteUtils.processPrice('INR 9,444')).toEqual(9444);
    });

    it('should process a price without a currency correctly', () => {
      expect(siteUtils.processPrice('35')).toEqual(35);
    });

    it('should process a non-price correctly', () => {
      expect(siteUtils.processPrice('no')).toEqual(-1);
    });
  });
});
