import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { VehicleValuation } from '@app/models/vehicle-valuation';

export function getDB(): DataSource {
  return new DataSource({
    type: 'sqlite',
    database: process.env.DATABASE_PATH!,
    synchronize: process.env.SYNC_DATABASE === 'true',
    logging: false,
    entities: [VehicleValuation],
    migrations: [],
    subscribers: [],
  });
}
