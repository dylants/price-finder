'use strict';

const async = require('async');
const request = require('superagent');
const cheerio = require('cheerio');
const extend = require('xtend');
const siteManager = require('./site-manager');
const logger = require('./logger')();

const DEFAULT_OPTIONS = {
  retryStatusCodes: [503],
  retrySleepTime: 1000,
};

class PriceFinder {
  constructor(options) {
    logger.log('initializing PriceFinder');
    logger.log('user supplied options: %j', options);

    // merge options, taking the user supplied if duplicates exist
    this._config = extend(DEFAULT_OPTIONS, options);
    logger.log('merged config: %j', this._config);
  }

  /**
   * Scrapes a website specified by the uri and finds the item price.
   *
   * @param  {String}   uri      The uri of the website to scan
   * @param  {Function} callback Callback called when complete, with first argument
   *                             a possible error object, and second argument the
   *                             item price (a Number).
   */
  findItemPrice(uri, callback) {
    logger.log('findItemPrice with uri: %s', uri);

    let site;
    try {
      site = siteManager.loadSite(uri, this._config);
    } catch (error) {
      logger.error('error loading site: ', error);
      if (error.message) {
        return callback(error.message);
      } else {
        return callback(error);
      }
    }

    logger.log('scraping the page...');

    // page scrape the site to load the page data
    return this._pageScrape(site, (err, pageData) => {
      if (err) {
        logger.error('error retrieving pageData: ', err);
        return callback(err);
      }

      logger.log('pageData found, loading price from site...');

      // find the price on the website
      const price = site.findPriceOnPage(pageData);

      // error check
      if (price === -1) {
        logger.error('unable to find price');
        return callback(`unable to find price for uri: ${uri}`);
      }

      logger.log('price found, returning price: %s', price);

      // call the callback with the item price (null error)
      return callback(null, price);
    });
  }

  /**
   * Scrapes a website specified by the uri and gathers the item details, which
   * consists of the item's name, category, and current price found on the page.
   *
   * @param  {String}   uri      The uri of the website to scan
   * @param  {Function} callback Callback called when complete, with first argument
   *                             a possible error object, and second argument the
   *                             item details. The item details consists of a name,
   *                             category, and price.
   */
  findItemDetails(uri, callback) {
    logger.log('findItemPrice with uri: %s', uri);

    let site;
    try {
      site = siteManager.loadSite(uri, this._config);
    } catch (error) {
      logger.error('error loading site: ', error);
      if (error.message) {
        return callback(error.message);
      } else {
        return callback(error);
      }
    }

    logger.log('scraping the page...');

    // page scrape the site to find the item details
    return this._pageScrape(site, (err, pageData) => {
      if (err) {
        logger.error('error retrieving pageData: ', err);
        return callback(err);
      }

      logger.log('pageData found, loading price from site...');

      const itemDetails = {};

      // find the price on the website
      itemDetails.price = site.findPriceOnPage(pageData);

      // error check
      if (itemDetails.price === -1) {
        logger.error('unable to find price');
        return callback(`unable to find price for uri: ${uri}`);
      }

      logger.log('price found, loading category from site...');

      // find the category on the page
      itemDetails.category = site.findCategoryOnPage(pageData);

      // find the name on the page (if we have the category)
      if (itemDetails.category) {
        logger.log('category found, loading name from site...');
        itemDetails.name = site.findNameOnPage(pageData, itemDetails.category);
      } else {
        logger.log('unable to find category, skipping name');
      }

      logger.log('returning itemDetails: %j', itemDetails);

      // call the callback with our item details (null error)
      return callback(null, itemDetails);
    });
  }

  // ==================================================
  // ============== PRIVATE FUNCTIONS =================
  // ==================================================
  _pageScrape(site, callback) {
    let pageData;

    async.whilst(

      // run until we get page data
      () => !pageData,

      // hit the site to get the item details
      (whilstCallback) => {
        logger.log('scraping uri: %s', site.getURIForPageData());
        request
          .get(site.getURIForPageData())
          .set('User-Agent', 'Mozilla')
          .set('Accept-Language', 'en-US')
          .set('Accept', site.isJSON ? 'application/json' : 'text/html')
          .end((err, response) => {
            if (err) {
              return whilstCallback(err);
            }

            if (response) {
              if (response.statusCode === 200) {
                logger.log('response statusCode is 200, retrieving pageData');

                // pull the page data based on if the site returns JSON
                if (site.isJSON()) {
                  // grab the body as JSON
                  pageData = response.body;
                } else {
                  // load the text of the page through cheerio
                  pageData = cheerio.load(response.text);
                }

                return whilstCallback();
              } else if (this._config.retryStatusCodes.indexOf(response.statusCode) > -1) {
                // if we get a statusCode that we should retry, try again
                logger.log('response status part of retryStatusCodes, status: %s, retrying...',
                  response.statusCode);

                logger.log(`sleeping for: ${this._config.retrySleepTime}ms`);
                return setTimeout(() => whilstCallback(), this._config.retrySleepTime);
              } else {
                // else it's a bad response status, all stop
                return whilstCallback(`response status: ${response.statusCode}`);
              }
            } else {
              return whilstCallback('no response object found!');
            }
          });
      },

      // once we have the pageData, or error, return
      err => callback(err, pageData),
    );
  }
}

module.exports = PriceFinder;
