import { BinanceRestApi, logInfo, Strategy, TimeFrameEnum, Utils } from "@antl4b/antworker-crypto-algo-trading";
import { binanceApiCredentials } from "./private/binance-api-credentials"; // This file has to be created from your own

export class MyStrat extends Strategy {

	private binanceApi: BinanceRestApi;

	constructor() {
		super();
		this.binanceApi = BinanceRestApi.getInstance();
		this.binanceApi.setCredentials(binanceApiCredentials);
	}

	public override async beforeLoop(): Promise<void> {
		logInfo("beforeLoop");
	}

	public override async loop(): Promise<void> {
		logInfo("loop");
		const ohlcvData = await this.binanceApi.getOHLCV({
			marketId: "BTCUSDC",
			timeFrame: TimeFrameEnum.OneMinute,
		});

		if (ohlcvData && ohlcvData.length > 0) {
			logInfo(ohlcvData[0]);
		}

		logInfo("waiting 10 sec");
		await Utils.delay(10000);
	}

	public override async afterLoop(): Promise<void> {
		logInfo("afterLoop");
	}

	public override async cleanup(): Promise<void> {
		logInfo("Cleaning up");
	}
}
