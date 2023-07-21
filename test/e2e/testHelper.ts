import PriceFinder from '../../src/PriceFinder';

// set the price-finder retry sleep time to 5 seconds
// (in an attempt to avoid spamming these sites should we need to retry)
const RETRY_SLEEP_TIME = 5000;

// create a single instance of price-finder that will be used by e2e tests
export const priceFinder = new PriceFinder({
  retrySleepTime: RETRY_SLEEP_TIME,
});

export function verifyPrice(price: number | undefined) {
  expect(price).toBeDefined();

  // we can't guarantee the price, so just make sure it's a positive number
  expect(price).toBeGreaterThanOrEqual(0);
}
