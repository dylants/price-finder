import Site from './Site';
declare class SiteManager {
    sites: Site[];
    constructor();
    /**
     * Loads a Site that can handle the given URI. If no matches are found,
     * an Error is thrown.
     *
     * @param  {string} uri The URI for a website
     * @return {Site}     The Site which can handle the URI
     */
    loadSite(uri: string): Site;
}
declare const _default: SiteManager;
export default _default;
