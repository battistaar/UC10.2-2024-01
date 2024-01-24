import { TimeEntryResultCalculator } from './entities/result-calculator.service';
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TimeEntry, TimeEntrySchema } from "./entities/time-entry.schema";
import { TimeEntryController } from "./time-entry.controller";
import { TimeEntryDataSource } from "./datasource/datasource.service";
import { TimeEntryMongoDataSource } from "./datasource/time-entry.ds.mongo";
import { TimeEntryResultFactory } from "./entities/time-entry.result.factory";
import { AmountSettingsStatiDataSource, STATIC_HOURLY_RATE } from "./amount-settings/amount-settings.ds.static";
import { AmountSettingsDataSource } from "./amount-settings/amount-settings.ds";
import { AmountServiceProvider } from "./amount/amount-service.provider";
import { DurationSettingsModule } from '@modules/duration/duration-settings';
import { DurationStrategyModule, DurationStrategySelectorService, ExactTimeEntryDurationService, RoundedDurationService, TimeEntryDurationService } from '@modules/duration/duration-strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{name: TimeEntry.name, schema: TimeEntrySchema}]),
    DurationSettingsModule,
    DurationStrategyModule
  ],
  controllers: [TimeEntryController],
  providers: [
    {provide: TimeEntryDataSource, useClass: TimeEntryMongoDataSource},
    TimeEntryResultFactory,
    {provide: STATIC_HOURLY_RATE, useValue: 50},
    {provide: AmountSettingsDataSource, useClass: AmountSettingsStatiDataSource},
    AmountServiceProvider,
    TimeEntryResultCalculator
  ]
})
export class TimeEntryModule {}