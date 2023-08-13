import * as cheerio from 'cheerio';
import Crutchfield from '../../../src/sites/Crutchfield';

const VALID_URI = 'http://www.crutchfield.com/product';
const INVALID_URI = 'http://www.bad.com/product';

describe('The Crutchfield Site', () => {
  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(Crutchfield.isSite(VALID_URI)).toEqual(true);
    });

    it('should return false for a bad site', () => {
      expect(Crutchfield.isSite(INVALID_URI)).toEqual(false);
    });
  });

  it('should throw an exception trying to create a new Crutchfield with an incorrect uri', () => {
    expect(() => {
      new Crutchfield(INVALID_URI);
    }).toThrow(/invalid uri for Crutchfield/);
  });

  describe('a new Crutchfield Site', () => {
    let site: Crutchfield;

    beforeEach(() => {
      site = new Crutchfield(VALID_URI);
    });

    it('should return the same URI for getURIForPageData()', () => {
      expect(site.getURIForPageData()).toEqual(VALID_URI);
    });

    describe('with a populated page', () => {
      let $: cheerio.CheerioAPI;
      let bad$: cheerio.CheerioAPI;
      let price: number;

      beforeEach(() => {
        price = 499.0;

        $ = cheerio.load(
          `<div class="pricing-wrapper"><div class="price js-price">$${price}</div></div>`,
        );
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
    });
  });
});
