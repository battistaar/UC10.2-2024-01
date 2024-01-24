import { Injectable } from "@nestjs/common";
import { TimeEntryResultFactory } from "./time-entry.result.factory";
import { AmountSettingsDataSource, AmountSettings } from "@modules/amount/amount-settings";
import { DurationSettingsDataSource } from "@modules/duration/duration-settings";
import { DurationStrategySelectorService, TimeEntryDurationService } from "@modules/duration/duration-strategy";
import { TimeEntryResultDTO } from "@modules/time-entry";
import { TimeEntry } from "@modules/time-entry/entities/time-entry.schema";
import { TimeEntryAmountService } from "../amount/amount.service";
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

  protected async getAmountService(amountSettings: AmountSettings, durationSrv: TimeEntryDurationService, item: TimeEntry): Promise<TimeEntryAmountService> {
    
    const duration = durationSrv.getMinutes(item.start, item.end);
    if (duration < amountSettings.minDuration) {
      return new FixedAmountService(0);
    }
    return new FixedAmountService(amountSettings.hourlyRate);
  }

  async calcResult(userId: string, items: TimeEntry[]): Promise<TimeEntryResultDTO[]>;
  async calcResult(userId: string, item: TimeEntry): Promise<TimeEntryResultDTO>;
  async calcResult(userId: string, arg: TimeEntry | TimeEntry[]) {
    const isArray = Array.isArray(arg);
    const items = isArray ? arg : [arg];

    const durationSrv = await this.getDurationService(userId);
    const amountSettings = await this.amountSettingsSrv.getAmountSettings(userId);

    const results: TimeEntryResultDTO[] = [];
    for (const item of items) {
      const amountSrv = await this.getAmountService(amountSettings, durationSrv, item);
      const resultFactory = this.resultFactorySrv.getFactory(durationSrv, amountSrv);
      results.push(resultFactory(item));
    }
    return isArray ? results : results[0];
  }
}