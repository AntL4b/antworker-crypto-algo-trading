import { logError } from "../logger/logger";
import { AntworkerError } from "../models/antworker-error";

export abstract class Strategy {
  constructor() {}

  async _run(): Promise<void> {
    try {
      while (true) {
        await this.beforeLoop();
        await this.loop();
        await this.afterLoop();
      }
    } catch (error) {
      logError("An error occurred when running strategy:");
      logError((error as AntworkerError).message);
      await this.cleanup();
    }
  }

  abstract beforeLoop(): Promise<void>;
  abstract loop(): Promise<void>;
  abstract afterLoop(): Promise<void>;
  abstract cleanup(): Promise<void>;
}
