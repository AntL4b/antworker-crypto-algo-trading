import * as fs from "fs";
import * as path from "path";
import { AntworkerError } from "../../../errors/antworker-error";
import { LogLevelEnum } from "../../enums/log-level-enum";
import { LoggerContext } from "./logger-context";

const DEFAULT_MAX_FILE_SIZE: number = 4 * 1024 * 1024;
const DEFAULT_LOG_DIR: string = "logs";

export interface FileLoggerOptions {
	filePrefix: string;
  logDir?: string;
  maxFileSize?: number;
}

export class FileLogger {
  private static instance: FileLogger = null;

  private fileLoggerOptions: FileLoggerOptions;
  private logQueue: Array<string> = [];
  private processingLogQueue: boolean;
  private currentFileSize: number;
  private currentFileStream?: fs.WriteStream;
  private isReady: boolean;

  private constructor(fileLoggerOptions: FileLoggerOptions) {
    this.fileLoggerOptions = fileLoggerOptions;
    this.fileLoggerOptions.maxFileSize = this.fileLoggerOptions.maxFileSize || DEFAULT_MAX_FILE_SIZE;
		this.fileLoggerOptions.logDir = this.fileLoggerOptions.logDir || DEFAULT_LOG_DIR;

    this.logQueue = [];
    this.processingLogQueue = false;
    this.init().then(() => {
      this.isReady = true;
      this.launchLogQueueProcessing(); // In case some messages were received during init() call
    });
  }

  /**
   * Singleton getInstance method
   * @returns The singleton instance
   */
  static getInstance(fileLoggerOptions: FileLoggerOptions = null): FileLogger {
    if (!FileLogger.instance) {
      if (fileLoggerOptions == null) {
        throw new AntworkerError("fileLoggerOptions can't be null when initialising the file logger");
      }

      FileLogger.instance = new FileLogger(fileLoggerOptions);
    }

    return FileLogger.instance;
  }

  private async init(): Promise<void> {
    await fs.promises.mkdir(this.fileLoggerOptions.logDir, { recursive: true });
    const timestamp = this.getTimestamp();
    const logFileName = `${this.fileLoggerOptions.filePrefix}-${timestamp}.log`;
    this.currentFileStream = fs.createWriteStream(path.join(this.fileLoggerOptions.logDir, logFileName), {
      flags: "a",
    });
    this.currentFileSize = 0;
  }

  /**
   * Generate "YYYYMMDD-hhmmss"
   * @returns "YYYYMMDD-hhmmss"
   */
  private getTimestamp(): string {
    const now = new Date();
    const YYYY = now.getFullYear().toString();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    return `${YYYY}${MM}${DD}-${hh}${mm}${ss}`;
  }

  /**
   * Handle the log message array given as parameter
   * @param messages The log message aray to be logged
   * @param logLevel The log level
   * @param context The log context
   */
  public handleLog(messages: Array<string>, logLevel: LogLevelEnum, context: LoggerContext): void {
    for (const message of messages) {
      this.logQueue.push(`${new Date().toISOString()} :: ${logLevel} :: ${message}`);
    }

    if (this.isReady) {
      this.launchLogQueueProcessing();
    }
  }

  private launchLogQueueProcessing() {
    if (!this.processingLogQueue) {
      this.processingLogQueue = true;
      this.processLogQueue().finally(() => {
        this.processingLogQueue = false;
      });
    }
  }

  private async rollFile() {
    this.currentFileStream.end();
    await new Promise<void>((resolve) => {
      this.currentFileStream.once("finish", () => resolve());
    });

    const timestamp = this.getTimestamp();
    const logFileName = `${this.fileLoggerOptions.filePrefix}-${timestamp}.log`;
    this.currentFileStream = fs.createWriteStream(path.join(this.fileLoggerOptions.logDir, logFileName), {
      flags: "a",
    });
    this.currentFileSize = 0;
  }

  private async processLogQueue(): Promise<void> {
    // Drain the log queue
    while (this.logQueue.length > 0) {
      const msg = this.logQueue.shift()!;
      const data = msg + "\n";
      const byteLen = Buffer.byteLength(data);

			// Don't write if a single log represent more than a file max size
      if (byteLen <= this.fileLoggerOptions.maxFileSize) {
        // Roll if this write would exceed maxSize
        if (this.currentFileSize + byteLen > this.fileLoggerOptions.maxFileSize) {
          await this.rollFile();
        }

        // Write immediately; underlying stream buffers it
        this.currentFileStream.write(data);
        this.currentFileSize += byteLen;
      }
    }
  }
}
