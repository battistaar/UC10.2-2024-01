export abstract class TimeEntryAmountService {
  abstract calcAmount(duration: number): number;
}