import { LogLevelEnum } from "../models/enums/log-level-enum";
import { LoggerContext } from "../models/objects/logger/logger-context";
import { LoggerFormatter } from "../models/objects/logger/logger-formatter";
import { LoggerHandler } from "../models/objects/logger/logger-handler";

export class Logger {
  private static instance: Logger = null;

  private logLevel: LogLevelEnum;
  private formatter: LoggerFormatter;
  private handlers: Array<LoggerHandler>;

  private constructor() {
		// Set a default formatter
    this.formatter = (payload: any) => {
      return JSON.stringify(payload, null, 2);
    };

    // Set default logs level
    this.logLevel = LogLevelEnum.Info;
    this.handlers = [];
  }

  /**
   * Singleton getInstance method
   * @returns The singleton instance
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  /**
   * Set the formatter to format the payload before injecting it through the handlers pipeline
   * @param formatter: the formatter to be applied
   */
  setformatter(formatter: (payload: any) => string): void {
    this.formatter = formatter;
  }

  /**
   * Add a log handler
   * @param handler: the handler to be added
   */
  addHandler(handler: (message: Array<string>, logLevel: LogLevelEnum, context: LoggerContext) => void): void {
    this.handlers.push(handler);
  }

  /**
   * Remove all handlers
   */
  removeAllHandlers(): void {
    this.handlers = [];
  }

  /**
   * Define log level.
   * Incoming logs with lower importance than the log level will be ignored
   * @param logLevel: log level to be defined
   */
  setLogLevel(logLevel: LogLevelEnum): void {
    this.logLevel = logLevel;
  }

  /**
   * Log paylog with trace level
   * @param payload payload to be logged
   */
  trace(...payload: Array<any>): void {
    if ([LogLevelEnum.Trace].includes(this.logLevel)) {
      this.performLog(payload, LogLevelEnum.Debug, this.buildContext());
    }
  }

  /**
   * Log paylog with debug level
   * @param payload payload to be logged
   */
  debug(...payload: Array<any>): void {
    if ([LogLevelEnum.Trace, LogLevelEnum.Debug].includes(this.logLevel)) {
      this.performLog(payload, LogLevelEnum.Debug, this.buildContext());
    }
  }

  /**
   * Log paylog with info level
   * @param payload payload to be logged
   */
  info(...payload: Array<any>): void {
    if ([LogLevelEnum.Trace, LogLevelEnum.Debug, LogLevelEnum.Info].includes(this.logLevel)) {
      this.performLog(payload, LogLevelEnum.Info, this.buildContext());
    }
  }

  /**
   * Log paylog with warn level
   * @param payload payload to be logged
   */
  warn(...payload: Array<any>): void {
    if (this.logLevel !== LogLevelEnum.Error) {
      this.performLog(payload, LogLevelEnum.Warn, this.buildContext());
    }
  }

  /**
   * Log paylog with error level
   * @param payload payload to be logged
   */
  error(...payload: Array<any>): void {
    this.performLog(payload, LogLevelEnum.Error, this.buildContext());
  }

  private performLog(payload: Array<any>, logLevel: LogLevelEnum, context: LoggerContext): void {
    payload = payload.map((p) => this.formatter(p));

    for (const handler of this.handlers) {
      handler(payload, logLevel, context);
    }
  }

  private buildContext(): LoggerContext {
    return {
      logLevel: this.logLevel,
    };
  }
}

/**
 * Log paylog with trace level
 * @param payload payload to be logged
 */
export function logTrace(...payload: Array<any>): void {
  return Logger.getInstance().trace(...payload);
}

/**
 * Log paylog with debug level
 * @param payload payload to be logged
 */
export function logDebug(...payload: Array<any>): void {
  return Logger.getInstance().debug(...payload);
}

/**
 * Log paylog with info level
 * @param payload payload to be logged
 */
export function logInfo(...payload: Array<any>): void {
  return Logger.getInstance().info(...payload);
}

/**
 * Log paylog with warn level
 * @param payload payload to be logged
 */
export function logWarn(...payload: Array<any>): void {
  return Logger.getInstance().info(...payload);
}

/**
 * Log paylog with error level
 * @param payload payload to be logged
 */
export function logError(...payload: Array<any>): void {
  return Logger.getInstance().error(...payload);
}
