# price-finder #

[![Build Status](https://travis-ci.org/dylants/price-finder.svg)](https://travis-ci.org/dylants/price-finder) [![Dependency Status](https://david-dm.org/dylants/price-finder.svg)](https://david-dm.org/dylants/price-finder) [![NPM version](https://badge.fury.io/js/price-finder.svg)](http://badge.fury.io/js/price-finder)

The price-finder module helps find the price of retail items online. It does this by
taking in a URI for a webpage that displays the product information, and scrapes the
page to find the price (optionally able to find the name and category of products as
well).

## Quick Examples ##

### Find an item's current price online ###

```JavaScript
var PriceFinder = require("price-finder");

var priceFinder = new PriceFinder();

// Atoms for Peace : Amok  (from Amazon)
var uri = "http://www.amazon.com/Amok/dp/B00BIQ1EL4";
priceFinder.findItemPrice(uri, function(err, price) {
    console.log(price); // 8.91
});

// Ferris Bueller's Day Off  (from BestBuy)
uri = "http://www.bestbuy.com/site/ferris-buellers-day-off-dvd/7444513.p?id=47476&skuId=7444513";
priceFinder.findItemPrice(uri, function(err, price) {
    console.log(price); // 3.99
});

```
### Find additional details on an item, including price ###

```JavaScript
var PriceFinder = require("price-finder");

var priceFinder = new PriceFinder();

// Plants vs Zombies  (from Google Play)
var uri = "https://play.google.com/store/apps/details?id=com.popcap.pvz_na";
priceFinder.findItemDetails(uri, function(err, itemDetails) {
    console.log(itemDetails.price);    // 0.99
    console.log(itemDetails.name);     // Plants vs. Zombies™
    console.log(itemDetails.category); // Mobile Apps
});

// Blues Brothers  (from Amazon)
uri = "http://www.amazon.com/Blues-Brothers-Blu-ray-John-Belushi/dp/B001AQO446";
priceFinder.findItemDetails(uri, function(err, itemDetails) {
    console.log(itemDetails.price);    // 13.01
    console.log(itemDetails.name);     // The Blues Brothers [Blu-ray] (1980)
    console.log(itemDetails.category); // Movies & TV
});
```

## Price Finder Documentation ##

### Configuration Options ###

When creating a new PriceFinder object, a configuration object can be specified.
For example:

```JavaScript
var PriceFinder = require("price-finder");

var priceFinder = new PriceFinder({
    debug: true 
});
```

The following options are configurable:

<ul>
    <li><code>debug</code> : When true, will enable debug logging to console
    (defaults to false)</li>
</ul>

### API ###

#### findItemPrice(`uri`, `callback`) ####

Given a <code>uri</code> (that is for a [supported site](#supported-sites)), this
function will scrape the page and attempt to find the current price listed on the page,
sending it to the <code>callback</code>.  The <code>callback</code>'s arguments are:
<ul>
<li><code>error</code> : If an error occurred during processing, this will contain
the error information. If no errors occurred, this will be <code>null</code>.</li>
<li><code>price</code> : The current price of the item listed on the page (a
<code>Number</code>).</li>
</ul>

#### findItemDetails(`uri`, `callback`) ####

Given a <code>uri</code> (that is for a [supported site](#supported-sites)), this
function will scrape the page and attempt to find the item details listed on the page,
sending it to the <code>callback</code>.  The <code>callback</code>'s arguments are:
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

## Supported Sites ##

The current supported sites, along with categories supported within each site,
are listed below.

<ul>
<li>Amazon</li>
    <ul>
        <li>Digital Music</li>
        <li>Video Games</li>
        <li>Mobile Apps</li>
        <li>Movies & TV</li>
        <li>Camera & Video</li>
        <li>Toys & Games</li>
        <li>Kindle Books</li>
        <li>Books</li>
        <li>Household</li>
        <li>Health & Personal Care</li>
    </ul>
<li>Google Play</li>
    <ul>
        <li>Music</li>
        <li>Movies & TV</li>
        <li>Android Apps</li>
    </ul>
<li>Best Buy</li>
    <ul>
        <li>Movies & TV</li>
        <li>Music</li>
        <li>Video Games</li>
    </ul>
</ul>

Don't see your site listed? Please consider [contributing](#contributing) to the project!

## Contributing ##

The price-finder project is a [Node.js](http://nodejs.org/) module, so before
cloning the repository make sure node is installed. Once cloned, install dependencies
by issuing:

<code>npm install</code>

### Tests ###

The project uses [Jasmine](http://jasmine.github.io/) for tests (please add tests
for any new features). To run the unit tests execute:

<code>npm test</code>

These tests can additionally be run once, while watching the files for any changes,
and if that occurs, re-run the tests. To do so execute:

<code>npm run test-watch</code>

End-to-end tests exist which will test the price-finder module using real URIs, scraping
the pages to verify the code works correctly. Note that these tests should be run on
a limited basis while coding since some sites have been known to throw up CAPTCHA's
after repeated, automated page requests. To execute these tests run:

<code>npm run test-e2e</code>

### Adding Sites ###

This project was built to easily drop in support for new sites. The
<code>site-manager</code> iterates over all files contained within the
<code>sites</code> directory, and adds it to the list of available sites. When a 
request is issued to price-finder to look up a price, it asks each site if the
<code>uri</code> is supported by the site, and if so, uses that site to find the
price (or name, category).

The site interface is:

```JavaScript
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
     * @param  {Object} $ jQuery object used to search the page
     * @return {String}   The price found on the page
     */
    function findPriceOnPage($);

    /**
     * Returns the category of the item found on the page
     * 
     * @param  {Object} $ jQuery object used to search the page
     * @return {String}   The category found on the page
     */
    function findCategoryOnPage($);

    /**
     * Returns the name of the item found on the page
     * 
     * @param  {Object} $        jQuery object used to search the page
     * @param  {String} category The product's category
     * @return {String}          The category found on the page
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

## License ##

[MIT](https://github.com/dylants/price-finder/blob/master/LICENSE)
