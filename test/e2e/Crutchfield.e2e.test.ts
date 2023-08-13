import { priceFinder, verifyPrice } from './testHelper';

describe('price-finder for Crutchfield URIs', () => {
  // Headphones
  const uri =
    'https://www.crutchfield.com/p_158WF1KX5B/Sony-WF-1000XM5-Black.html?tp=60828';

  it('should respond with a price', async () => {
    const price = await priceFinder.findItemPrice(uri);
    verifyPrice(price);
  });
});
