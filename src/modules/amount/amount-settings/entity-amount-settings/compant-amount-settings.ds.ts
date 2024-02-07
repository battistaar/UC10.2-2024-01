import { CompanyDataSource } from "@modules/company";
import { AmountSettingsProvider } from "../amount-settings.ds";
import { AmountSettings } from "../amount-settings.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CompanyAmountSettings implements AmountSettingsProvider {
  constructor(protected datasource: CompanyDataSource) {}

  async getAmountSettings(entityId: string): Promise<AmountSettings> {
      const entity = await this.datasource.get(entityId);
      return entity.settings.amount;
  }
}