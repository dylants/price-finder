import _ from 'lodash';
import accounting from 'accounting';
import logger from './logger';

const isNumber = (value: string) => !Number.isNaN(parseFloat(value));

// Represents the various categories of an online item
export const categories = Object.freeze({
  BOOKS: 'Books',
  CAMERA_VIDEO: 'Camera & Video',
  DIGITAL_MUSIC: 'Digital Music',
  ELECTRONICS: 'Electronics',
  HEALTH_PERSONAL_CARE: 'Health & Personal Care',
  HOME_AUDIO: 'Home Audio',
  HOUSEHOLD: 'Household',
  KINDLE_BOOKS: 'Kindle Books',
  LUGGAGE: 'Luggage',
  MOBILE: 'Mobile Phones',
  MOBILE_APPS: 'Mobile Apps',
  MOVIES_TV: 'Movies & TV',
  MUSIC: 'Music',
  OTHER: 'Other',
  TELEVISION_VIDEO: 'Television & Video',
  TOYS_GAMES: 'Toys & Games',
  VIDEO_GAMES: 'Video Games',
});

/**
 * Finds content on a page, returning either the text or null.
 *
 * @param  {any} $         jQuery-like object
 * @param  {Array<string>} selectors  An array of selectors to search with
 * @return {String | null}           The content found (or null)
 */
export function findContentOnPage(
  // TODO can we do better here than any?
  // rome-ignore lint/suspicious/noExplicitAny: use any for now
  $: any,
  selectors: Array<string>,
): string | null {
  logger.debug('selectors: %j', selectors);

  // use the find() API in case we're handed an inner jquery object
  const jQuery = _.isFunction($.find) ? $.find.bind($) : $;

  // loop until we find the content, or we exhaust our selectors
  for (let i = 0; i < selectors.length; i++) {
    const content = jQuery(selectors[i]);
    if (!_.isEmpty(content)) {
      logger.debug('found content with selector: %s', selectors[i]);

      // if it's an array, return the first element
      if (content.length && content.length > 1) {
        logger.debug('content is an array, attempting to return first entry');
        return jQuery(selectors[i])
          .first()
          .text()
          .trim();
      } else if (_.isFunction(content.text) && content.text().trim()) {
        // if we have text, return it
        return content.text().trim();
      } else {
        // nothing here, keep looking
      }
    }
  }

  // if we've not found anything, return null to signify that
  return null;
}

const DOLLAR_PREFIX = '$';
const DOLLAR_TEXT = 'usd';
const EURO_TEXT_PREFIX = 'eur';
const EURO_SYMBOL_PREFIX = '€';
const YEN_TEXT_PREFIX = '円';
const YEN_SYMBOL_PREFIX = '￥';
const GBP_SYMBOL_PREFIX = '£';
const GBP_TEXT_PREFIX = 'gbp';
const INR_SYMBOL_PREFIX = 'r';
const INR_TEXT_PREFIX = 'inr';

export function processPrice(priceStringInput: string): number {
  const priceString = priceStringInput.toLowerCase();

  logger.debug('price string (lowercased): %s', priceString);

  // currency specific processing
  let price;
  if (
    _.includes(priceString, DOLLAR_PREFIX) ||
    _.includes(priceString, DOLLAR_TEXT)
  ) {
    logger.debug('found dollar in price, converting to number...');
    price = accounting.unformat(priceString);
  } else if (
    _.includes(priceString, EURO_TEXT_PREFIX) ||
    _.includes(priceString, EURO_SYMBOL_PREFIX)
  ) {
    logger.debug('found euro in price, converting to number...');
    price = accounting.unformat(priceString, ',');
  } else if (
    _.includes(priceString, YEN_TEXT_PREFIX) ||
    _.includes(priceString, YEN_SYMBOL_PREFIX)
  ) {
    logger.debug('found yen in price, converting to number...');
    price = accounting.unformat(priceString);
  } else if (
    _.includes(priceString, GBP_SYMBOL_PREFIX) ||
    _.includes(priceString, GBP_TEXT_PREFIX)
  ) {
    logger.debug('found gbp in price, converting to number...');
    price = accounting.unformat(priceString);
  } else if (
    _.includes(priceString, INR_SYMBOL_PREFIX) ||
    _.includes(priceString, INR_TEXT_PREFIX)
  ) {
    logger.debug('found inr in price, converting to number...');
    price = accounting.unformat(priceString);
  } else {
    // if no currency symbol was found, verify it is a number
    logger.debug('no currency symbol was found, verifying this is a number');
    if (!isNumber(priceString)) {
      logger.debug(
        'price string is NOT a number, unable to process, returning -1',
      );
      price = -1;
    } else {
      logger.debug('price string is a number, using defaults to convert...');
      price = accounting.unformat(priceString);
    }
  }

  logger.debug('price (post-process): %s', price);
  return price;
}
