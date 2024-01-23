import { Injectable } from "@nestjs/common";
import { TimeEntryResultFactory } from "./time-entry.result.factory";
import { TimeEntry } from "./time-entry.schema";
import { TimeEntryResultDTO } from "./time-entry.dto";
import { DurationSettingsDataSource } from "../duration-settings/duration-settings.ds";
import { DurationStrategySelectorService } from "../duration/duration-strategy-selector.service";
import { TimeEntryDurationService } from "../duration/duration.service";
import { TimeEntryAmountService } from "../amount/amount.service";
import { AmountSettingsDataSource } from "../amount-settings/amount-settings.ds";
import { FixedAmountService } from "../amount/fixed-amount.service";

@Injectable()
export class TimeEntryResultCalculator {
  constructor(
    protected readonly resultFactorySrv: TimeEntryResultFactory,
    protected readonly durationSettingsSrv: DurationSettingsDataSource,
    protected readonly durationStrategySelector: DurationStrategySelectorService,
    protected readonly amountSettingsSrv: AmountSettingsDataSource) {}

  protected async getDurationService(userId: string): Promise<TimeEntryDurationService> {
    const durationSettings = await this.durationSettingsSrv.getDurationSettings(userId);
    return this.durationStrategySelector.getStrategy(durationSettings.strategy);
  }

  protected async getAmountService(userId: string, durationSrv: TimeEntryDurationService, item: TimeEntry): Promise<TimeEntryAmountService> {
    const amountSettings = await this.amountSettingsSrv.getAmountSettings(userId);
    const duration = durationSrv.getMinutes(item.start, item.end);
    if (duration < amountSettings.minDuration) {
      return new FixedAmountService(0);
    }
    return new FixedAmountService(amountSettings.hourlyRate);
  }

  async calcResult(userId: string, item: TimeEntry): Promise<TimeEntryResultDTO> {
    const durationSrv = await this.getDurationService(userId);
    const amountSrv = await this.getAmountService(userId, durationSrv, item);

    const resultFactory = this.resultFactorySrv.getFactory(durationSrv, amountSrv);
    return resultFactory(item);
  }
}