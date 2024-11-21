import axios from "axios";
import { OHLCVData } from "../../models/objects/ohlcv-data";
import { ExchangeRestApi } from "../exchange-rest-api";
import { TimeFrameEnum } from "../../models/enums/time-frame-enum";
import { AntworkerError } from "../../errors/antworker-error";
import { ObjectUtils } from "../../_helpers/object-utils";
import { Utils } from "../../utils/utils";
import { KrakenFutureApiCredentials } from "../../models/objects/exchange-api/kraken-future-api-credentials";
import { logDebug, logTrace } from "../../logger/logger";

const REST_ENDPOINT = "https://futures.kraken.com";
const TIME_FRAME_MAPPING = {
  [TimeFrameEnum.OneMinute]: "1m",
  [TimeFrameEnum.FiveMinutes]: "5m",
  [TimeFrameEnum.FifteenMinutes]: "15m",
  [TimeFrameEnum.ThirtyMinutes]: "30m",
  [TimeFrameEnum.OneHour]: "1h",
  [TimeFrameEnum.FourHours]: "4h",
  [TimeFrameEnum.TwelveHours]: "12h",
  [TimeFrameEnum.OneDay]: "1d",
  [TimeFrameEnum.OneWeek]: "1w",
};

interface KrakenFutureRestApiRequest {
  method: axios.Method;
  uri: string;
  auth: boolean;
  queryParams?: { [key: string]: any };
  bodyParams?: { [key: string]: any };
}

export class KrakenFutureRestApi implements ExchangeRestApi {
  private krakenFutureApiCredentials: KrakenFutureApiCredentials;
  private static instance: KrakenFutureRestApi;

  private constructor() {}

  static getInstance() {
    if (!KrakenFutureRestApi.instance) {
      KrakenFutureRestApi.instance = new KrakenFutureRestApi();
    }

    return KrakenFutureRestApi.instance;
  }

  /**
   * Set the krakenFutureApiCredentials config
   * @param krakenFutureApiCredentials The krakenFutureApiCredentials config to set
   */
  setKrakenFutureApiCredentials(krakenFutureApiCredentials: KrakenFutureApiCredentials): void {
    this.krakenFutureApiCredentials = krakenFutureApiCredentials;
  }

  async getOHLCV(
    marketId: string,
    timeFrame: TimeFrameEnum,
    startTime: number = null,
    endTime: number = null,
  ): Promise<Array<OHLCVData>> {
    if (!Object.keys(TIME_FRAME_MAPPING).includes(timeFrame)) {
      throw new AntworkerError("Given timeframe is not supported: " + timeFrame);
    }

    const response = await this.request({
      method: "GET",
      auth: false,
      uri: `api/charts/v1/trade/${marketId}/${TIME_FRAME_MAPPING[timeFrame]}`,
      queryParams: ObjectUtils.clean({
        from: startTime,
        to: endTime,
      }),
    });

    if (response.data.candles) {
      return response.data.candles.map((candle) => {
        return {
          id: candle.time / 1000 / Utils.getTimeFrameValueInSeconds(timeFrame),
          time: candle.time / 1000,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volume,
        } as OHLCVData;
      });
    } else {
      logTrace("Unexpected API response");
      logTrace(response.data);
      return [];
    }
  }

  private request(requestParams: KrakenFutureRestApiRequest): Promise<any> {
    const requestConfig: axios.AxiosRequestConfig = {
      method: requestParams.method,
      maxBodyLength: Infinity,
      headers: {
        Accept: "application/json",
      },
    };

    // Build url
    const url = new URL(`${REST_ENDPOINT}/${requestParams.uri}`);

    // Add query params
    if (requestParams.queryParams && Object.keys(requestParams.queryParams).length > 0) {
      Object.keys(requestParams.queryParams).map((key) => {
        url.searchParams.append(key, requestParams.queryParams[key]);
      });
    }

    requestConfig.url = url.toString();

    // Add body params
    if (requestParams.bodyParams && Object.keys(requestParams.bodyParams).length > 0) {
      requestConfig.data = JSON.stringify(requestParams.bodyParams);
      requestConfig.headers["Content-Type"] = "application/json";
    }

    // Handle authenticated requests
    if (requestConfig.auth) {
      if (this.krakenFutureApiCredentials == null) {
        throw new AntworkerError("Calling an authenticated endpoint with missing credentials");
      }

      // Add headers
      requestConfig.headers["APIKey"] = this.krakenFutureApiCredentials.apiKey;
      requestConfig.headers["Authent"] = this.krakenFutureApiCredentials.apiKey;
    }

    return axios.request(requestConfig);
  }
}
