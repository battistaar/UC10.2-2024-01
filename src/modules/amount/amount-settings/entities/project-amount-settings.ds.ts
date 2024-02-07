import { Injectable } from "@nestjs/common";
import { ProjectDataSource } from "@modules/project";
import { AmountSettings } from "../amount-settings.entity";
import { AmountSettingsProvider } from "../amount-settings.ds";

@Injectable()
export class ProjectAmountSettings {
  constructor(protected previousSource: AmountSettingsProvider,
    protected datasource: ProjectDataSource) {}

  protected mergeSettings(prevSettings: AmountSettings, currSettings: Partial<AmountSettings>): AmountSettings {
    return Object.assign(prevSettings, currSettings);
  }

  async getAmountSettings(entityId: string, userId: string): Promise<AmountSettings> {
    const project = await this.datasource.get(entityId);

    const projectUserSettings = project.settings.amount.userSettings.find(i => i.userId.toString() === userId);
    const projectSettings = projectUserSettings ? projectUserSettings.settings : {};

    const prevSettings = await this.previousSource.getAmountSettings(userId);
  
    return this.mergeSettings(prevSettings, projectSettings);
  }
}

export class ProjectAmountSettingsAdapter implements AmountSettingsProvider {
  constructor(protected baseSettingsProvider: ProjectAmountSettings, protected userId: string) {}

  async getAmountSettings(entityId: string): Promise<AmountSettings> {
    return this.baseSettingsProvider.getAmountSettings(entityId, this.userId);
  }
}