import { Inject } from "@nestjs/common";
import { DurationSettings } from "./duration-settings.entity";
import { DurationSettingsDataSource } from "./duration.settings.ds.service";

export const STATIC_DURATION_STRATEGY = 'STATIC_DURATION_STRATEGY';

export class DurationServiceStaticDataSource extends DurationSettingsDataSource {
  constructor(@Inject(STATIC_DURATION_STRATEGY) protected readonly strategy: DurationSettings['strategy']) {
    super();
  }
  async getDurationSettings(): Promise<DurationSettings> {
    return {
      strategy: this.strategy
    };
  }

}