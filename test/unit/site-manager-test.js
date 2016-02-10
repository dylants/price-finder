'use strict';

const siteManager = require('../../lib/site-manager');

const KNOWN_SITE = 'www.amazon.com/123/product';

describe('The Site Manager', () => {
  it('should exist', () => {
    expect(siteManager).toBeDefined();
  });

  it('should throw an exception for an unknown uri', () => {
    expect(() => {
      siteManager.loadSite('www.bad_uri.bad');
    }).toThrow();
  });

  it('should return the site for a known URI', () => {
    const site = siteManager.loadSite(KNOWN_SITE);
    expect(site).toBeDefined();
  });

  describe('loading a specific site', () => {
    let site;

    beforeEach(() => {
      site = siteManager.loadSite(KNOWN_SITE);
    });

    it('should exist', () => {
      expect(site).toBeDefined();
    });

    it('should have site operations available', () => {
      expect(site.isJSON).toBeDefined();
    });
  });
});
