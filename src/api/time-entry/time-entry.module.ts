import { AmountSettingsModule } from "@modules/amount/amount-settings";
import { DurationSettingsModule } from "@modules/duration/duration-settings";
import { DurationStrategyModule } from "@modules/duration/duration-strategy";
import { TimeEntryModule } from "@modules/time-entry";
import { Module } from "@nestjs/common";
import { AmountServiceProvider } from "./amount/amount-service.provider";
import { TimeEntryResultCalculator } from "./entities/result-calculator.service";
import { TimeEntryResultFactory } from "./entities/time-entry.result.factory";
import { TimeEntryController } from "./time-entry.controller";

@Module({
  imports: [
    DurationSettingsModule,
    DurationStrategyModule,
    AmountSettingsModule,
    TimeEntryModule
  ],
  controllers: [TimeEntryController],
  providers: [
    TimeEntryResultFactory,
    AmountServiceProvider,
    TimeEntryResultCalculator
  ]
})
export class TimeEntryApiModule {}