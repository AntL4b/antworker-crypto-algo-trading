import { OHLCVData } from "../models/ohlcv-data";

export interface ExchangeRestApi {
  getOHLCV(marketId: string, timeFrame: number, startTime: number): Promise<Array<OHLCVData>>;
}