import { antworker, consoleLoggerHandler, fileLoggerHandler, Logger, LogLevelEnum } from "@antl4b/antworker-crypto-algo-trading";
import { MyStrat } from "./my-strat";


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
