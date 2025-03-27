import { VehicleValuation } from '@app/models/vehicle-valuation';
import { PremiumCarClient } from './premiumcar-client';
import { SuperCarClient } from './supercar-client';
import { ApiStateCounter } from './error-counter';

export class ValuationClient {
  private superCarClient: SuperCarClient;
  private premiumCarClient: PremiumCarClient;
  private apiStateCounter = ApiStateCounter.getInstance();
  constructor(
    superCarClient: SuperCarClient,
    premiumCarClient: PremiumCarClient,
  ) {
    this.superCarClient = superCarClient;
    this.premiumCarClient = premiumCarClient;
    this.apiStateCounter = ApiStateCounter.getInstance();
  }

  async getValuation(vrm: string, mileage: number): Promise<VehicleValuation> {
    if (this.apiStateCounter.getPreferredClient() === 'premiumCarClient') {
      return await this.premiumCarClient.getValuation(vrm, mileage);
    }
    try {
      const superCarRes = await this.superCarClient.getValuation(vrm, mileage);
      this.apiStateCounter.incrementSuperCarSuccessCount();
      return superCarRes;
    } catch (error) {
      this.apiStateCounter.incrementSuperCarErrorCount();
      return await this.premiumCarClient.getValuation(vrm, mileage);
    }
  }
}
