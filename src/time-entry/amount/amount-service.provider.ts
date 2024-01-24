import { Injectable } from "@nestjs/common";
import { TimeEntryAmountService } from "./amount.service";
import { FixedAmountService } from "./fixed-amount.service";
import { AmountSettingsDataSource } from "@modules/amount/amount-settings";

@Injectable()
export class AmountServiceProvider {
  constructor(protected amountSettingsSrv: AmountSettingsDataSource) {}

  async getAmountService(userId: string): Promise<TimeEntryAmountService> {
    const amountSettings = await this.amountSettingsSrv.getAmountSettings(userId);
    return new FixedAmountService(amountSettings.hourlyRate)
  }
}