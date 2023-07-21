# price-finder #

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Finds the price of retail items online by scraping the web page.

## Quick Example ##

```typescript
import PriceFinder from 'price-finder';
const priceFinder = new PriceFinder();

// Led Zeppelin II vinyl (from Amazon)
const uri = 'https://www.amazon.com/Led-Zeppelin-II/dp/B00IXHBUG0';
const price = priceFinder.findItemPrice(uri);
console.log(price); // 22.97
```

## Price Finder Documentation ##

- [Configuration Options](#configuration-options)
- [API](#api)
  - [findItemPrice(uri)](#finditempriceuri-callback)
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

```typescript
import PriceFinder from 'price-finder';

const priceFinder = new PriceFinder({
  retrySleepTime: 2000,
});
```

### API ###

#### `async findItemPrice(uri: string): number` ####

Given a `uri` (that is for a [supported site](#supported-sites)), this function will scrape the page and attempt to find the current price listed on the page. The result will be returned asynchronously.

If problems occur during processing, an Error will be thrown.

### Debugging Price Finder ###

The <a href="https://www.npmjs.org/package/pino">pino</a> package is used within price-finder to output debugging information useful in tracking down any potential issues.

### Supported Sites ###

The current supported sites are listed below.

- Amazon

Don't see your site listed? Please consider [contributing](#contributing) to the project!

### Contributing ###

The price-finder project is a [Node.js](http://nodejs.org/) module, so before cloning the repository make sure node is installed. Once cloned, install dependencies by issuing:

```
$ yarn
```

#### Tests ####

The project uses [Jest](https://jestjs.io/) for tests (please add tests for any new features).

##### Unit Tests #####

To run the unit tests execute:

```
$ yarn test
```

These tests can be run in watch mode, listening for any file changes and re-running when that occurs. To do so execute:

```
$ yarn test:watch
```

##### End To End Tests #####

End-to-end tests exist which will test the price-finder module using real URIs, scraping the pages to verify the code works correctly. 

_Note that these tests should be run on a limited basis while coding since some sites have been known to throw up CAPTCHA's after repeated, automated page requests._

To execute the end to end tests run:

```
$ yarn test:e2e
```

#### Adding Sites ####

This project was built to easily drop in support for new sites. The `site-manager` iterates over all files contained within the `sites` directory, and adds it to the list of available sites. When a request is issued to price-finder to look up a price, it asks each site if the `uri` is supported by the site, and if so, uses that site to find the price.


## Etc ##

- [Contributors](https://github.com/dylants/price-finder/graphs/contributors)
- [![License][license-image]][license-url]
- [![Node Version][node-image]][node-url]

[npm-image]: https://img.shields.io/npm/v/price-finder.svg
[npm-url]: https://npmjs.org/package/price-finder
[downloads-image]: https://img.shields.io/npm/dm/price-finder.svg
[downloads-url]: https://npmjs.org/package/price-finder
[license-image]: https://img.shields.io/github/license/dylants/price-finder.svg
[license-url]: LICENSE
[node-image]: https://img.shields.io/node/v/price-finder.svg
[node-url]: https://npmjs.org/package/price-finder
