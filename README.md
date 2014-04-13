# price-finder #

[![Build Status](https://travis-ci.org/dylants/price-finder.svg)](https://travis-ci.org/dylants/price-finder) [![Dependency Status](https://david-dm.org/dylants/price-finder.svg)](https://david-dm.org/dylants/price-finder)

The price-finder module helps find the price of retail items online. It does this by
taking in a URI for a webpage that displays the product information, and scrapes the
page to find the price (optionally able to find the name and category of products as
well).

## Quick Examples ##

```JavaScript
var priceFinder = require("price-finder");

priceFinder.findItemPrice("http://www.amazon.com/product/dp/B000002J5K", function(err, price) {
    console.log(price); // 9.95
});

priceFinder.findItemDetails("http://www.amazon.com/product/dp/B001AQO446", function(err, itemDetails) {
   console.log(itemDetails.price);    // 12.95
   console.log(itemDetails.name);     // The Blues Brothers [Blu-ray] (1980)
   console.log(itemDetails.category); // Movies & TV
});
```
## API ##

### findItemPrice(`uri`, `callback`)

Given a <code>uri</code> (that is for a [supported site](#supported-sites)), this
function will scrape the page and attempt to find the current price listed on the page,
sending it to the <code>callback</code>.  The <code>callback</code>'s arguments are:
<ul>
<li><code>error</code> : If an error occurred during processing, this will contain
the error information. If no errors occurred, this will be <code>null</code>.</li>
<li><code>price</code> : The current price of the item listed on the page (a
<code>Number</code>).</li>
</ul>

### findItemDetails(`uri`, `callback`)

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

The current supported sites are:

<ul>
<li>Amazon</li>
<li>Google Play (*currently only supports finding item price)</li>
<li>Best Buy (*currently only supports finding item price)</li>
</ul>

Don't see your site listed? Please consider [contributing](#contributing) to the project!

## Contributing ##

The price-finder project is a [Node.js](http://nodejs.org/) module, so before
cloning the repository make sure node is installed. Once cloned, install dependencies
by issuing:

<code>npm install</code>

The project uses [Jasmine](http://jasmine.github.io/) for tests. To run the tests,
execute:

<code>npm test</code>

(Please add tests for any new features.)

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
