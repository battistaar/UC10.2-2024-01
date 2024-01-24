import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class TimeEntryDurationService {
  /**
   * Return the duration in millisecond, transformed by the business logic.
   *
   * @param millis - The original number of milliseconds
   * @returns The transformed number of milliseconds
   *
   * @beta
  */
  protected abstract calcDuration(millis: number): number;

  getMillis(start: Date, end: Date): number {
    const millis = end.getTime() - start.getTime();
    return this.calcDuration(millis);
  }

  getMinutes(start: Date, end: Date): number {
    return this.getMillis(start, end) / (1000 * 60);
  }

  getHours(start: Date, end: Date): number {
    return this.getMinutes(start, end) / 60;
  }

  getDuration(start: Date, end: Date): number {
    return this.getHours(start, end);
  }
}