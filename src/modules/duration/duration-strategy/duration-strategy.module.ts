import { Module } from "@nestjs/common";
import { DurationStrategySelectorService } from "./duration-strategy-selector.service";
import { TimeEntryDurationService } from "./duration.service";

@Module({})
export class DurationStrategyModule {
  static forRoot(strategies: {[key: string]: TimeEntryDurationService}, global: boolean = true) {
    return {
      global,
      module: DurationStrategyModule,
      providers: [
        {
          provide: DurationStrategySelectorService,
          useFactory: () => {
            const srv = new DurationStrategySelectorService();
            for (const key of Object.keys(strategies)) {
              srv.addStrategy(key, strategies[key]);
            }
            return srv;
          }
        }
      ],
      exports: [DurationStrategySelectorService]
    }
  }
}