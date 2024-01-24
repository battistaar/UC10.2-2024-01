import { Inject, Optional } from "@nestjs/common";
import { TimeEntryAmountService } from "./amount.service";

export const FIXED_AMOUNT_DEFAULT_VALUE = 'FIXED_AMOUNT_DEFAULT_VALUE';

export class FixedAmountService extends TimeEntryAmountService {
  constructor(@Optional() @Inject(FIXED_AMOUNT_DEFAULT_VALUE) protected readonly hourlyRate: number = 60) {
    super();
  }

  calcAmount(duration: number): number {
    return duration * this.hourlyRate;
  }
}