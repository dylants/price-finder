import Site from './Site';
import logger from './logger';
import siteManager from './site-manager';
import async, { AsyncBooleanResultCallback } from 'async';
import * as cheerio from 'cheerio';
import _ from 'lodash';
import request from 'superagent';

interface Config {
  retrySleepTime: number;
  retryStatusCodes: number[];
}

interface Options {
  retrySleepTime?: number;
  retryStatusCodes?: number[];
}

const DEFAULT_OPTIONS = {
  retrySleepTime: 1000,
  retryStatusCodes: [503],
};

export default class PriceFinder {
  public config: Config;
  constructor(options: Options | undefined = undefined) {
    logger.debug('initializing PriceFinder');
    logger.debug('user supplied options: %j', options);

    // merge options, taking the user supplied if duplicates exist
    this.config = _.extend(DEFAULT_OPTIONS, options);
    logger.debug('merged config: %j', this.config);
  }

  /**
   * Scrapes a website specified by the uri and finds the item price.
   *
   * @param  {string}   uri      The uri of the website to scan
   * @param  {Function} callback Callback called when complete, with first argument
   *                             a possible error object, and second argument the
   *                             item price (number).
   */
  findItemPrice(
    uri: string,
    callback: (err: unknown | string | null, price: number | undefined) => void,
  ) {
    logger.debug('findItemPrice with uri: %s', uri);

    let site: Site;
    try {
      site = siteManager.loadSite(uri);
    } catch (error: unknown) {
      logger.error('error loading site: ', error);
      if (error instanceof Error) {
        return callback((<Error>error).message, undefined);
      } else {
        return callback(error, undefined);
      }
    }

    logger.debug('scraping the page...');

    // page scrape the site to load the page data
    return this.pageScrape(site, (err, pageData) => {
      if (err) {
        logger.error('error retrieving pageData: ', err);
        return callback(err, undefined);
      }

      logger.debug('pageData found, loading price from site...');

      // find the price on the website
      const price = site.findPriceOnPage(pageData);

      // error check
      if (price === -1) {
        logger.error('unable to find price');
        return callback(`unable to find price for uri: ${uri}`, undefined);
      }

      logger.debug('price found, returning price: %s', price);

      // call the callback with the item price (null error)
      return callback(null, price);
    });
  }

  // ==================================================
  // ============== PRIVATE FUNCTIONS =================
  // ==================================================
  private pageScrape(
    site: Site,
    callback: (
      err: Error | null | undefined,
      pageData: cheerio.CheerioAPI,
    ) => void,
  ) {
    let pageData: cheerio.CheerioAPI;

    async.whilst(
      // run until we get page data
      (cb: AsyncBooleanResultCallback<Error>) => cb(null, !pageData),

      // hit the site to get the item details
      (whilstCallback) => {
        logger.debug('scraping uri: %s', site.getURIForPageData());
        request
          .get(site.getURIForPageData())
          .set('User-Agent', 'Mozilla')
          .set('Accept-Language', 'en-US')
          .set('Accept', 'text/html')
          // TODO any type
          // rome-ignore lint/suspicious/noExplicitAny: use any for now
          .end((err: any, response: request.Response) => {
            if (err) {
              return whilstCallback(err);
            }

            if (response) {
              if (response.statusCode === 200) {
                logger.debug('response statusCode is 200, retrieving pageData');

                // load the text of the page through cheerio
                pageData = cheerio.load(response.text);

                return whilstCallback(null);
              } else if (
                this.config.retryStatusCodes.indexOf(response.statusCode) > -1
              ) {
                // if we get a statusCode that we should retry, try again
                logger.debug(
                  'response status part of retryStatusCodes, status: %s, retrying...',
                  response.statusCode,
                );

                logger.debug(`sleeping for: ${this.config.retrySleepTime}ms`);
                return setTimeout(
                  () => whilstCallback(),
                  this.config.retrySleepTime,
                );
              } else {
                // else it's a bad response status, all stop
                return whilstCallback(
                  new Error(`response status: ${response.statusCode}`),
                );
              }
            } else {
              return whilstCallback(new Error('no response object found!'));
            }
          });
      },

      // once we have the pageData, or error, return
      (err) => callback(err, pageData),
    );
  }
}

module.exports = PriceFinder;
