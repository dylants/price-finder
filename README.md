# price-finder #

[![Build Status](https://travis-ci.org/dylants/price-finder.svg)](https://travis-ci.org/dylants/price-finder) [![NPM version](https://badge.fury.io/js/price-finder.svg)](http://badge.fury.io/js/price-finder)

[![NPM](https://nodei.co/npm/price-finder.svg?downloads=true)](https://nodei.co/npm/price-finder/)

The price-finder module helps find the price of retail items online. It does this by
taking in a URI for a webpage that displays the product information, and scrapes the
page to find the price (optionally able to find the name and category of products as
well).

## Quick Examples ##

### Find an item's current price online ###

```javascript
var PriceFinder = require("price-finder");

var priceFinder = new PriceFinder();

// Atoms for Peace : Amok  (from Amazon)
var uri = "http://www.amazon.com/Amok/dp/B00BIQ1EL4";
priceFinder.findItemPrice(uri, function(err, price) {
    console.log(price); // 8.91
});
```
### Find an item's current price using service that requires API key ###

```javascript
var PriceFinder = require("price-finder");

var priceFinder = new PriceFinder({keys:{bestbuy:"Key from developer.bestbuy.com"}});

// Ferris Bueller's Day Off  (from BestBuy)
var uri = "http://www.bestbuy.com/site/ferris-buellers-day-off-dvd/7444513.p?id=47476&skuId=7444513";
priceFinder.findItemPrice(uri, function(err, price) {
    console.log(price); // 3.99
});

```
### Find additional details on an item, including price ###

```javascript
var PriceFinder = require("price-finder");

var priceFinder = new PriceFinder();

// Plants vs Zombies  (from Google Play)
var uri = "https://play.google.com/store/apps/details?id=com.popcap.pvz_na";
priceFinder.findItemDetails(uri, function(err, itemDetails) {
    console.log(itemDetails.price);    // 0.99
    console.log(itemDetails.name);     // Plants vs. Zombies™
    console.log(itemDetails.category); // Mobile Apps
});

// PixelJunk Monsters  (from Sony Entertainment Network / Playstation Store)
uri = "https://store.playstation.com/#!/en-us/games/pixeljunk-monsters/cid=UP9000-NPUA80108_00-PJMONSTSFULL0001";
priceFinder.findItemDetails(uri, function(err, itemDetails) {
    console.log(itemDetails.price);    // 9.99
    console.log(itemDetails.name);     // PixelJunk™ Monsters
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

<ul>
    <li><code>headers</code> : Any HTTP headers that should be sent within the page
    scrape request. Defaults to <code>"User-Agent": "Mozilla/5.0"</code>.</li>
    <li><code>retryStatusCodes</code> : An array of status codes (Numbers) which
    when returned from the page scrape request, will trigger a retry request
    (meaning it will attempt to scrape the page again). Defaults to
    <code>[503]</code>.</li>
    <li><code>retrySleepTime</code> : If a retry status code is returned from a
    page scrape request, this is the amount of time (in milliseconds) that the
    code will sleep prior to re-issuing the request. Defaults to
    <code>1000</code> (ms).</li>
    <li><code>keys</code> : An object of API keys required by services dependent upon keys. The following is the complete list of API services requiring keys:
    <table><thead><tr><th>Service</th><th>Object Key</th><th>Environment Variable Override</th></tr></thead>
    <tbody>
        <tr>
            <td><a href="https://developer.bestbuy.com">Best Buy</a></td><td><code>bestbuy</code></td><td><code>BESTBUY_KEY</code></td></tr>
    </tbody>
    </table>
    </li>
</ul>

For example:

```javascript
var PriceFinder = require("price-finder");

var priceFinder = new PriceFinder({
    retrySleepTime: 2000,
    keys: {
        "sampleService": "abc123"
    }
});
```

### API ###

#### findItemPrice(`uri`, `callback`) ####

Given a `uri` (that is for a [supported site](#supported-sites)), this
function will scrape the page and attempt to find the current price listed on the page,
sending it to the `callback`. The `callback`'s arguments are:
<ul>
    <li><code>error</code> : If an error occurred during processing, this will contain
    the error information. If no errors occurred, this will be <code>null</code>.</li>
    <li><code>price</code> : The current price of the item listed on the page (a
    <code>Number</code>).</li>
</ul>

#### findItemDetails(`uri`, `callback`) ####

Given a `uri` (that is for a [supported site](#supported-sites)), this
function will scrape the page and attempt to find the item details listed on the page,
sending it to the `callback`. The `callback`'s arguments are:
<ul>
<li><code>error</code> : If an error occurred during processing, this will contain
the error information. If no errors occurred, this will be <code>null</code>.</li>
<li><code>itemDetails</code> : This object contains three things:
    <ul>
        <li><code>price</code> : The current price of the item listed on the page (a
        <code>Number</code>).</li>
        <li><code>name</code> : The name of the product (if supported by the site
        implementation).</li>
        <li><code>category</code> : The category of the product (if supported by
        the site implementation).</li>
    </ul>
</ul>

### Debugging Price Finder ###

The <a href="https://www.npmjs.org/package/debug">debug</a> package is used
within price-finder to output debugging information useful in tracking
down any potential issues. To enable, export the `DEBUG` environment
variable set to `price-finder*` to pick up all files (or include a
specific library to only enable a certain module). For example:

`$ DEBUG=price-finder* node app.js`

### Supported Sites ###

The current supported sites, along with categories supported within each site,
are listed below.

* Amazon (support for more than just .com)
    * Digital Music
    * Video Games
    * Mobile Apps
    * Movies & TV
    * Camera & Video
    * Toys & Games
    * Kindle Books
    * Books
    * Household
    * Health & Personal Care
* Google Play
    * Music
    * Movies & TV
    * Android Apps
* Best Buy
    * Everything available on bestbuy.com
* Sony Entertainment Network Store
    * Video Games
* GameStop
    * Video Games
* Crutchfield
    * Television & Video
    * Home Audio
* PriceMinister
    * Video Games
* eBags
    * Luggage
* Nintendo
    * Video Games

Don't see your site listed? Please consider [contributing](#contributing) to the project!

### Contributing ###

The price-finder project is a [Node.js](http://nodejs.org/) module, so before
cloning the repository make sure node is installed. Once cloned, install dependencies
by issuing:

`$ npm install`

#### Tests ####

The project uses [Jasmine](http://jasmine.github.io/) for tests (please add tests
for any new features).

##### Unit Tests #####

To run the unit tests execute:

`$ npm test`

These tests can be run in watch mode, listening for any file changes and re-running when
that occurs. To do so execute:

`$ npm run test-watch`

##### End To End Tests #####

End-to-end tests exist which will test the price-finder module using real URIs, scraping
the pages to verify the code works correctly. Because these tests can take a while to run,
debug logging has been enabled in the npm script.

The end to end tests for Best Buy require a developer API key available in the
environment via the `BESTBUY_KEY` environment variable. For more information, please consult
the site: https://developer.bestbuy.com.

_Note that these tests should be run on a limited basis while coding since some sites have
been known to throw up CAPTCHA's after repeated, automated page requests._

To execute the end to end tests run:

`$ BESTBUY_KEY=<key> npm run test-e2e`

Where `<key>` is the developer API key for Best Buy.

#### Adding Sites ####

This project was built to easily drop in support for new sites. The
`site-manager` iterates over all files contained within the
`sites` directory, and adds it to the list of available sites. When a
request is issued to price-finder to look up a price, it asks each site if the
`uri` is supported by the site, and if so, uses that site to find the
price (or name, category).

The site interface is:

```javascript
function Site(uri) {

    /**
     * Returns the URI used to find the page data
     * (most likely the same URI used in constructing this Site)
     *
     * @return {String} The URI used to find the page data
     */
    function getURIForPageData();

    /**
     * Returns true if the page data is JSON
     *
     * @return {Boolean} true if the page data is JSON, false otherwise
     */
    function isJSON();

    /**
     * Returns the price found on the page
     *
     * @param  {Object} $/pageData jQuery object used to search the page, or
     *                             JSON page data if JSON based site
     * @return {String}            The price found on the page
     */
    function findPriceOnPage($);

    /**
     * Returns the category of the item found on the page
     *
     * @param  {Object} $/pageData jQuery object used to search the page, or
     *                             JSON page data if JSON based site
     * @return {String}            The category found on the page
     */
    function findCategoryOnPage($);

    /**
     * Returns the name of the item found on the page
     *
     * @param  {Object} $/pageData jQuery object used to search the page,
     *                             or JSON page data if JSON based site
     * @param  {String} category   The product's category
     * @return {String}            The name found on the page
     */
    function findNameOnPage($, category);
}

/**
 * Returns true if this site supports the incoming URI
 *
 * @param  {String}  uri The URI to test
 * @return {Boolean}     true if this Site supports the URI, false otherwise
 */
Site.isSite = function(uri);
```

## Etc ##

- Licence: [MIT](https://github.com/dylants/price-finder/blob/master/LICENSE)
- Dependency Status: [![Dependency Status](https://david-dm.org/dylants/price-finder.svg)](https://david-dm.org/dylants/price-finder)
