import { DataSource } from "@modules/utils/datasource";
import { AmountSettings } from "./amount-settings.entity";
import { AmountSettingsProvider } from "./amount-settings.ds";

export abstract class AmountSettingsMerger<T> implements AmountSettingsProvider {

  constructor(protected previousSource: AmountSettingsProvider,
              protected datasource: DataSource<T, unknown>,
              protected prevEntityFn: (entity: T) => Promise<string>){}

  protected abstract extractSettings(entity: T): Promise<Partial<AmountSettings>>;

  protected mergeSettings(prevSettings: AmountSettings, currSettings: Partial<AmountSettings>): AmountSettings {
    return Object.assign(prevSettings, currSettings);
  }

  async getAmountSettings(entityId: string): Promise<AmountSettings> {
    const currEntity = await this.datasource.get(entityId);
    const currSettings = await this.extractSettings(currEntity);

    const prevId = await this.prevEntityFn(currEntity);
    const prevSettings = await this.previousSource.getAmountSettings(prevId);
  
    return this.mergeSettings(prevSettings, currSettings);
  }

}