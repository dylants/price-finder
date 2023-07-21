import fs from 'fs';
import logger from './logger';
import Site from './Site';

interface SiteClass {
  new (uri: string): Site;
}

function loadAllSites() {
  const sites: typeof Site[] = [];

  // reads all the files from the sites directory
  fs.readdirSync(`${__dirname}/sites`).forEach((site) => {
    // for each one, load it into the sites array
    logger.debug('loading site module: %s', site);
    sites.push(require(`./sites/${site}`));
  });

  // return all sites loaded
  return sites;
}

class SiteManager {
  sites: typeof Site[];
  constructor() {
    logger.debug('initializing SiteManager');
    // first, load all the sites we have available
    this.sites = loadAllSites();
  }

  /**
   * Loads a Site that can handle the given URI. If no matches are found,
   * an Error is thrown.
   *
   * @param  {string} uri The URI for a website
   * @return {Site}     The Site which can handle the URI
   */
  loadSite(uri: string): Site {
    logger.debug('attempting to find site for uri: %s', uri);

    // loop over all our sites
    for (let i = 0; i < this.sites.length; i++) {
      const siteClass = this.sites[i];
      // if one matches...
      if (siteClass.isSite(uri)) {
        logger.debug('match found, using site: %s', siteClass.name);

        // return a new instance of it passing in the URI
        const Class: SiteClass = siteClass as unknown as SiteClass;
        return new Class(uri);
      }
    }

    // no sites were found to handle the given URI, throw an Error
    // (maybe some nice person will contribute code to handle this site :)
    throw new Error(`site not found for uri (please help contribute!): ${uri}`);
  }
}

export default new SiteManager();
