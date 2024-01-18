import { Inject } from "@nestjs/common";
import { AmountSettingsDataSource } from "./amount-settings.ds";
import { HourlyRateSettings } from "./amount-settings.entity";

export const STATIC_HOURLY_RATE = 'STATIC_HOURLY_RATE';

export class AmountSettingsStatiDataSource extends AmountSettingsDataSource {
  constructor(@Inject(STATIC_HOURLY_RATE) protected hourlyRate: number) {
    super();
  }

  async getAmountSettings(userId: string): Promise<HourlyRateSettings> {
    return {
      hourlyRate: this.hourlyRate
    }  
  }

}