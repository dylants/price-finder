'use strict';

const should = require('should');
const siteUtils = require('../../../lib/site-utils');
const SonyENSSite = require('../../../lib/sites/sony-entertainment-network-store');

const VALID_URI = 'https://store.sonyentertainmentnetwork.com/#!/en-us/games/my-game/cid=123ABC';
const VALID_URI_2 = 'https://store.playstation.com/#!/en-us/games/my-game/cid=123ABC';
const VALID_API_URL = 'https://store.playstation.com/store/api/chihiro/00_09_000/container/US/en/999/123ABC';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The Sony Entertainment Network Store Site', () => {
  it('should exist', () => {
    should.exist(SonyENSSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(SonyENSSite.isSite(VALID_URI)).be.true();
    });

    it('should return true for a correct (alternate) site', () => {
      should(SonyENSSite.isSite(VALID_URI_2)).be.true();
    });

    it('should return false for a bad site', () => {
      should(SonyENSSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new SonyENSSite with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new SonyENSSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new Sony Entertainment Network Store Site', () => {
    let sony;

    beforeEach(() => {
      sony = new SonyENSSite(VALID_URI);
    });

    it('should exist', () => {
      should.exist(sony);
    });

    it('should return the API URI for getURIForPageData()', () => {
      should(sony.getURIForPageData()).equal(VALID_API_URL);
    });

    it('should return true for isJSON()', () => {
      should(sony.isJSON()).be.true();
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
        should(priceFound).equal(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = sony.findPriceOnPage(badPageData);
        should(priceFound).equal(-1);
      });

      it('should return the playstation plus price when available', () => {
        const priceFound = sony.findPriceOnPage(pageDataWithPlaystationPlus);
        should(priceFound).equal(playstationPlusPrice);
      });

      it('should return the category when displayed on the page', () => {
        const categoryFound = sony.findCategoryOnPage(pageData);
        should(categoryFound).equal(category);
      });

      it('should return OTHER when the category is not setup', () => {
        pageData.bucket = 'somethingElse';
        const categoryFound = sony.findCategoryOnPage(pageData);
        should(categoryFound).equal(siteUtils.categories.OTHER);
      });

      it('should return null when the category does not exist', () => {
        const categoryFound = sony.findCategoryOnPage(badPageData);
        should(categoryFound).be.null();
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = sony.findNameOnPage(pageData, category);
        should(nameFound).equal(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = sony.findNameOnPage(badPageData, category);
        should(nameFound).be.null();
      });
    });
  });
});
