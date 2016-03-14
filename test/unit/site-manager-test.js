'use strict';

const should = require('should');
const siteManager = require('../../lib/site-manager');

const KNOWN_SITE = 'www.amazon.com/123/product';
const BAD_SITE = 'www.bad_uri.bad';

describe('The Site Manager', () => {
  it('should exist', () => {
    should.exist(siteManager);
  });

  it('should throw an exception for an unknown uri', () => {
    should.throws(() => {
      siteManager.loadSite(BAD_SITE);
    });
  });

  it('should return the site for a known URI', () => {
    const site = siteManager.loadSite(KNOWN_SITE);
    should.exist(site);
  });

  describe('loading a specific site', () => {
    let site;

    beforeEach(() => {
      site = siteManager.loadSite(KNOWN_SITE);
    });

    it('should exist', () => {
      should.exist(site);
    });

    it('should have site operations available', () => {
      should.exist(site.isJSON);
    });
  });
});
