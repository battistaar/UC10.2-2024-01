import { TimeEntryDurationService } from "./duration.service";

export class ExactTimeEntryDurationService extends TimeEntryDurationService {
  protected calcDuration(millis: number): number {
    return millis / (1000 * 60 * 60);
  }

}