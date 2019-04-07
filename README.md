# price-finder #

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]

Finds the price of retail items online, either by scraping the web page or
through product APIs.

## Quick Examples ##

### Find an item's current price online ###

```javascript
const PriceFinder = require('price-finder');
const priceFinder = new PriceFinder();

// Atoms for Peace : Amok  (from Amazon)
const uri = 'http://www.amazon.com/Amok/dp/B00BIQ1EL4';
priceFinder.findItemPrice(uri, function(err, price) {
    console.log(price); // 8.91
});
```
### Find the price, name, and category of an item online ###

```javascript
const PriceFinder = require('price-finder');
const priceFinder = new PriceFinder();

// Plants vs Zombies  (from Google Play)
let uri = 'https://play.google.com/store/apps/details?id=com.popcap.pvz_na';
priceFinder.findItemDetails(uri, function(err, itemDetails) {
    console.log(itemDetails.price);    // 0.99
    console.log(itemDetails.name);     // Plants vs. Zombies™
    console.log(itemDetails.category); // Mobile Apps
});

// Don't Starve  (from Steam)
uri = 'http://store.steampowered.com/app/219740';
priceFinder.findItemDetails(uri, function(err, itemDetails) {
    console.log(itemDetails.price);    // 14.99
    console.log(itemDetails.name);     // Don't Starve
    console.log(itemDetails.category); // Video Games
});
```

## Price Finder Documentation ##

