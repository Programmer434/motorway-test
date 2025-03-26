import { SuperCarClient } from '../supercar-client';
import nock from 'nock';
describe('Supercar client', () => {
  const url = 'https://fake-endpoint.com';
  const path = '/valuations/ABC1234?mileage=1000';

  it('successful call', async () => {
    nock(url)
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

    const superCarClient = new SuperCarClient(url);
    const valuation = await superCarClient.getValuation('ABC1234', 1000);
    expect(valuation.vrm).toBe('ABC1234');
    expect(valuation.lowestValue).toBe(22350);
    expect(valuation.highestValue).toBe(24750);
  });

  it('failed call handles and returns err', async () => {
    nock(url).get(path).reply(429);

    const superCarClient = new SuperCarClient(url);
    await expect(
      superCarClient.getValuation('ABC1234', 1000),
    ).rejects.toThrow();
  });
});
