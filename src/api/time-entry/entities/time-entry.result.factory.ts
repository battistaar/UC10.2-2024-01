import { Injectable } from "@nestjs/common";
import { TimeEntryAmountService } from "../amount/amount.service";
import { TimeEntryDurationService } from "@modules/duration/duration-strategy";
import { TimeEntryResultDTO } from "@modules/time-entry";
import { TimeEntry } from "@modules/time-entry/entities/time-entry.schema";

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