import { Inject, Injectable } from "@nestjs/common";
import { FixedAmountService } from "../amount/fixed-amount.service";
import { DurationSettingsDataSource } from "@modules/duration/duration-settings";
import { DurationStrategySelectorService, TimeEntryDurationService } from "@modules/duration/duration-strategy";
import { TimeEntryResultFactory } from "./time-entry.result.factory";
import { TimeEntryAmountService } from "../amount/amount.service";
import { AmountSettings, AmountSettingsDataSource } from "@modules/amount/amount-settings";
import { TimeEntry, TimeEntryDataSource, TimeEntryResultDTO } from "@modules/time-entry";
import { TIME_ENTRY_AMOUNT_SETTINGS_FACTORY, TimeEntryAmountSettings, TimeEntryAmountSettingsFactory } from "@modules/amount/amount-settings/entity-amount-settings/time-entry-amount-settings.ds";
import { CompanyDataSource } from "@modules/company";
import { UserDataSource } from "@modules/user";
import { CachableDataSource } from "@modules/utils/cachable-datasource";
import { CompanyAmountSettings } from "@modules/amount/amount-settings/entity-amount-settings/compant-amount-settings.ds";
import { UserAmountSettings } from "@modules/amount/amount-settings/entity-amount-settings/user-amount-settings.ds";
import { ProjectAmountSettings, ProjectAmountSettingsAdapter } from "@modules/amount/amount-settings/entity-amount-settings/project-amount-settings.ds";
import { ProjectDataSource } from "@modules/project";

@Injectable()
export class TimeEntryResultCalculator {
  constructor(
    protected readonly durationSettingsSrv: DurationSettingsDataSource,
    protected readonly durationStrategySelector: DurationStrategySelectorService,
    protected readonly resultFactorySrv: TimeEntryResultFactory,
    protected readonly amountSettings: AmountSettingsDataSource,
    protected readonly companyDs: CompanyDataSource,
    protected readonly userDs: UserDataSource,
    protected readonly projectDs: ProjectDataSource,
    protected readonly timeEntryDs: TimeEntryDataSource
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

    const companyCache = new CachableDataSource(this.companyDs);
    const userCache = new CachableDataSource(this.userDs);
    const projectCache = new CachableDataSource(this.projectDs);
    const timeEntryCache = new CachableDataSource(this.timeEntryDs);
    timeEntryCache.populateCache(items);

    const company = new CompanyAmountSettings(companyCache);
    const user = new UserAmountSettings(company, userCache, async entity => entity.company);
    const baseProject = new ProjectAmountSettings(user, projectCache, async (_, userId) => userId);

    const results: TimeEntryResultDTO[] = [];
    for(const item of items) {
      const project = new ProjectAmountSettingsAdapter(baseProject, item.user);
      const amountSettingsDs = new TimeEntryAmountSettings(project, timeEntryCache, async entity => entity.project);

      // const amountSettings = await this.amountSettings.getAmountSettings(item.id);
      // const amountSettingsDs = this.timeEntrySettingsFactory.get(item.user);
      const amountSettings = await amountSettingsDs.getAmountSettings(item.id);
      console.log(amountSettings);
      const amountSrv = this.getAmountService(amountSettings, durationSrv, item);
      const resultFactory = this.resultFactorySrv.getFactory(durationSrv, amountSrv);
      results.push(resultFactory(item));
    }
    
    return isArray ? results : results[0];
  }
}