import { Inject, Optional } from "@nestjs/common";
import { DurationSettingsDataSource } from "./duration-settings.ds";
import { DurationSettings, DurationStrategy } from "./duration-settings.entity";

export const STATIC_DURATION_STRATEGY = 'STATIC_DURATION_STRATEGY';
export const STATIC_ROUND_SETTINGS = 'STATIC_ROUND_SETTINGS';

export class DurationSettingsStaticDataSource extends DurationSettingsDataSource {
  constructor(
    @Inject(STATIC_DURATION_STRATEGY) protected strategy: DurationStrategy,
    @Optional() @Inject(STATIC_ROUND_SETTINGS) protected roundValue: number = 1) {
    super();
  }

  async getDurationSettings(userId: string): Promise<DurationSettings> {
    return {
      strategy: this.strategy,
      roundValue: this.roundValue
    };
  }

}