import { LogLevelEnum } from "../models/enums/log-level-enum";
import { FileLogger, FileLoggerOptions } from "../models/objects/logger/file-logger";
import { LoggerContext } from "../models/objects/logger/logger-context";
import { LoggerHandler } from "../models/objects/logger/logger-handler";

export function consoleLoggerHandler(): LoggerHandler {
  return (messages: Array<string>, logLevel: LogLevelEnum, context: LoggerContext) => {
    for (const message of messages) {
      console[logLevel](`${new Date().toISOString()} :: ${logLevel} :: ${message}`);
    }
  };
}

export function fileLoggerHandler(fileLoggerOptions: FileLoggerOptions): LoggerHandler {
  return (messages: Array<string>, logLevel: LogLevelEnum, context: LoggerContext) => {
    FileLogger.getInstance(fileLoggerOptions).handleLog(messages, logLevel, context);
  };
}
