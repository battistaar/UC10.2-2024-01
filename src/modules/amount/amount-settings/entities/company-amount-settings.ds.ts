import { CompanyDataSource } from "@modules/company";
import { Injectable } from "@nestjs/common";
import { AmountSettings } from "../amount-settings.entity";
import { AmountSettingsProvider } from "../amount-settings.ds";

@Injectable()
export class CompanyAmountSettings implements AmountSettingsProvider {
  constructor(protected dataSource: CompanyDataSource) {
  }

  async getAmountSettings(entityId: string): Promise<AmountSettings> {
    const entity = await this.dataSource.get(entityId);
    return entity.settings.amount;
  }
}