import axios from "axios";
import { OHLCVData } from "../../models/objects/ohlcv-data";
import { ExchangeRestApi } from "../exchange-rest-api";
import { TimeFrameEnum } from "../../models/enums/time-frame-enum";
import { AntworkerError } from "../../errors/antworker-error";
import { ObjectUtils } from "../../_helpers/object-utils";
import { Utils } from "../../utils/utils";
import { logError, logTrace } from "../../logger/logger";
import { BinanceApiCredentials } from "../../models/objects/exchange-api/binance-api-credentials";
import { GetOHLCVRequest } from "../../models/objects/exchange-api/get-ohlcv-request";
import { Antworker } from "../../antworker/antworker";
import * as crypto from "crypto";

const REST_ENDPOINT = "https://api.binance.com";
const TIME_FRAME_MAPPING = {
  [TimeFrameEnum.OneSecond]: "1s",
  [TimeFrameEnum.OneMinute]: "1m",
  [TimeFrameEnum.ThreeMinutes]: "3m",
  [TimeFrameEnum.FiveMinutes]: "5m",
  [TimeFrameEnum.FifteenMinutes]: "15m",
  [TimeFrameEnum.ThirtyMinutes]: "30m",
  [TimeFrameEnum.OneHour]: "1h",
  [TimeFrameEnum.TwoHours]: "2h",
  [TimeFrameEnum.FourHours]: "4h",
  [TimeFrameEnum.SixHours]: "6h",
  [TimeFrameEnum.HeightHours]: "8h",
  [TimeFrameEnum.TwelveHours]: "12h",
  [TimeFrameEnum.OneDay]: "1d",
  [TimeFrameEnum.ThreeDays]: "3d",
  [TimeFrameEnum.OneWeek]: "1w",
};

interface BinanceRestApiRequest {
  method: axios.Method;
  uri: string;
  auth: boolean;
  queryParams?: { [key: string]: any };
}

export class BinanceRestApi implements ExchangeRestApi {
  private binanceApiCredentials: BinanceApiCredentials;
  private static instance: BinanceRestApi;

  private constructor() {}

  static getInstance() {
    if (!BinanceRestApi.instance) {
      BinanceRestApi.instance = new BinanceRestApi();
    }

    return BinanceRestApi.instance;
  }

  /**
   * Set the binanceApiCredentials config
   * @param binanceApiCredentials The binanceApiCredentials config to set
   */
  setCredentials(binanceApiCredentials: BinanceApiCredentials): void {
    this.binanceApiCredentials = binanceApiCredentials;
  }

  async getOHLCV(getOHLCVRequest: GetOHLCVRequest): Promise<Array<OHLCVData>> {
    if (!Object.keys(TIME_FRAME_MAPPING).includes(getOHLCVRequest.timeFrame)) {
      throw new AntworkerError("Given timeframe is not supported: " + getOHLCVRequest.timeFrame);
    }

    const response = await this.request({
      method: "GET",
      auth: false,
      uri: "api/v3/klines",
      queryParams: {
        symbol: getOHLCVRequest.marketId,
        interval: TIME_FRAME_MAPPING[getOHLCVRequest.timeFrame],
        startTime: getOHLCVRequest.startTime,
        endTime: getOHLCVRequest.endTime,
        limit: getOHLCVRequest.limit,
      },
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data.map((candle) => {
        return {
          id: candle[0] / 1000 / Utils.getTimeFrameValueInSeconds(getOHLCVRequest.timeFrame),
          time: candle[0] / 1000,
          open: candle[1],
          high: candle[2],
          low: candle[3],
          close: candle[4],
          volume: candle[5],
        } as OHLCVData;
      });
    } else {
      logError("Unexpected API response", response.data);
      return [];
    }
  }

  private request(requestParams: BinanceRestApiRequest): Promise<any> {
    const requestConfig: axios.AxiosRequestConfig = {
      method: requestParams.method,
      headers: {
        "Content-Type": "application/json",
        "X-MBX-APIKEY": this.binanceApiCredentials.apiKey,
        "User-Agent": Antworker.getInstance().workerAppName,
      },
    };

    // Build url
    const url = new URL(`${REST_ENDPOINT}/${requestParams.uri}`);

    // Add query params after clean null values
    requestParams.queryParams = ObjectUtils.clean(requestParams.queryParams);
    if (requestParams.queryParams && Object.keys(requestParams.queryParams).length > 0) {
      Object.keys(requestParams.queryParams).map((key) => {
        url.searchParams.append(key, requestParams.queryParams[key]);
      });
    }

		logTrace(`Calling URL (signature removed): ${url.toString()}`);

    // Handle authenticated requests
    if (requestParams.auth) {
			logTrace("Calling authenticated service");
      if (this.binanceApiCredentials == null || !this.binanceApiCredentials.secretKey) {
        throw new AntworkerError("Calling an authenticated endpoint with missing credentials");
      }

      const signature = crypto
        .createHmac("sha256", this.binanceApiCredentials.secretKey)
        .update(url.searchParams.toString())
        .digest("hex");

      url.searchParams.append("timestamp", Date.now().toString());
      url.searchParams.append("signature", signature);
    }

    requestConfig.url = url.toString();
    return axios.request(requestConfig);
  }
}
