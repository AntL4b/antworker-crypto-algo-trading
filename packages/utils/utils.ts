import { AntworkerError } from "../errors/antworker-error";
import { TimeFrameEnum } from "../models/enums/time-frame-enum";

export class Utils {
  /**
   * Method to wait a given amount of time
   * @param ms Number of ms to wait
   * @returns A promise after the given amount of time to wait
   */
  static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get the amount of seconds that represent one candle a given time frame
   * @param timeFrame The given time frame
   * @returns The amount of seconds that represent one candle a given time frame
   */
  static getTimeFrameValueInSeconds(timeFrame: TimeFrameEnum): number {
    switch (timeFrame) {
      case TimeFrameEnum.OneSecond:
        return 1;
      case TimeFrameEnum.OneMinute:
        return 60;
      case TimeFrameEnum.ThreeMinutes:
        return 180;
      case TimeFrameEnum.FiveMinutes:
        return 300;
      case TimeFrameEnum.FifteenMinutes:
        return 900;
      case TimeFrameEnum.ThirtyMinutes:
        return 1800;
      case TimeFrameEnum.OneHour:
        return 3600;
      case TimeFrameEnum.TwoHours:
        return 7200;
      case TimeFrameEnum.FourHours:
        return 14400;
      case TimeFrameEnum.SixHours:
        return 21600;
      case TimeFrameEnum.HeightHours:
        return 28800;
      case TimeFrameEnum.TwelveHours:
        return 43200;
      case TimeFrameEnum.OneDay:
        return 86400;
      case TimeFrameEnum.ThreeDays:
        return 259200;
      case TimeFrameEnum.OneWeek:
        return 604800;
      default:
        throw new AntworkerError("Unknown time frame");
    }
  }
}
