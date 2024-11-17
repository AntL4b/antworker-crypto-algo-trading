export class Utils {

  /**
   * Method to wait a given amount of time
   * @param ms Number of ms to wait
   * @returns A promise after the given amount of time to wait
   */
  static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
