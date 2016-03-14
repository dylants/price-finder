'use strict';

const should = require('should');
const cheerio = require('cheerio');
const siteUtils = require('../../../lib/site-utils');
const NewEggSite = require('../../../lib/sites/newegg');

const VALID_URI = 'http://www.newegg.com/Product/Product.aspx?Item=N82E16875705040';
const INVALID_URI = 'http://www.bad.com/123/product';

describe('The NewEgg Site', () => {
  it('should exist', () => {
    should.exist(NewEggSite);
  });

  describe('isSite() function', () => {
    it('should return true for a correct site', () => {
      should(NewEggSite.isSite(VALID_URI)).be.true();
    });

    it('should return false for a bad site', () => {
      should(NewEggSite.isSite(INVALID_URI)).be.false();
    });
  });

  it('should throw an exception trying to create a new NewEggSite with an incorrect uri', () => {
    should.throws(() => {
      /* eslint-disable no-new */
      new NewEggSite(INVALID_URI);
      /* eslint-enable no-new */
    });
  });

  describe('a new NewEgg Site', () => {
    let newegg;

    beforeEach(() => {
      newegg = new NewEggSite(VALID_URI);
    });

    it('should exist', () => {
      should.exist(newegg);
    });

    it('should return the same URI for getURIForPageData()', () => {
      should(newegg.getURIForPageData()).equal(VALID_URI);
    });

    it('should return false for isJSON()', () => {
      should(newegg.isJSON()).be.false();
    });

    describe('with a populated page', () => {
      let $;
      let bad$;
      let price;
      let category;
      let name;

      beforeEach(() => {
        price = 329.98;
        category = siteUtils.categories.MOBILE;
        name = 'Axon by ZTE Unlocked GSM, 5.5", Qualcomm Snapdragon 801 2.4 GHz Quad-Core';

        $ = cheerio.load(`
          <html>
            <div id='grpDescrip_h'>${name}</div>
            <script type='text/javascript'>
              var utag_data = {
                foo:'bar',
                product_sale_price:['329.98'],
              };
            </script>
          </html>`);
        bad$ = cheerio.load('<h1>Nothin here</h1>');
      });

      it('should return the price when displayed on the page', () => {
        const priceFound = newegg.findPriceOnPage($);
        should(priceFound).equal(price);
      });

      it('should return -1 when the price is not found', () => {
        const priceFound = newegg.findPriceOnPage(bad$);
        should(priceFound).equal(-1);
      });

      it('should return the category when displayed on the page', () => {
        $ = cheerio.load(`<div id="baBreadcrumbTop" style="max-width:1420px; margin:0px auto;">
          <dl><dd class="egg"><a href="http://www.newegg.com/" class="noline">
          <img src="http://images10.newegg.com/WebResource/Themes/2005/Nest/whiteEgg.gif"
          alt="Home" title="Home"></a></dd><dd><a href="http://www.newegg.com/" title="Home">
          Home</a>&nbsp;&gt;&nbsp;</dd><dd><a href="http://www.newegg.com/Electronics/Store"
          title="Electronics">Electronics</a>&nbsp;&gt;&nbsp;</dd><dd>
          <a href="http://www.newegg.com/Cell-Phones-Unlocked/Category/ID-249?Tid=161538"
          title="Cell Phones - Unlocked">Cell Phones - Unlocked</a>&nbsp;&gt;&nbsp;</dd>
          <dd><a href="http://www.newegg.com/Cell-Phones-Unlocked/SubCategory/ID-2961?Tid=161551"
          title="Cell Phones - Unlocked">Cell Phones - Unlocked</a>&nbsp;&gt;&nbsp;</dd>
          <dd><a href="http://www.newegg.com/ZTE-Cell-Phones-Unlocked/BrandSubCat/ID-14576-2961"
          title="ZTE">ZTE</a>&nbsp;&gt;&nbsp;</dd>
          <dd style="font-weight:bold;font-style:italic;">Item#:&nbsp;<em>N82E16875705040</em>
          </dd></dl></div>`);
        const categoryFound = newegg.findCategoryOnPage($);
        should(categoryFound).equal(category);
      });

      it('should return OTHER when the category is not setup', () => {
        $ = cheerio.load(`<div id="baBreadcrumbTop" style="max-width:1420px; margin:0px auto;">
          <dl><dd class="egg"><a href="http://www.newegg.com/" class="noline">
          <img src="http://images10.newegg.com/WebResource/Themes/2005/Nest/whiteEgg.gif"
          alt="Home" title="Home"></a></dd><dd><a href="http://www.newegg.com/" title="Home">
          Home</a>&nbsp;&gt;&nbsp;</dd><dd><a href="http://www.newegg.com/Electronics/Store"
          title="Electronics">Electronics</a>&nbsp;&gt;&nbsp;</dd><dd>
          <a href="http://www.newegg.com/Cell-Phones-Unlocked/Category/ID-249?Tid=161538"
          title="Cell Phones - Unlocked"></a>&nbsp;&gt;&nbsp;</dd>
          <dd><a href="http://www.newegg.com/Cell-Phones-Unlocked/SubCategory/ID-2961?Tid=161551"
          title="Cell Phones - Unlocked"></a>&nbsp;&gt;&nbsp;</dd>
          <dd><a href="http://www.newegg.com/ZTE-Cell-Phones-Unlocked/BrandSubCat/ID-14576-2961"
          title="ZTE">ZTE</a>&nbsp;&gt;&nbsp;</dd>
          <dd style="font-weight:bold;font-style:italic;">Item#:&nbsp;<em>N82E16875705040</em>
          </dd></dl></div>`);
        const categoryFound = newegg.findCategoryOnPage($);
        should(categoryFound).equal(siteUtils.categories.OTHER);
      });

      it('should return null when the category does not exist', () => {
        const categoryFound = newegg.findCategoryOnPage(bad$);
        should(categoryFound).be.null();
      });

      it('should return the name when displayed on the page', () => {
        const nameFound = newegg.findNameOnPage($);
        should(nameFound).equal(name);
      });

      it('should return null when the name is not displayed on the page', () => {
        const nameFound = newegg.findNameOnPage(bad$);
        should(nameFound).be.null();
      });
    });
  });
});
