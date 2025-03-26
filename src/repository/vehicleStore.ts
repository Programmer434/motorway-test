import { Repository } from 'typeorm/repository/Repository';
import { getDB } from '@app/repository/conn';
import { VehicleValuation } from '@app/models/vehicle-valuation';
import { DataSource } from 'typeorm';

export class VehicleStore {
  private vehicleStore: Repository<VehicleValuation>;
  private db: DataSource;
  constructor(vehicleStore?: Repository<VehicleValuation>) {
    this.db = getDB();
    this.vehicleStore = vehicleStore || this.db.getRepository(VehicleValuation);
  }

  public static async build() {
    const db = getDB();
    await db.initialize();
    return new VehicleStore(db.getRepository(VehicleValuation));
  }
  public async findOneVRM(
    requestedVRM: string,
  ): Promise<VehicleValuation | null> {
    return this.vehicleStore.findOne({ where: { vrm: requestedVRM } });
  }

  public async insert(vehicleValuation: VehicleValuation): Promise<void> {
    await this.vehicleStore.insert(vehicleValuation);
  }
}
