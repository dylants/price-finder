import { priceFinder, verifyPrice } from './testHelper';

describe('price-finder for HomeDepot URIs', () => {
  // Ladder
  const uri = 'https://www.homedepot.com/p/product/100662617';

  it('should respond with a price', async () => {
    const price = await priceFinder.findItemPrice(uri);
    verifyPrice(price);
  });
});
