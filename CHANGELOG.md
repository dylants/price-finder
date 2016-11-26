# v4.3.1

Bug Fixes:

- [#114](https://github.com/dylants/price-finder/pull/114) Amazon fixes, e2e fixes, closes [#112](https://github.com/dylants/price-finder/issues/112) and [#113](https://github.com/dylants/price-finder/issues/113)

# v4.3.0

New Features:

- [#105](https://github.com/dylants/price-finder/pull/105) Add support for Thinkgeek (@maxmill)

Additional changes made in this release:

- [#109](https://github.com/dylants/price-finder/pull/109) Update dependencies / eslint changes
- [#110](https://github.com/dylants/price-finder/pull/110) Remove support for Flipkart

# v4.2.0

New Features:

- [#103](https://github.com/dylants/price-finder/pull/103) Add support for Target.com

Bug Fixes:

- [#100](https://github.com/dylants/price-finder/pull/100) Fix Flipkart
- [#101](https://github.com/dylants/price-finder/pull/101) Fix PriceMinister
- [#102](https://github.com/dylants/price-finder/pull/102) Defaults for no currency symbol, fix Amazon video games

# v4.1.0

New Features:

- [#95](https://github.com/dylants/price-finder/pull/95) Add Walmart Support (@rajkumarpb)

Bug Fixes:

- [#93](https://github.com/dylants/price-finder/pull/93) Update Best Buy category query
- [#94](https://github.com/dylants/price-finder/pull/94) Site fixes, test fixes, travis improvements

# v4.0.0

New Features:

- [#64](https://github.com/dylants/price-finder/pull/64) **Breaking Change:** Switch from `request` to `superagent` internally, remove HTTP request header configuration support
- [#67](https://github.com/dylants/price-finder/pull/67) Add support for Flipkart (@rajkumarpb)
- [#68](https://github.com/dylants/price-finder/pull/68) Add support for GOG.com
- [#71](https://github.com/dylants/price-finder/pull/71) Snapdeal Added (@rajkumarpb)
- [#74](https://github.com/dylants/price-finder/pull/74) Greenman Gaming Added (@rajkumarpb)
- [#75](https://github.com/dylants/price-finder/pull/75) **Breaking Change:** Best Buy supports both scraping and API, remove API key within price-finder configuration

Bug Fixes:

- [#85](https://github.com/dylants/price-finder/pull/85) Attempt to fix PriceMinister e2e tests

Additional changes made in the release:

- [#87](https://github.com/dylants/price-finder/pull/87) Move from Jasmine to Mocha for internal tests

# v3.1.0

New Features:

- [#45](https://github.com/dylants/price-finder/pull/45) Add support for Newegg (@rajkumarpb)
- [#55](https://github.com/dylants/price-finder/pull/55) E2E tests: refactor and add to Travis CI
- [#56](https://github.com/dylants/price-finder/pull/56) Add support for Infibeam (@rajkumarpb)

Bug Fixes:

- [#50](https://github.com/dylants/price-finder/pull/50) Fix Newegg e2e test, closes [#49](https://github.com/dylants/price-finder/issues/49)
- [#51](https://github.com/dylants/price-finder/pull/51) Correct callback error string, closes [#48](https://github.com/dylants/price-finder/issues/48)

# v3.0.0

New Features:

- [#36](https://github.com/dylants/price-finder/pull/36) **Breaking Change:** Update to ES6 syntax, apply Airbnb style guide, remove support for Node v0.10, v0.12, and iojs, closes [#28](https://github.com/dylants/price-finder/issues/28)
- [#39](https://github.com/dylants/price-finder/pull/39) Add Node v5 test coverage to Travis CI (to go along with Node v4)
- [#40](https://github.com/dylants/price-finder/pull/40) Use `siteUtils.processPrice` where possible, closes [#29](https://github.com/dylants/price-finder/issues/29)
- [#41](https://github.com/dylants/price-finder/pull/41) Add support for Steam (.com), closes [#38](https://github.com/dylants/price-finder/issues/38)

Bug Fixes:

- [#43](https://github.com/dylants/price-finder/pull/43) Improve Steam query

During this release a Yeoman generator was created for help in adding sites: https://github.com/dylants/generator-price-finder-site

# v2.4.0

New Features:

- [#35](https://github.com/dylants/price-finder/pull/35) Add support for GBP prices (@maiis)

Bug Fixes:

- [#34](https://github.com/dylants/price-finder/pull/34) Add selector to help find luggage items, closes [#33](https://github.com/dylants/price-finder/issues/33)

# v2.3.0

New Features:

- [#32](https://github.com/dylants/price-finder/pull/32) Add support for Japanese Yen, closes [#30](https://github.com/dylants/price-finder/issues/30) (@devil-tamachan)

Bug Fixes:

- [36434ea](https://github.com/dylants/price-finder/commit/36434eaff7f53dc15c08b547646e105b27affdfd) Fix for Amazon books

# v2.2.0

New Features:

- [#23](https://github.com/dylants/price-finder/pull/23) Update Travis CI versions to include Node v4, closes [#20](https://github.com/dylants/price-finder/issues/20)
- [#24](https://github.com/dylants/price-finder/pull/24) Support additional currencies to support additional Amazon sites, closes [#19](https://github.com/dylants/price-finder/issues/19)
- [#26](https://github.com/dylants/price-finder/pull/26) Add support for Nintendo.com, closes [#15](https://github.com/dylants/price-finder/issues/15)
- [cb69abe](https://github.com/dylants/price-finder/commit/cb69abe96bbfe026a12f91947c004c736027cb27) Add `test-e2e-single` npm script
- [c488c9e](https://github.com/dylants/price-finder/commit/c488c9e224f668b50fe01930b33f9eadd0121fc2) Correct license in `package.json`
- [#27](https://github.com/dylants/price-finder/pull/27) Improve PriceMinister scraping (@Shuunen)

Bug Fixes:

- [#22](https://github.com/dylants/price-finder/pull/22) Fix for Amazon books accordion, closes [#21](https://github.com/dylants/price-finder/issues/21)

# v2.1.2

Bug Fixes:

- [#16](https://github.com/dylants/price-finder/pull/16) Fix Amazon books price selector, closes [#13](https://github.com/dylants/price-finder/issues/13)
- [#17](https://github.com/dylants/price-finder/pull/17) Fix eBags price selector, closes [#14](https://github.com/dylants/price-finder/issues/14)

# v2.1.1

Bug Fixes:

- Fix locator for Amazon book price, and narrow the scope for the title of a book

# v2.1.0

New Features:

- Support the new `playstation` URLs for the Sony Store
- Add more jshint'ing, include Grunt to test process
- Fully populate the changelog
- Improve error handling for Best Buy site code
- Add support for eBags.com
- Enable debug logging by default for end to end tests
- Update dependencies to latest

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
