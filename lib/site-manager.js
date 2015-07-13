"use strict";

var fs = require("fs"),
    logger = require("./logger")();

function loadAllSites() {
    var sites;

    sites = [];

    // reads all the files from the sites directory
    fs.readdirSync(__dirname + "/sites").forEach(function(site) {
        // for each one, load it into the sites array
        logger.log("loading site module: " + site);
        sites.push(require("./sites/" + site));
    });

    // return all sites loaded
    return sites;
}

function SiteManager() {
    logger.log("initializing SiteManager");
    // first, load all the sites we have available
    this.sites = loadAllSites();

    /**
     * Loads a Site that can handle the given URI. If no matches are found,
     * an Error is thrown.
     *
     * @param  {String} uri The URI for a website
     * @return {Object}     The Site which can handle the URI
     */
    this.loadSite = function(uri, config) {
        var i;

        logger.log("attempting to find site for uri: " + uri);

        // loop over all our sites
        for (i = 0; i < this.sites.length; i++) {
            // if one matches...
            if (this.sites[i].isSite(uri)) {
                logger.log("match found, using site: " + this.sites[i].name);

                // return a new instance of it passing in the URI
                return new this.sites[i](uri, config);
            }
        }

        // no sites were found to handle the given URI, throw an Error
        // (maybe some nice person will contribute code to handle this site :)
        throw new Error("site not found for uri (please help contribute!): " + uri);
    };

}

module.exports = new SiteManager();
