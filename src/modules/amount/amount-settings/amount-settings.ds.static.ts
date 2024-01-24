import { Inject, Optional } from "@nestjs/common";
import { AmountSettingsDataSource } from "./amount-settings.ds";
import { AmountSettings } from "./amount-settings.entity";

export const STATIC_HOURLY_RATE = 'STATIC_HOURLY_RATE';
export const STATIC_MIN_BILLABLE_DURATION = 'STATIC_MIN_BILLABLE_DURATION';

export class AmountSettingsStatiDataSource extends AmountSettingsDataSource {
  constructor(
    @Optional() @Inject(STATIC_HOURLY_RATE) protected hourlyRate: number = 60,
    @Optional() @Inject(STATIC_MIN_BILLABLE_DURATION) protected minDuration: number = 0) {
    super();
  }

  async getAmountSettings(userId: string): Promise<AmountSettings> {
    return {
      hourlyRate: this.hourlyRate,
      minDuration: this.minDuration
    }  
  }

}