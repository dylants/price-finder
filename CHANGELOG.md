New Features:

- Support the new `playstation` URLs for the Sony Store
- Add more jshint'ing, include Grunt to test process
- Fully populate the changelog

Bug Fixes:

- Fix the Google Play site to support new page layout for some categories
- Replace stale links in e2e tests

# v2.0.0

New Features:

- Switch Best Buy from a page scrape to an API call to gather price information. For more information on how to obtain an API key, please visit https://developer.bestbuy.com.
- Add change log

# v1.3.0

New Features:

- Add PriceMinister support

# v1.2.1

New Features:

- Update cheerio and debug-caller to latest versions, and internal logger because of the changes.

# v1.2.0

New Features:

- Switch to using debug-caller instead of just debug
- Update dependencies to latest
- Run with 0.12, 0.10, and io.js in Travis

Bug Fixes:

- Fix failing e2e test

# v1.1.1

Bug Fixes:

- Includes updates to Amazon and Crutchfield finder logic to account for page changes.

# v1.1.0

New Features:

- Include better support for Amazon books

# v1.0.0

Release 1.0.0, move off of the 0.X.X releases (this has been stable long enough).

New Features:

- Include support for Crutchfield.com

Bug Fixes:

- Minor test fixes

# v0.4.3

New Features:

- Add support for GameStop
- Update readme a bit, include table of contents for documentation section
- Update dependencies to latest

# v0.4.2

New Features:

- Add support for the Sony Entertainment Network Store

# v0.4.1

Bug Fixes:

- Update dependencies to latest

# v0.4.0

New Features:

- Use of debug package for debugging
- New configuration options
- Updated dependencies

# v0.3.2

Bug Fixes:

- Limit the files included in the installed package.

# v0.3.1

Bug Fixes:

- Update dependencies to latest, update code to match dependency changes

# v0.3.0

New Features:

- Export PriceFinder class rather than instance: To allow the user to configure PriceFinder, export the class rather than the instance. The user can then pass in an options object which specifies configuration. Also add a debug parameter which enables debugging the PriceFinder object.
- Update the tests to account for the change. Test the debug parameter.
- Update the readme to include this information, and additional updates while we're at it.

# v0.2.0

New Features:

- Item details (category and item name) support for BestBuy and Google Play Store
- Refactor tests to separate out unit tests and end-to-end tests, which actually test using the price-finder module to find the item details.

Bug Fixes:

- Minor fixes.

# v0.1.1

Bug Fixes:

- Includes bug fix to read the sites files using the __dirname value for relative lookup.

# v0.1.0

Initial release of price-finder, which includes support for:

- Amazon (price and item details)
- Google Play (only price)
- Best Buy (only price)

Please see the README for more information.
