import { antworker, consoleLoggerHandler, fileLoggerHandler, Logger, LogLevelEnum } from "@antl4b/antworker-crypto-algo-trading";
import { MyStrat } from "./my-strat";

const APP_NAME = "sample-strategy-runner";

// Configure logger
const logger = Logger.getInstance();
logger.setLogLevel(LogLevelEnum.Trace);
logger.addHandler(consoleLoggerHandler());
logger.addHandler(fileLoggerHandler({
	filePrefix: APP_NAME,
	logDir: "logs",
}));

// Configure app
const app = antworker(APP_NAME);
app.setStrategy(new MyStrat());
app.runStrategy();
