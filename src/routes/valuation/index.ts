import { FastifyInstance } from 'fastify';
import { VehicleValuationRequest } from './types/vehicle-valuation-request';
import { VehicleStore } from '@app/repository/vehicleStore';
import { fetchValuationFromSuperCarValuation } from '@app/super-car/super-car-valuation';

export function valuationRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Params: {
      vrm: string;
    };
  }>('/valuations/:vrm', async (request, reply) => {
    const db = await VehicleStore.build();

    const { vrm } = request.params;

    if (vrm === null || vrm === '' || vrm.length > 7) {
      return reply
        .code(400)
        .send({ message: 'vrm must be 7 characters or less', statusCode: 400 });
    }

    const result = await db.findOneVRM(vrm);

    if (result == null) {
      return reply.code(404).send({
        message: `Valuation for VRM ${vrm} not found`,
        statusCode: 404,
      });
    }

    return result;
  });

  fastify.put<{
    Body: VehicleValuationRequest;
    Params: {
      vrm: string;
    };
  }>('/valuations/:vrm', async (request, reply) => {
    const db = await VehicleStore.build();

    const { vrm } = request.params;
    const { mileage } = request.body;

    if (vrm.length > 7) {
      return reply
        .code(400)
        .send({ message: 'vrm must be 7 characters or less', statusCode: 400 });
    }

    if (mileage === null || mileage <= 0) {
      return reply.code(400).send({
        message: 'mileage must be a positive number',
        statusCode: 400,
      });
    }

    const valuation = await fetchValuationFromSuperCarValuation(vrm, mileage);

    // Save to DB.
    await db.insert(valuation).catch((err) => {
      if (err.code !== 'SQLITE_CONSTRAINT') {
        throw err;
      }
    });

    fastify.log.info('Valuation created: ', valuation);

    return valuation;
  });
}
