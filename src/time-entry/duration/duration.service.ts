export abstract class TimeEntryDurationService {

  abstract getDuration(start: Date, end: Date): number;

  // abstract calcDuration(milliseconds: number): number;

  // getDuration(start: Date, end: Date) {
  //   const millis = end.getTime() - start.getTime();
  //   const adjustedValue = this.calcDuration(millis);
  //   return adjustedValue;
  // }
}