- [Configuration Options](#configuration-options)
- [API](#api)
  - [findItemPrice(`uri`, `callback`)](#finditempriceuri-callback)
  - [findItemDetails(`uri`, `callback`)](#finditemdetailsuri-callback)
- [Debugging Price Finder](#debugging-price-finder)
- [Supported Sites](#supported-sites)
- [Contributing](#contributing)
  - [Tests](#tests)
  - [Adding Sites](#adding-sites)

### Configuration Options ###

When creating a new PriceFinder object, a configuration object can be specified.
The following options are configurable:

- `retryStatusCodes` : An array of status codes (Numbers) which when returned
from the page scrape request, will trigger a retry request (meaning it will
attempt to scrape the page again). Defaults to `[503]`.
- `retrySleepTime` : If a retry status code is returned from a page scrape
request, this is the amount of time (in milliseconds) that the code will sleep
prior to re-issuing the request. Defaults to `1000` (ms).

For example:

```javascript
const PriceFinder = require('price-finder');

const priceFinder = new PriceFinder({
  retrySleepTime: 2000,
});
```

### API ###

#### findItemPrice(`uri`, `callback`) ####

Given a `uri` (that is for a [supported site](#supported-sites)), this
function will scrape the page and attempt to find the current price listed on
the page, sending it to the `callback`. The `callback`'s arguments are:

- `error` : If an error occurred during processing, this will contain the error
information. If no errors occurred, this will be `null`.
- `price` : The current price of the item listed on the page (a `Number`).

#### findItemDetails(`uri`, `callback`) ####

Given a `uri` (that is for a [supported site](#supported-sites)), this
function will scrape the page and attempt to find the item details listed on
the page, sending it to the `callback`. The `callback`'s arguments are:

- `error` : If an error occurred during processing, this will contain the error
information. If no errors occurred, this will be `null`.
- `itemDetails` : This object contains three things:
  - `price` : The current price of the item listed on the page (a `Number`).
  - `name` : The name of the product (if supported by the site implementation).
  - `category` : The category of the product (if supported by the site
    implementation).

### Debugging Price Finder ###

The <a href="https://www.npmjs.org/package/debug">debug</a> package is used
within price-finder to output debugging information useful in tracking
down any potential issues. To enable, export the `DEBUG` environment
variable set to `price-finder*` to pick up all files (or include a
specific library to only enable a certain module). For example:

```
$ DEBUG=price-finder* node app.js
```

### Supported Sites ###

The current supported sites are listed below.

- Amazon
- Best Buy
  - API support is available but requires an API key.  To enable, set the
   `BESTBUY_KEY` environment variable to the value of the API key. For more
   information on how to obtain an API key, refer to the
   [Best Buy developer documentation](https://developer.bestbuy.com).
- Crutchfield
- eBags
- GameStop
- GOG
- Google Play
- Greenman Gaming (\*)
- Infibeam (\*)
- Newegg
- Nintendo
- PriceMinister (\*)
- Snapdeal
- Sony Playstation
- Steam
- Target
- Thinkgeek
- Walmart

(\*Support unknown at this time)

Don't see your site listed? Please consider [contributing](#contributing) to
the project!

### Contributing ###

The price-finder project is a [Node.js](http://nodejs.org/) module, so before
cloning the repository make sure node is installed. Once cloned, install
dependencies by issuing:

```
$ npm install
```

#### Tests ####

The project uses the [Mocha test framework](https://mochajs.org/) along with
the [Should assertion library](http://shouldjs.github.io/) for tests (please add
tests for any new features).

##### Unit Tests #####

To run the unit tests execute:

```
$ npm test
```

These tests can be run in watch mode, listening for any file changes and
re-running when that occurs. To do so execute:

```
$ npm run test:watch
```

##### End To End Tests #####

End-to-end tests exist which will test the price-finder module using real URIs,
scraping the pages to verify the code works correctly. Because these tests can
take a while to run, debug logging has been enabled in the npm script.

_Note that these tests should be run on a limited basis while coding since some
sites have been known to throw up CAPTCHA's after repeated, automated page requests._

To execute the end to end tests run:

```
$ npm run test-e2e
```

If you would like to run a single end to end test (rather than all of them),
use the `test-e2e-single` script. For example:

```
$ npm run test-e2e-single test/e2e/amazon-uris-test.js
```

#### Adding Sites ####

This project was built to easily drop in support for new sites. The
`site-manager` iterates over all files contained within the
`sites` directory, and adds it to the list of available sites. When a
request is issued to price-finder to look up a price, it asks each site if the
`uri` is supported by the site, and if so, uses that site to find the
price (or name, category).

##### Yeoman Generator #####

A generator exists to create the site, along with the site's unit and end
to end test. For more information on this generator, please see the project page:
https://github.com/dylants/generator-price-finder-site

For reference, the site interface is:

```javascript
class Site {
  constructor(uri) {
    // init Site, save off uri
  }

  /**
   * Returns the URI used to find the page data
   * (most likely the same URI used in constructing this Site)
   *
   * @return {String} The URI used to find the page data
   */
  getURIForPageData();

  /**
   * Returns true if the page data is JSON
   *
   * @return {Boolean} true if the page data is JSON, false otherwise
   */
  isJSON();

  /**
   * Returns the price found on the page
   *
   * @param  {Object} $/pageData jQuery object used to search the page, or
   *                             JSON page data if JSON based site
   * @return {String}            The price found on the page
   */
  findPriceOnPage($);

  /**
   * Returns the category of the item found on the page
   *
   * @param  {Object} $/pageData jQuery object used to search the page, or
   *                             JSON page data if JSON based site
   * @return {String}            The category found on the page
   */
  findCategoryOnPage($);

  /**
   * Returns the name of the item found on the page
   *
   * @param  {Object} $/pageData jQuery object used to search the page,
   *                             or JSON page data if JSON based site
   * @param  {String} category   The product's category
   * @return {String}            The name found on the page
   */
  findNameOnPage($, category);

  /**
   * Returns true if this site supports the incoming URI
   *
   * @param  {String}  uri The URI to test
   * @return {Boolean}     true if this Site supports the URI, false otherwise
   */
  static isSite(uri);
}
```

## Etc ##

- [Contributors](https://github.com/dylants/price-finder/graphs/contributors)
- [![License][license-image]][license-url]
- [![Dependency Status][david-image]][david-url]
- [![Node Version][node-image]][node-url]

[npm-image]: https://img.shields.io/npm/v/price-finder.svg
[npm-url]: https://npmjs.org/package/price-finder
[downloads-image]: https://img.shields.io/npm/dm/price-finder.svg
[downloads-url]: https://npmjs.org/package/price-finder
[travis-image]: https://img.shields.io/travis/dylants/price-finder/master.svg
[travis-url]: https://travis-ci.org/dylants/price-finder
[license-image]: https://img.shields.io/github/license/dylants/price-finder.svg
[license-url]: LICENSE
[david-image]: https://img.shields.io/david/dylants/price-finder.svg
[david-url]: https://david-dm.org/dylants/price-finder
[node-image]: https://img.shields.io/node/v/price-finder.svg
[node-url]: https://npmjs.org/package/price-finder
