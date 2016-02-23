'use strict';

const async = require('async');
/* eslint-disable prefer-const */

// TODO no const for testing https://github.com/jhnns/rewire/issues/79
let request = require('request');
/* eslint-enable prefer-const */
const cheerio = require('cheerio');
const extend = require('xtend');
const siteManager = require('./site-manager');
const logger = require('./logger')();

const DEFAULT_OPTIONS = {
  headers: {
    'User-Agent': 'Mozilla/5.0',
  },
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
    this._pageScrape(site, (err, pageData) => {
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
    this._pageScrape(site, (err, pageData) => {
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
        logger.log('using request to get page data for uri: %s', site.getURIForPageData());
        request({
          uri: site.getURIForPageData(),
          headers: this._config.headers,
        }, (err, response, body) => {
          if (err) {
            return whilstCallback(err);
          }

          if (response) {
            if (response.statusCode === 200) {
              logger.log('response statusCode is 200, parsing body to pageData');

              // good response
              if (site.isJSON()) {
                // parse the body to grab the JSON
                pageData = JSON.parse(body);
              } else {
                // build jquery object using cheerio
                pageData = cheerio.load(body);
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
              return whilstCallback('response status: %s', response.statusCode);
            }
          } else {
            return whilstCallback('no response object found!');
          }
        });
      },

      // once we have the pageData, or error, return
      (err) => callback(err, pageData)
    );
  }
}

module.exports = PriceFinder;
