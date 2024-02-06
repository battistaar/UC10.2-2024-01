import { Injectable } from "@nestjs/common";
import { AmountSettings } from "./amount-settings.entity";

@Injectable()
export abstract class AmountSettingsDataSource {
  abstract getAmountSettings(entityId: string): Promise<AmountSettings>;
}