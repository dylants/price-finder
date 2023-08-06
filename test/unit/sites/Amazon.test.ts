import Amazon from '../../../src/sites/Amazon';
import * as cheerio from 'cheerio';

const VALID_URI = 'http://www.amazon.com/123/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Amazon Site', () => {
  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(Amazon.isSite(VALID_URI)).toEqual(true);
    });

    it('should return false for a bad site', () => {
      expect(Amazon.isSite(INVALID_URI)).toEqual(false);
    });
  });

  it('should throw an exception trying to create a new Amazon with an incorrect uri', () => {
    expect(() => {
      new Amazon(INVALID_URI);
    }).toThrow(/invalid uri for Amazon/);
  });

  describe('a new Amazon Site', () => {
    let amazon: Amazon;

    beforeEach(() => {
      amazon = new Amazon(VALID_URI);
    });

    it('should return the same URI for getURIForPageData()', () => {
      expect(amazon.getURIForPageData()).toEqual(VALID_URI);
    });

    describe('with a populated page', () => {
      let $: cheerio.CheerioAPI;
      let bad$: cheerio.CheerioAPI;
      let price: number;

      beforeEach(() => {
        price = 9.99;

        $ = cheerio.load(
          `<input id='twister-plus-price-data-price' value='${price}'>`,
        );
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = amazon.findPriceOnPage($);
        expect(priceFound).toEqual(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = amazon.findPriceOnPage(bad$);
        expect(priceFound).toEqual(-1);
      });
    });
  });
});
