import { OHLCVData } from "../../models/ohlcv-data";
import { ExchangeRestApi } from "../exchange-rest-api";

export class KrakenFutureRestApi implements ExchangeRestApi {
  getOHLCV(marketId: string, timeFrame: number, startTime: number): Promise<Array<OHLCVData>> {
    // TODO
    return null;
  }
  
}