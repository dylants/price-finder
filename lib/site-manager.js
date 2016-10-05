'use strict';

const fs = require('fs');
const logger = require('./logger')();

function loadAllSites() {
  const sites = [];

  // reads all the files from the sites directory
  fs.readdirSync(`${__dirname}/sites`).forEach((site) => {
    // for each one, load it into the sites array
    logger.log('loading site module: %s', site);
    sites.push(require(`./sites/${site}`)); // eslint-disable-line import/no-dynamic-require
  });

  // return all sites loaded
  return sites;
}

class SiteManager {
  constructor() {
    logger.log('initializing SiteManager');
    // first, load all the sites we have available
    this.sites = loadAllSites();
  }

  /**
   * Loads a Site that can handle the given URI. If no matches are found,
   * an Error is thrown.
   *
   * @param  {String} uri The URI for a website
   * @return {Object}     The Site which can handle the URI
   */
  loadSite(uri, config) {
    logger.log('attempting to find site for uri: %s', uri);

    // loop over all our sites
    for (let i = 0; i < this.sites.length; i++) {
      // if one matches...
      if (this.sites[i].isSite(uri)) {
        logger.log('match found, using site: %s', this.sites[i].name);

        // return a new instance of it passing in the URI
        return new this.sites[i](uri, config);
      }
    }

    // no sites were found to handle the given URI, throw an Error
    // (maybe some nice person will contribute code to handle this site :)
    throw new Error('site not found for uri (please help contribute!): %s', uri);
  }
}

module.exports = new SiteManager();
