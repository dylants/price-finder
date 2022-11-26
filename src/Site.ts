export default abstract class Site {
  /**
   * Returns the URI used to find the page data
   * (most likely the same URI used in constructing this Site)
   *
   * @return {string} The URI used to find the page data
   */
  abstract getURIForPageData(): string;

  /**
   * Returns true if the page data is JSON
   *
   * @return {boolean} true if the page data is JSON, false otherwise
   */
  abstract isJSON(): boolean;

  /**
   * Returns the price found on the page
   *
   * @param  {any} $/pageData jQuery object used to search the page, or
   *                             JSON page data if JSON based site
   * @return {number}            The price found on the page
   */
  // TODO any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract findPriceOnPage($: any): number;

  /**
   * Returns true if this site supports the incoming URI
   *
   * @param  {string}  uri The URI to test
   * @return {boolean}     true if this Site supports the URI, false otherwise
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static isSite(uri: string): boolean {
    /*
     * interfaces can not have static methods.
     * abstract classes can't have static abstract methods.
     * so, we're left with creating the method, but throwing an error
     * until the subsclass overrides it.
     */
    throw new Error('implement me!');
  }
}
