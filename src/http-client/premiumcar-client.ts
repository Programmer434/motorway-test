import { VehicleValuation } from '@app/models/vehicle-valuation';
import axios from 'axios';
import { HttpClient } from './types';
import { XMLParser } from 'fast-xml-parser';
import { PremiumCarValuationResponse } from '@app/premium-car/types';
export class PremiumCarClient implements HttpClient {
  private baseUrl: string;
  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ?? 'https://run.mocky.io/v3/0dfda26a-3a5a-43e5-b68c-51f148eda473';
  }

  async getValuation(vrm: string, mileage: number): Promise<VehicleValuation> {
    axios.defaults.baseURL = this.baseUrl;

    axios.defaults.headers['Content-Type'] = 'application/xml';
    const xmlResponse = await axios.get<PremiumCarValuationResponse>(
      `valuations/${vrm}?mileage=${mileage}`,
    );
    const parser = new XMLParser();
    const parsedResponse = parser.parse(xmlResponse.data.toString()).root;

    const valuation = new VehicleValuation();

    valuation.vrm = vrm;
    valuation.lowestValue = parsedResponse.ValuationDealershipMinimum;
    valuation.highestValue = parsedResponse.ValuationDealershipMaximum;
    return valuation;
  }
}
