import { TimeEntryAmountService } from "./amount.service";

export class FixedAmountService extends TimeEntryAmountService {
  calcAmount(duration: number) {
      return duration * 60;
  }
}