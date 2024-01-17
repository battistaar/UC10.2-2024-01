import { Injectable } from "@nestjs/common";
import { TimeEntry } from "./time-entry.schema";
import { TimeEntryResultDTO } from "./time-entry.dto";
import { TimeEntryDurationService } from "../duration/duration.service";
import { TimeEntryAmountService } from "../amount/amount.service";

@Injectable()
export class TimeEntryResultFactory {

  getFactory(durationSrv: TimeEntryDurationService, amountSrv: TimeEntryAmountService) {
    return (timeEntry: TimeEntry): TimeEntryResultDTO => {
      const duration = durationSrv.getDuration(timeEntry.start, timeEntry.end);
      return {
        ...timeEntry,
        amount: timeEntry.billable ? amountSrv.calcAmount(duration) : 0,
      };
    }
  }
}