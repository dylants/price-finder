'use strict';

const should = require('should');
const TargetSite = require('../../../lib/sites/target');

const PRODUCT_ID = '14404364';
const VALID_URI = `http://www.target.com/123/product/A-${PRODUCT_ID}`;
const BAD_URI = 'http://www.bad.com/123/product';
const INVALID_URI = 'http://www.target.com/123/product';

describe('The Target Site', () => {
  it('should exist', () => {
    should.exist(TargetSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(TargetSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(TargetSite.isSite(BAD_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new site with an bad uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new TargetSite(BAD_URI);
      /* eslint-enable no-new */
    });
  });

  it('should throw an exception trying to create a new site with an invalid uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new TargetSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new Target Site', () => {
    let site;

    beforeEach(() => {
      site = new TargetSite(VALID_URI);
    });

    it('should exist', () => {
      should.exist(site);
    });

    it('should return the correct URI for getURIForPageData()', () => {
      should(site.getURIForPageData()).equal(`http://redsky.target.com/v1/pdp/tcin/${PRODUCT_ID}`);
    });

    it('should return true for isJSON()', () => {
      should(site.isJSON()).be.true();
    });

    describe('with a populated page', () => {
      let pageData;
      let badPageData;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 1.99;
        category = 'Movies';
        name = 'Some Product';

        pageData = {
          product: {
            price: {
              offerPrice: {
                price,
              },
            },
            item: {
              product_classification: {
                item_type_name: category,
              },
              product_description: {
                title: name,
              },
            },
          },
        };

        badPageData = {};
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = site.findPriceOnPage(pageData);
        should(priceFound).equal(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = site.findPriceOnPage(badPageData);
        should(priceFound).equal(-1);
      });

      it('should always return the category', () => {
        const categoryFound = site.findCategoryOnPage(pageData);
        should(categoryFound).equal(category);
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = site.findNameOnPage(pageData, category);
        should(nameFound).equal(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = site.findNameOnPage(badPageData, category);
        should(nameFound).be.null();
      });
    });
  });
});
