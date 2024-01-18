import { Injectable } from "@nestjs/common";
import { HourlyRateSettings } from "./amount-settings.entity";

@Injectable()
export abstract class AmountSettingsDataSource {
  abstract getAmountSettings(userId: string): Promise<HourlyRateSettings>;
}