import { User } from "@modules/user";
import { AmountSettingsMerger } from "../amount-settings.merger";
import { AmountSettings } from "../amount-settings.entity";

export class UserAmountSettings extends AmountSettingsMerger<User> {
  
  protected async extractSettings(entity: User): Promise<Partial<AmountSettings>> {
    return entity.settings.amount
  }

}