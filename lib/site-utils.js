'use strict';

const _ = require('lodash');
const accounting = require('accounting');
const logger = require('./logger')();

// Represents the various categories of an online item
exports.categories = Object.freeze({
  DIGITAL_MUSIC: 'Digital Music',
  MUSIC: 'Music',
  VIDEO_GAMES: 'Video Games',
  MOBILE_APPS: 'Mobile Apps',
  MOVIES_TV: 'Movies & TV',
  CAMERA_VIDEO: 'Camera & Video',
  TOYS_GAMES: 'Toys & Games',
  BOOKS: 'Books',
  KINDLE_BOOKS: 'Kindle Books',
  HOUSEHOLD: 'Household',
  HEALTH_PERSONAL_CARE: 'Health & Personal Care',
  TELEVISION_VIDEO: 'Television & Video',
  HOME_AUDIO: 'Home Audio',
  ELECTRONICS: 'Electronics',
  MOBILE: 'Mobile Phones',
  LUGGAGE: 'Luggage',
  OTHER: 'Other',
});

/**
 * Finds content on a page, returning either the text or null.
 *
 * @param  {Object} $         jQuery-like object
 * @param  {Array} selectors  An array of selectors to search with
 * @return {String}           The content found (or null)
 */
exports.findContentOnPage = function findContentOnPage($, selectors) {
  logger.log('selectors: %j', selectors);

  // use the find() API in case we're handed an inner jquery object
  const jQuery = _.isFunction($.find) ? $.find.bind($) : $;

  // loop until we find the content, or we exhaust our selectors
  for (let i = 0; i < selectors.length; i++) {
    const content = jQuery(selectors[i]);
    if (!_.isEmpty(content)) {
      logger.log('found content with selector: %s', selectors[i]);

      // if it's an array, return the first element
      if (content.length) {
        logger.log('content is an array, attempting to return first entry');
        return jQuery(selectors[i]).first().text().trim();
      } else {
        return content.text().trim();
      }
    }
  }

  // if we've not found anything, return null to signify that
  return null;
};

const DOLLAR_PREFIX = '$';
const EURO_TEXT_PREFIX = 'eur';
const EURO_SYMBOL_PREFIX = '€';
const YEN_TEXT_PREFIX = '円';
const YEN_SYMBOL_PREFIX = '￥';
const GBP_SYMBOL_PREFIX = '£';

exports.processPrice = function processPrice(priceStringInput) {
  const priceString = priceStringInput.toLowerCase();

  logger.log('price string (lowercased): %s', priceString);

  // currency specific processing
  let price;
  if (_.includes(priceString, DOLLAR_PREFIX)) {
    logger.log('found dollar in price, converting to number...');
    price = accounting.unformat(priceString);
  } else if (_.includes(priceString, EURO_TEXT_PREFIX) ||
    _.includes(priceString, EURO_SYMBOL_PREFIX)) {
    logger.log('found euro in price, converting to number...');
    price = accounting.unformat(priceString, ',');
  } else if (_.includes(priceString, YEN_TEXT_PREFIX) ||
    _.includes(priceString, YEN_SYMBOL_PREFIX)) {
    logger.log('found yen in price, converting to number...');
    price = accounting.unformat(priceString);
  } else if (_.includes(priceString, GBP_SYMBOL_PREFIX) ||
    _.includes(priceString, GBP_SYMBOL_PREFIX)) {
    logger.log('found gbp in price, converting to number...');
    price = accounting.unformat(priceString);
  } else {
    // unknown price type!!
    logger.error('unknown price type, unable to process, returning -1');
    price = -1;
  }

  logger.log('price (post-process): %s', price);
  return price;
};
