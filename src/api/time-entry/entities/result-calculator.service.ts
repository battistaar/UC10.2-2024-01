import { Injectable } from "@nestjs/common";
import { FixedAmountService } from "../amount/fixed-amount.service";
import { DurationSettingsDataSource } from "@modules/duration/duration-settings";
import { DurationStrategySelectorService, TimeEntryDurationService } from "@modules/duration/duration-strategy";
import { TimeEntryResultFactory } from "./time-entry.result.factory";
import { TimeEntryAmountService } from "../amount/amount.service";
import { AmountSettings } from "@modules/amount/amount-settings";
import { TimeEntry, TimeEntryDataSource, TimeEntryResultDTO } from "@modules/time-entry";
import { CompanyDataSource } from "@modules/company";
import { ProjectDataSource } from "@modules/project";
import { UserDataSource } from "@modules/user";
import { CachableDataSource } from "@modules/utils/cachable.datasource";
import { TimeEntryAmountSettings } from "@modules/amount/amount-settings/entities/time-entry-amount-settings.ds";
import { CompanyAmountSettings } from "@modules/amount/amount-settings/entities/company-amount-settings.ds";
import { ProjectAmountSettings, ProjectAmountSettingsAdapter } from "@modules/amount/amount-settings/entities/project-amount-settings.ds";
import { UserAmountSettings } from "@modules/amount/amount-settings/entities/user-amount-settings.ds";

@Injectable()
export class TimeEntryResultCalculator {
  constructor(
    protected readonly durationSettingsSrv: DurationSettingsDataSource,
    protected readonly durationStrategySelector: DurationStrategySelectorService,
    protected readonly resultFactorySrv: TimeEntryResultFactory,
    protected companyDs: CompanyDataSource,
    protected userDs: UserDataSource,
    protected projectDs: ProjectDataSource,
    protected entryDs: TimeEntryDataSource
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
    const timeEntryCache = new CachableDataSource(this.entryDs);

    const company = new CompanyAmountSettings(companyCache);
    const user = new UserAmountSettings(company, userCache, async entity => entity.company);
    const baseProject = new ProjectAmountSettings(user, projectCache);
    
    
    const results: TimeEntryResultDTO[] = [];
    for(const item of items) {
      const project = new ProjectAmountSettingsAdapter(baseProject, item.user);
      const amountSettingsDs = new TimeEntryAmountSettings(project, timeEntryCache, async entity => entity.project);

      const amountSettings = await amountSettingsDs.getAmountSettings(item.id);
      console.log(amountSettings);
      const amountSrv = this.getAmountService(amountSettings, durationSrv, item);
      const resultFactory = this.resultFactorySrv.getFactory(durationSrv, amountSrv);
      results.push(resultFactory(item));
    }
    
    return isArray ? results : results[0];
  }
}