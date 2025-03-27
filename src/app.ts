import './env';
import 'reflect-metadata';

import { fastify as Fastify, FastifyServerOptions } from 'fastify';
import { valuationRoutes } from './routes/valuation';
import { ServiceUnavailableError } from './errors';

export const app = (opts?: FastifyServerOptions) => {
  const fastify = Fastify(opts);

  fastify.get('/', async () => {
    return { hello: 'world' };
  });

  valuationRoutes(fastify);

  fastify.setErrorHandler(function (error, request, reply) {
    if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
      // Log error
      this.log.error(error);
      // Send error response
      reply.status(500).send({ ok: false });
    } else if (error instanceof ServiceUnavailableError) {
      reply.status(503).send({ message: error.message });
    } else {
      reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  return fastify;
};
