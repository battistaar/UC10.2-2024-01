import { Inject } from "@nestjs/common";
import { DurationSettingsDataSource } from "./duration-settings.ds";
import { DurationSettings, DurationStrategy } from "./duration-settings.entity";

export const STATIC_DURATION_STRATEGY = 'STATIC_DURATION_STRATEGY';

export class DurationSettingsStaticDataSource extends DurationSettingsDataSource {
  constructor(@Inject(STATIC_DURATION_STRATEGY) protected strategy: DurationStrategy) {
    super();
  }

  async getDurationSettings(userId: string): Promise<DurationSettings> {
    return {
      strategy: this.strategy
    };
  }

}