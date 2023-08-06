import HomeDepot from '../../../src/sites/HomeDepot';
import * as cheerio from 'cheerio';

const VALID_URI = 'http://www.homedepot.com/product';
const INVALID_URI = 'http://www.bad.com/product';

describe('The HomeDepot Site', () => {
  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(HomeDepot.isSite(VALID_URI)).toEqual(true);
    });

    it('should return false for a bad site', () => {
      expect(HomeDepot.isSite(INVALID_URI)).toEqual(false);
    });
  });

  it('should throw an exception trying to create a new HomeDepot with an incorrect uri', () => {
    expect(() => {
      new HomeDepot(INVALID_URI);
    }).toThrow(/invalid uri for Home Depot/);
  });

  describe('a new HomeDepot Site', () => {
    let homeDepot: HomeDepot;

    beforeEach(() => {
      homeDepot = new HomeDepot(VALID_URI);
    });

    it('should return the same URI for getURIForPageData()', () => {
      expect(homeDepot.getURIForPageData()).toEqual(VALID_URI);
    });

    describe('with a populated page', () => {
      let $: cheerio.CheerioAPI;
      let bad$: cheerio.CheerioAPI;
      let price: number;

      beforeEach(() => {
        price = 29.97;

        $ = cheerio.load(
          '<div class="price-format__large price-format__main-price">' +
            '<span class="price-format__large-currency-symbols">$</span><span>29</span><span hidden="">.</span><span class="price-format__large-currency-symbols">97</span>' +
            '</div>',
        );
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = homeDepot.findPriceOnPage($);
        expect(priceFound).toEqual(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = homeDepot.findPriceOnPage(bad$);
        expect(priceFound).toEqual(-1);
      });
    });
  });
});
