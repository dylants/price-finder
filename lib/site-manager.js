"use strict";

var fs = require("fs");

function loadAllSites() {
    var sites;

    sites = [];

    fs.readdirSync("./lib/sites").forEach(function(site) {
        sites.push(require("./sites/" + site));
    });

    return sites;
}

function SiteManager() {
    this.sites = loadAllSites();

    this.loadSite = function(uri) {
        var i;

        for (i = 0; i < this.sites.length; i++) {
            if (this.sites[i].isSite(uri)) {
                return new this.sites[i](uri);
            }
        }

        throw new Error("site not found for uri: " + uri);
    };

}

module.exports = new SiteManager();
