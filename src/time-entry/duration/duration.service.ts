import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class TimeEntryDurationService {

  protected abstract calcDuration(millis: number): number;

  getDuration(start: Date, end: Date): number {
    const millis = end.getTime() - start.getTime();
    return this.calcDuration(millis);
  }
}