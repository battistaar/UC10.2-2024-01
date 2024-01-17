import { TimeEntryDurationService } from "./duration.service";

export class ExactTimeEntryDurationService extends TimeEntryDurationService {
  calcDuration(millis: number): number {
      return millis / (1000 * 60 * 60);
  }
}