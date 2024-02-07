import { Injectable } from "@nestjs/common";
import { AmountSettings } from "./amount-settings.entity";

@Injectable()
export abstract class AmountSettingsDataSource implements AmountSettingsProvider {
  abstract getAmountSettings(entityId: string): Promise<AmountSettings>;
}

export interface AmountSettingsProvider {
  getAmountSettings(entityId: string): Promise<AmountSettings>
}