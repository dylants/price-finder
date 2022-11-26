import fs from 'fs';
import logger from './logger';
import Site from './Site';

function loadAllSites() {
  const sites: Site[] = [];

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
  sites: Site[];
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
      // TODO any type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const site: any = this.sites[i];
      // if one matches...
      if (site.isSite(uri)) {
        logger.debug('match found, using site: %s', site.name);

        // return a new instance of it passing in the URI
        return new site(uri);
      }
    }

    // no sites were found to handle the given URI, throw an Error
    // (maybe some nice person will contribute code to handle this site :)
    throw new Error(`site not found for uri (please help contribute!): ${uri}`);
  }
}

export default new SiteManager();
