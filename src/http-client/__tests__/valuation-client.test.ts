import { PremiumCarClient } from '../premiumcar-client';
import { SuperCarClient } from '../supercar-client';
import { ValuationClient } from '../valuation-client';
import nock from 'nock';
describe('Supercar client', () => {
  const superCarUrl = 'https:/supercar.com';
  const premiumCarUrl = 'https:/premiumcar.com';
  const path = '/valuations/ABC1234?mileage=1000';

  it('successful first call', async () => {
    nock(superCarUrl)
      .get(path)
      .reply(200, {
        vin: '2HSCNAPRX7C385251',
        registrationDate: '2012-06-14T00:00:00.0000000',
        plate: {
          year: 2012,
          month: 4,
        },
        valuation: {
          lowerValue: 22350,
          upperValue: 24750,
        },
      });

    const valuationClient = new ValuationClient(
      new SuperCarClient(superCarUrl),
      new PremiumCarClient(premiumCarUrl),
    );
    const valuation = await valuationClient.getValuation('ABC1234', 1000);
    expect(valuation.vrm).toBe('ABC1234');
    expect(valuation.lowestValue).toBe(22350);
    expect(valuation.highestValue).toBe(24750);
  });

  it('supercar fails, uses premium car fallback', async () => {
    const valuationClient = new ValuationClient(
      new SuperCarClient(superCarUrl),
      new PremiumCarClient(premiumCarUrl),
    );

    //super car fails, so it should use premium car
    nock(superCarUrl).get(path).reply(500);

    nock(premiumCarUrl)
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
            <ValuationDealershipMinimum>9999</ValuationDealershipMinimum>
            <ValuationDealershipMaximum>8888</ValuationDealershipMaximum>
          </root>
        `,
      );

    const valuation = await valuationClient.getValuation('ABC1234', 1000);

    expect(valuation.vrm).toBe('ABC1234');
    //These were intentionally changed to test the fallback
    expect(valuation.lowestValue).toBe(9999);
    expect(valuation.highestValue).toBe(8888);
  });
});
