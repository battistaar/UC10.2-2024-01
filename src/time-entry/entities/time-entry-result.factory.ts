import { TimeEntryDurationService } from "../duration/duration.service";
import { TimeEntryAmountService } from "../amount/amount.service";
import { TimeEntry } from "./time-entry.schema";
import { TimeEntryResultDTO } from "./time-entry.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TimeEntryResultFactory {
  constructor(
    protected readonly durationSrv: TimeEntryDurationService,
    protected readonly amountSrv: TimeEntryAmountService
  ) {}

  getFactory() {
    return (timeEntry: TimeEntry): TimeEntryResultDTO => {
      const duration = this.durationSrv.getDuration(timeEntry.start, timeEntry.end);
      return {
        ...timeEntry,
        amount: timeEntry.billable ? this.amountSrv.calcAmount(duration) : 0,
      };
    }
  }
}