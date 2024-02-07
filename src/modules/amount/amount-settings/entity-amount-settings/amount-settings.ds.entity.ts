import { CompanyDataSource } from "@modules/company";
import { AmountSettingsDataSource } from "../amount-settings.ds";
import { AmountSettings } from "../amount-settings.entity";
import { UserDataSource } from "@modules/user";
import { ProjectDataSource } from "@modules/project";
import { TimeEntryDataSource } from "@modules/time-entry";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EntityAmountSettingsDataSource extends AmountSettingsDataSource {
  constructor(
    protected companyDs: CompanyDataSource,
    protected userDs: UserDataSource,
    protected projectDs: ProjectDataSource,
    protected entryDs: TimeEntryDataSource
    ) {
      super();
    }
  
  protected composeSettings(base: AmountSettings, partials: Partial<AmountSettings>[]): AmountSettings {
    return partials.reduce((result, current) => {
      Object.assign(result, current);
      return result;
    }, structuredClone(base)) as AmountSettings;
  }

  async getAmountSettings(entityId: string): Promise<AmountSettings> {
    const entry = await this.entryDs.get(entityId);
    const company = await this.companyDs.get(entry.company);
    const project = await this.projectDs.get(entry.project);
    const user = await this.userDs.get(entry.user);
    
    const projectUserSettings = project.settings.amount.userSettings.find(i => i.userId.toString() === entry.user.toString());
    const projectSettings = projectUserSettings ? projectUserSettings.settings : {};

    return this.composeSettings(
      company.settings.amount,
      [
        user.settings.amount,
        projectSettings,
        entry.settings.amount
      ]
    )
  }
}