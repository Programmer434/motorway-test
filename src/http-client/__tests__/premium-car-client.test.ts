import { PremiumCarClient } from '../premiumcar-client';
import nock from 'nock';
describe('Premium car client', () => {
  const url = 'https://fake-endpoint.com';
  const path = '/valuations/ABC1234?mileage=1000';

  it('successful call', async () => {
    nock(url)
      .get(path)
      .reply(
        200,
        `
        <?xml version="1.0" encoding="UTF-8" ?>
<root>
  <RegistrationDate>2012-06-14T00:00:00.0000000</RegistrationDate>
  <RegistrationYear>2001</RegistrationYear>
  <RegistrationMonth>10</RegistrationMonth>
  <ValuationPrivateSaleMinimum>11500</ValuationPrivateSaleMinimum>
  <ValuationPrivateSaleMaximum>12750</ValuationPrivateSaleMaximum>
  <ValuationDealershipMinimum>9500</ValuationDealershipMinimum>
  <ValuationDealershipMaximum>10275</ValuationDealershipMaximum>
</root>`,
      );

    const premiumCarClient = new PremiumCarClient(url);
    const valuation = await premiumCarClient.getValuation('ABC1234', 1000);
    expect(valuation.vrm).toBe('ABC1234');
    expect(valuation.lowestValue).toBe(9500);
    expect(valuation.highestValue).toBe(10275);
  });

  it('failed call handles and returns err', async () => {
    nock(url).get(path).reply(429);

    const premiumCarClient = new PremiumCarClient(url);
    await expect(
      premiumCarClient.getValuation('ABC1234', 1000),
    ).rejects.toThrow();
  });
});
