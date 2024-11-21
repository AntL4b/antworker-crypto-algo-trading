import { AntworkerError } from "../errors/antworker-error";
import { Strategy } from "../strategy/strategy";

export class Antworker {
  private static instance: Antworker;
  private strategy: Strategy;

  private constructor() {
    this.strategy = null;
  }

  /**
   * Singleton getInstance method
   * @returns The singleton instance
   */
  static getInstance(): Antworker {
    if (!Antworker.instance) {
      Antworker.instance = new Antworker();
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
 * @returns Antworker singleton instance
 */
export function antworker(): Antworker {
  return Antworker.getInstance();
}
