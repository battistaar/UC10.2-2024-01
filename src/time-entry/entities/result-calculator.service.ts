import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TimeEntryResultDTO } from "./time-entry.dto";
import { TimeEntry } from "./time-entry.schema";
import { FixedAmountService } from "../amount/fixed-amount.service";
import { DurationSettingsDataSource } from "../duration-settings/duration-settings.ds";
import { DurationStrategySelectorService } from "../duration/duration-strategy-selector.service";
import { TimeEntryResultFactory } from "./time-entry.result.factory";
import { AmountSettingsDataSource } from "../amount-settings/amount-settings.ds";
import { TimeEntryDurationService } from "../duration/duration.service";
import { TimeEntryAmountService } from "../amount/amount.service";
import { AmountSettings } from "../amount-settings/amount-settings.entity";

@Injectable()
export class TimeEntryResultCalculator {
  constructor(
    protected readonly durationSettingsSrv: DurationSettingsDataSource,
    protected readonly durationStrategySelector: DurationStrategySelectorService,
    protected readonly resultFactorySrv: TimeEntryResultFactory,
    protected readonly amountSettings: AmountSettingsDataSource
  ){ }

  protected async getDurationService(userId: string): Promise<TimeEntryDurationService> {
    const durationSettings = await this.durationSettingsSrv.getDurationSettings(userId);
    return this.durationStrategySelector.getStrategy(durationSettings.strategy);
  }

  protected getAmountService(amountSettings: AmountSettings, durationSrv: TimeEntryDurationService, item: TimeEntry): TimeEntryAmountService {
    let amountSrv = new FixedAmountService(amountSettings.hourlyRate);
    if(durationSrv.getMinutes(item.start, item.end) < amountSettings.minDuration) {
      amountSrv = new FixedAmountService(0);
    }

    return amountSrv;
  }

  async calcResult(userId: string, items: TimeEntry[]): Promise<TimeEntryResultDTO[]>;
  async calcResult(userId: string, item: TimeEntry): Promise<TimeEntryResultDTO>; 
  async calcResult(userId: string, arg: TimeEntry | TimeEntry[]) {
    const isArray = Array.isArray(arg);
    const items = isArray ? arg : [arg];

    const durationSrv = await this.getDurationService(userId);

    const amountSettings = await this.amountSettings.getAmountSettings(userId);
    
    const results: TimeEntryResultDTO[] = [];
    for(const item of items) {
      const amountSrv = this.getAmountService(amountSettings, durationSrv, item);
      const resultFactory = this.resultFactorySrv.getFactory(durationSrv, amountSrv);
      results.push(resultFactory(item));
    }
    
    return isArray ? results : results[0];
  }
}