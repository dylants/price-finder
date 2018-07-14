'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const GameStopSite = require('../../../lib/sites/gamestop');

const VALID_URI = 'http://www.gamestop.com/games/product';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The GameStop Site', () => {
  it('should exist', () => {
    should.exist(GameStopSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(GameStopSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(GameStopSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new GameStopSite with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new GameStopSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new GameStop Site', () => {
    let gamestop;

    beforeEach(() => {
      gamestop = new GameStopSite(VALID_URI);
    });

    it('should exist', () => {
      should.exist(gamestop);
    });

    it('should return false for isJSON()', () => {
      should(gamestop.isJSON()).be.false();
    });

    it('should return the same URI for getURIForPageData()', () => {
      should(gamestop.getURIForPageData()).equal(VALID_URI);
    });

    describe('with a populated page', () => {
      let $;
      let bad$;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 59.99;
        category = siteUtils.categories.VIDEO_GAMES;
        name = 'Mario Kart 8';

        $ = cheerio.load(
          '<div class="cartridgeProductHeader">'
          + '<h1>Mario Kart 8 '
          + '<cite>by '
          + 'Nintendo of America</cite>'
          + '</h1>'
          + '</div>'
          + '<div class="buy1">'
          + '<h3>$59.99</h3>'
          + '</div>',
        );
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = gamestop.findPriceOnPage($);
        should(priceFound).equal(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = gamestop.findPriceOnPage(bad$);
        should(priceFound).equal(-1);
      });

      it('should always return the video games category', () => {
        const categoryFound = gamestop.findCategoryOnPage($);
        should(categoryFound).equal(category);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = gamestop.findNameOnPage($, category);
        should(nameFound).equal(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = gamestop.findNameOnPage(bad$, category);
        should(nameFound).be.null();
      });
    });
  });
});
