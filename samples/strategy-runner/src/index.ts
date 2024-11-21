import { antworker, KrakenFutureRestApi, Logger, logInfo, LogLevelEnum, Strategy, TimeFrameEnum, Utils } from "@antl4b/antworker-crypto-algo-trading";
import { krakenFutureApiCredentials } from "./private/kraken-future-api-credentials"; // This file has to be created from your own

class MyStrat extends Strategy {

  private krakenApi: KrakenFutureRestApi;

  constructor() {
    super();
    this.krakenApi = KrakenFutureRestApi.getInstance();
    this.krakenApi.setKrakenFutureApiCredentials(krakenFutureApiCredentials);
  }

  override async beforeLoop(): Promise<void> {
    logInfo("beforeLoop (nothing)");
  }
  override async loop(): Promise<void> {
    logInfo("loop (nothing), waiting 10 sec");
    const ohlcvData = await this.krakenApi.getOHLCV("PF_XBTUSD", TimeFrameEnum.OneMinute);

    if (ohlcvData && ohlcvData.length > 0) {
      logInfo(ohlcvData[0]);
    }

    await Utils.delay(10000);
  }
  override async afterLoop(): Promise<void> {
    logInfo("afterLoop (nothing)");
  }
  override async cleanup(): Promise<void> {
    logInfo("Cleaning up (nothing)");
  }
}

const app = antworker();
Logger.getInstance().setLogLevel(LogLevelEnum.Debug);

app.setStrategy(new MyStrat());

app.runStrategy();
