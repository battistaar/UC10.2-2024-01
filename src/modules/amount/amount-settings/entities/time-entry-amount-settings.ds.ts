import { TimeEntry } from "@modules/time-entry";
import { AmountSettingsMerger } from "../amount-settings.merger";
import { AmountSettings } from "../amount-settings.entity";
import { AmountSettingsProvider } from "../amount-settings.ds";


export class TimeEntryAmountSettings extends AmountSettingsMerger<TimeEntry> {

  protected async extractSettings(entity: TimeEntry): Promise<Partial<AmountSettings>> {
    return entity.settings.amount
  }

}

export const TIME_ENTRY_AMOUNT_SETTINGS_FACTORY = 'TIME_ENTRY_AMOUNT_SETTINGS_FACTORY';

export type TimeEntryAmountSettingsFactory = {get(userId: string): AmountSettingsProvider};