import { VehicleValuation } from '@app/models/vehicle-valuation';

export interface HttpClient {
  getValuation(vrm: string, mileage: number): Promise<VehicleValuation>;
}
