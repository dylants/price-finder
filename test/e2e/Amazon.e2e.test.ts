import { priceFinder, verifyPrice } from './testHelper';

/*
 * I've seen some CAPTCHA's from Amazon if you hit them too much too often,
 * so be fairly easy here. We need to try to hit the balance of testing that
 * the code works for Amazon, while not testing *too* much that CAPTCHA's
 * are thrown and the tests fail (and our IP is blacklisted).
 */
describe('price-finder for Amazon URIs', () => {
  describe('testing a Music (physical disc) item', () => {
    // Led Zeppelin II vinyl
    const uri = 'https://www.amazon.com/Led-Zeppelin-II/dp/B00IXHBUG0';

    it('should respond with a price', async () => {
      const price = await priceFinder.findItemPrice(uri);
      verifyPrice(price);
    });
  });
});
