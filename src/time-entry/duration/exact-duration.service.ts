import { Injectable } from "@nestjs/common";
import { TimeEntryDurationService } from "./duration.service";

@Injectable()
export class ExactTimeEntryDurationService extends TimeEntryDurationService {
  getDuration(start: Date, end: Date): number {
      const millis = end.getTime() - start.getTime();
      return millis / (1000 * 60 * 60);
  }
}