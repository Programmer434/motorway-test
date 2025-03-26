import { fastify } from '~root/test/fastify';
import { VehicleValuationRequest } from '../types/vehicle-valuation-request';
import { VehicleStore } from '@app/repository/vehicleStore';
import { ValuationClient } from '@app/http-client/valuation-client';
vi.mock('../../../repository/vehicleStore');
vi.mock('../../../http-client/valuation-client');

describe('ValuationController (e2e)', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(VehicleStore.prototype.findOneVRM).mockResolvedValue(null);
    vi.mocked(VehicleStore.prototype.insert).mockResolvedValue();
    vi.mocked(VehicleStore.build).mockResolvedValue(new VehicleStore());

    vi.mocked(ValuationClient.prototype.getValuation).mockResolvedValue({
      highestValue: 1000,
      lowestValue: 1000,
      midpointValue: 1000,
      vrm: 'ABC123',
    });
  });

  describe('PUT /valuations/', () => {
    it('should return 404 if VRM is missing', async () => {
      const requestBody: VehicleValuationRequest = {
        mileage: 10000,
      };

      const res = await fastify.inject({
        url: '/valuations',
        method: 'PUT',
        body: requestBody,
      });

      expect(res.statusCode).toStrictEqual(404);
    });

    it('should return 400 if VRM is 8 characters or more', async () => {
      const requestBody: VehicleValuationRequest = {
        mileage: 10000,
      };

      const res = await fastify.inject({
        url: '/valuations/12345678',
        body: requestBody,
        method: 'PUT',
      });

      expect(res.statusCode).toStrictEqual(400);
    });

    it('should return 400 if mileage is missing', async () => {
      const requestBody: VehicleValuationRequest = {
        // @ts-expect-error intentionally malformed payload
        mileage: null,
      };

      const res = await fastify.inject({
        url: '/valuations/ABC123',
        body: requestBody,
        method: 'PUT',
      });

      expect(res.statusCode).toStrictEqual(400);
    });

    it('should return 400 if mileage is negative', async () => {
      const requestBody: VehicleValuationRequest = {
        mileage: -1,
      };

      const res = await fastify.inject({
        url: '/valuations/ABC123',
        body: requestBody,
        method: 'PUT',
      });

      expect(res.statusCode).toStrictEqual(400);
    });

    it('should return 200 with valid request', async () => {
      const requestBody: VehicleValuationRequest = {
        mileage: 10000,
      };

      const res = await fastify.inject({
        url: '/valuations/ABC123',
        body: requestBody,
        method: 'PUT',
      });

      expect(res.statusCode).toStrictEqual(200);
    });
  });

  describe('GET /valuations/', () => {
    it('should return 404 if VRM is not found', async () => {
      const res = await fastify.inject({
        url: '/valuations/ABC123',
        method: 'GET',
      });

      expect(res.statusCode).toStrictEqual(404);
    });

    it('should return 200 with valid request', async () => {
      vi.mocked(VehicleStore.prototype.findOneVRM).mockResolvedValue({
        highestValue: 1000,
        lowestValue: 1000,
        midpointValue: 1000,
        vrm: 'ABC123',
      });

      const res = await fastify.inject({
        url: '/valuations/ABC123',
        method: 'GET',
      });

      expect(res.statusCode).toStrictEqual(200);
      expect(res.json()).toStrictEqual({
        highestValue: 1000,
        lowestValue: 1000,
        midpointValue: 1000,
        vrm: 'ABC123',
      });
    });
  });
});
