import { Project, ProjectDataSource } from "@modules/project";
import { AmountSettingsProvider } from "../amount-settings.ds";
import { AmountSettings } from "../amount-settings.entity";

export class ProjectAmountSettings {
  constructor(protected previousDataSource: AmountSettingsProvider,
              protected datasource : ProjectDataSource,
              protected prevIdFn: (enitity: Project, userId: string) => Promise<string>
              ) {}

  protected mergeSettings(prevSettings: AmountSettings, currSettings: Partial<AmountSettings>): AmountSettings {
    return Object.assign(prevSettings, currSettings);
  }

  async getAmountSettings(entityId: string, userId: string): Promise<AmountSettings> {
    const project = await this.datasource.get(entityId);

    const projectUserSettings = project.settings.amount.userSettings.find(i => i.userId.toString() === userId);
    const projectSettings = projectUserSettings ? projectUserSettings.settings : {};

    const prevId = await this.prevIdFn(project, userId);
    const prevSettings = await this.previousDataSource.getAmountSettings(prevId);

    return this.mergeSettings(prevSettings, projectSettings);
  }
}

export class ProjectAmountSettingsAdapter implements AmountSettingsProvider {
  constructor(protected baseSettingsProvider: ProjectAmountSettings, protected userId: string) {}

  async getAmountSettings(entityId: string): Promise<AmountSettings> {
    return this.baseSettingsProvider.getAmountSettings(entityId, this.userId);
  } 
}