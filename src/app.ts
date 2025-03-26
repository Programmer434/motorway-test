import './env';
import 'reflect-metadata';

import { fastify as Fastify, FastifyServerOptions } from 'fastify';
import { valuationRoutes } from './routes/valuation';

export const app = (opts?: FastifyServerOptions) => {
  const fastify = Fastify(opts);

  fastify.get('/', async () => {
    return { hello: 'world' };
  });

  valuationRoutes(fastify);

  return fastify;
};
