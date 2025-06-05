import { antworker, BinanceRestApi, consoleLoggerHandler, fileLoggerHandler, Logger, logInfo, LogLevelEnum, Strategy, TimeFrameEnum, Utils } from "@antl4b/antworker-crypto-algo-trading";
import { binanceApiCredentials } from "./private/binance-api-credentials"; // This file has to be created from your own

class MyStrat extends Strategy {

  private binanceApi: BinanceRestApi;

  constructor() {
    super();
    this.binanceApi = BinanceRestApi.getInstance();
    this.binanceApi.setCredentials(binanceApiCredentials);
  }

  override async beforeLoop(): Promise<void> {
    logInfo("beforeLoop (nothing)");
  }
  override async loop(): Promise<void> {
    logInfo("loop (nothing), waiting 10 sec");
    const ohlcvData = await this.binanceApi.getOHLCV({
			marketId: "BTCUSDC",
			timeFrame: TimeFrameEnum.OneMinute,
		});

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

const app = antworker("sample-strategy-runner");

// Configure logger
const logger = Logger.getInstance();
logger.setLogLevel(LogLevelEnum.Trace);
logger.addHandler(consoleLoggerHandler());
logger.addHandler(fileLoggerHandler({
	filePrefix: "sample-strategy-runner",
	logDir: "logs",
}));

app.setStrategy(new MyStrat());
app.runStrategy();
