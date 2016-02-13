'use strict';

const SonyENSSite = require('../../../lib/sites/sony-entertainment-network-store');
const siteUtils = require('../../../lib/site-utils');

const VALID_URI = 'https://store.sonyentertainmentnetwork.com/#!/en-us/games/my-game/cid=123ABC';
const VALID_URI_2 = 'https://store.playstation.com/#!/en-us/games/my-game/cid=123ABC';
const VALID_API_URL = 'https://store.playstation.com/store/api/chihiro/00_09_000/container/US/en/999/123ABC';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Sony Entertainment Network Store Site', () => {
  it('should exist', () => {
    expect(SonyENSSite).toBeDefined();
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      expect(SonyENSSite.isSite(VALID_URI)).toBeTruthy();
    });

    it('should return true for a correct (alternate) site', () => {
      expect(SonyENSSite.isSite(VALID_URI_2)).toBeTruthy();
    });

    it('should return false for a bad site', () => {
      expect(SonyENSSite.isSite(INVALID_URI)).toBeFalsy();
    });
  });

  it('should throw an exception trying to create a new SonyENSSite with an incorrect uri', () => {
    expect(() => {
      /* eslint-disable no-new */
      new SonyENSSite(INVALID_URI);
      /* eslint-enable no-new */
    }).toThrow();
  });

  describe('a new Sony Entertainment Network Store Site', () => {
    let sony;

    beforeEach(() => {
      sony = new SonyENSSite(VALID_URI);
    });

    it('should exist', () => {
      expect(sony).toBeDefined();
    });

    it('should return the API URI for getURIForPageData()', () => {
      expect(sony.getURIForPageData()).toEqual(VALID_API_URL);
    });

    it('should return true for isJSON()', () => {
      expect(sony.isJSON()).toBeTruthy();
    });

    describe('with page data', () => {
      let pageData;
      let pageDataWithPlaystationPlus;
      let badPageData;
      let price;
      let playstationPlusPrice;
      let category;
      let name;

      beforeEach(() => {
        price = 9.99;
        playstationPlusPrice = 0;
        category = siteUtils.categories.VIDEO_GAMES;
        name = 'PixelJunk Monsters';

        pageData = {
          default_sku: {
            display_price: '$9.99',
          },
          bucket: 'games',
          name,
        };

        pageDataWithPlaystationPlus = {
          default_sku: {
            display_price: '$9.99',
            rewards: [
              {
                display_price: 'Free',
              },
            ],
          },
          bucket: 'games',
          name,
        };

        badPageData = {};
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = sony.findPriceOnPage(pageData);
        expect(priceFound).toEqual(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = sony.findPriceOnPage(badPageData);
        expect(priceFound).toEqual(-1);
      });

      it('should return the playstation plus price when available', () => {
        const priceFound = sony.findPriceOnPage(pageDataWithPlaystationPlus);
        expect(priceFound).toEqual(playstationPlusPrice);
      });

      it('should return the category when displayed on the page', () => {
        const categoryFound = sony.findCategoryOnPage(pageData);
        expect(categoryFound).toEqual(category);
      });

      it('should return OTHER when the category is not setup', () => {
        pageData.bucket = 'somethingElse';
        const categoryFound = sony.findCategoryOnPage(pageData);
        expect(categoryFound).toEqual(siteUtils.categories.OTHER);
      });

      it('should return null when the category does not exist', () => {
        const categoryFound = sony.findCategoryOnPage(badPageData);
        expect(categoryFound).toEqual(null);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = sony.findNameOnPage(pageData, category);
        expect(nameFound).toEqual(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = sony.findNameOnPage(badPageData, category);
        expect(nameFound).toEqual(null);
      });
    });
  });
});
