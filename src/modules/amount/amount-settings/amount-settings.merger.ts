import { AmountSettingsProvider } from "./amount-settings.ds";
import { AmountSettings } from "./amount-settings.entity";
import { DataSource } from "@modules/utils/datasource";

export abstract class AmountSettingsMerger<T> implements AmountSettingsProvider {
  constructor(protected previousSource: AmountSettingsProvider,
              protected datasource: DataSource<T, unknown>,
              protected prevIdFn: (enitity: T) => Promise<string>
    ){ }

  protected abstract extractSettings(entity: T): Promise<Partial<AmountSettings>>;

  protected mergeSettings(prevSettings: AmountSettings, currSettings: Partial<AmountSettings>): AmountSettings {
    return Object.assign(prevSettings, currSettings);
  }
  
  async getAmountSettings(entityId: string): Promise<AmountSettings> {
    const currEntity = await this.datasource.get(entityId);
    const currSettings = await this.extractSettings(currEntity);

    const prevId = await this.prevIdFn(currEntity);
    const prevSettings = await this.previousSource.getAmountSettings(prevId);

    return this.mergeSettings(prevSettings, currSettings);
  }


}