import { VehicleValuation } from '@app/models/vehicle-valuation';
import { PremiumCarClient } from './premiumcar-client';
import { SuperCarClient } from './supercar-client';

export class ValuationClient {
  private superCarClient: SuperCarClient;
  private premiumCarClient: PremiumCarClient;
  constructor(
    superCarClient: SuperCarClient,
    premiumCarClient: PremiumCarClient,
  ) {
    this.superCarClient = superCarClient;
    this.premiumCarClient = premiumCarClient;
  }

  async getValuation(vrm: string, mileage: number): Promise<VehicleValuation> {
    try {
      return await this.superCarClient.getValuation(vrm, mileage);
    } catch (error) {
      return await this.premiumCarClient.getValuation(vrm, mileage);
    }
  }
}
