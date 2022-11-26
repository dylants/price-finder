import Site from '../../src/Site';
import siteManager from '../../src/site-manager';

const KNOWN_SITE = 'www.amazon.com/123/product';
const BAD_SITE = 'www.bad_uri.bad';

describe('The Site Manager', () => {
  it('should throw an exception for an unknown uri', () => {
    expect(() => {
      siteManager.loadSite(BAD_SITE);
    }).toThrow(/site not found for uri/);
  });

  it('should return the site for a known URI', () => {
    const site = siteManager.loadSite(KNOWN_SITE);
    expect(site).toBeTruthy();
  });

  describe('loading a specific site', () => {
    let site: Site;

    beforeEach(() => {
      site = siteManager.loadSite(KNOWN_SITE);
    });

    it('should exist', () => {
      expect(site).toBeTruthy();
    });

    it('should have site operations available', () => {
      expect(site.isJSON).toBeTruthy();
    });
  });
});
