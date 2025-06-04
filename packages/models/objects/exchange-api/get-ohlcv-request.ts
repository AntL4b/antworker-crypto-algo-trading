import { TimeFrameEnum } from "../../enums/time-frame-enum";

export interface GetOHLCVRequest {
	marketId: string;
	timeFrame: TimeFrameEnum;
	startTime?: number;
	endTime?: number
	limit?: number
}
