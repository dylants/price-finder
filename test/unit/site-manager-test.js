"use strict";

var siteManager = require("../../lib/site-manager");

var KNOWN_SITE = "www.amazon.com/123/product";

describe("The Site Manager", function() {

    it("should exist", function() {
        expect(siteManager).toBeDefined();
    });

    it("should throw an exception for an unknown uri", function() {
        expect(function() {
            siteManager.loadSite("www.bad_uri.bad");
        }).toThrow();
    });

    it("should return the site for a known URI", function() {
        var site;

        site = siteManager.loadSite(KNOWN_SITE);
        expect(site).toBeDefined();
    });

    describe("loading a specific site", function() {
        var site;

        beforeEach(function() {
            site = siteManager.loadSite(KNOWN_SITE);
        });

        it("should exist", function() {
            expect(site).toBeDefined();
        });

        it("should have site operations available", function() {
            expect(site.isJSON).toBeDefined();
        });
    });

});
