import { TimeFrameEnum } from "../models/enums/time-frame-enum";
import { OHLCVData } from "../models/objects/ohlcv-data";

export interface ExchangeRestApi {
  /**
   * Retrieve OHLCV data array from exchange API
   * @param marketId Market identifier. EX: PF_XBTUSD
   * @param timeFrame The time frame in which to recover the data
   * @param startTime The start time of the data to retrieve
   * @param endTime The end time of the data to retrieve
   */
  getOHLCV(marketId: string, timeFrame: TimeFrameEnum, startTime: number, endTime: number): Promise<Array<OHLCVData>>;
}
