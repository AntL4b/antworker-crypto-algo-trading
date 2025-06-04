import { GetOHLCVRequest } from "../models/objects/exchange-api/get-ohlcv-request";
import { OHLCVData } from "../models/objects/ohlcv-data";

export interface ExchangeRestApi {
  /**
   * Retrieve OHLCV data array from exchange API
   * @param getOHLCVRequest The getOHLCVRequest configuration object
   */
  getOHLCV(getOHLCVRequest: GetOHLCVRequest): Promise<Array<OHLCVData>>;
}
