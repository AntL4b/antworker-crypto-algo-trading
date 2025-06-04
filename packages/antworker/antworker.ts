import { AntworkerError } from "../errors/antworker-error";
import { logInfo } from "../logger/logger";
import { Strategy } from "../strategy/strategy";

export class Antworker {
  private static instance: Antworker;
  private strategy: Strategy;
	public workerAppName: string;

  private constructor(workerAppName: string) {
    this.strategy = null;
		this.workerAppName = workerAppName;
		logInfo(`Antworker ${workerAppName} ready`);
  }

  /**
   * Singleton getInstance method
	 * @param workerAppName The name of your app
   * @returns The singleton instance
   */
  static getInstance(workerAppName: string = "Antworker"): Antworker {
    if (!Antworker.instance) {
      Antworker.instance = new Antworker(workerAppName);
    }

    return Antworker.instance;
  }

  /**
   * Set the strategy to run
   * @param strategy The strategy to run
   */
  setStrategy(strategy: Strategy): void {
    this.strategy = strategy;
  }

  /**
   * Launch the strategy set to run
   */
  runStrategy(): void {
    if (this.strategy != null) {
      this.strategy._run();
    } else {
      throw new AntworkerError("No strategy is defined")
    }
  }
}

/**
 * Entrypoint for Antworker
 * @param workerAppName The name of your app
 * @returns Antworker singleton instance
 */
export function antworker(workerAppName: string = "Antworker"): Antworker {
  return Antworker.getInstance(workerAppName);
}
