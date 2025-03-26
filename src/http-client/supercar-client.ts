import axios from 'axios';
import { VehicleValuation } from '../models/vehicle-valuation';
import { SuperCarValuationResponse } from '@app/super-car/types/super-car-valuation-response';
import { HttpClient } from './types';

export class SuperCarClient implements HttpClient {
  private baseUrl: string;
  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ?? 'https://run.mocky.io/v3/9245229e-5c57-44e1-964b-36c7fb29168b';
  }

  async getValuation(vrm: string, mileage: number): Promise<VehicleValuation> {
    try {
      axios.defaults.baseURL = this.baseUrl;
      axios.defaults.headers['Content-Type'] = 'application/xml';

      const response = await axios.get<SuperCarValuationResponse>(
        `valuations/${vrm}?mileage=${mileage}`,
      );

      const valuation = new VehicleValuation();

      valuation.vrm = vrm;
      valuation.lowestValue = response.data.valuation.lowerValue;
      valuation.highestValue = response.data.valuation.upperValue;

      return valuation;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        //TODO add logging
        // Access to config, request, and response
      } else {
        // Just a stock error
      }
      throw err;
    }
  }
}
