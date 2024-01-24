import { TimeEntryResultCalculator } from './entities/result-calculator.service';
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TimeEntry, TimeEntrySchema } from "./entities/time-entry.schema";
import { TimeEntryController } from "./time-entry.controller";
import { TimeEntryDataSource } from "./datasource/datasource.service";
import { TimeEntryMongoDataSource } from "./datasource/time-entry.ds.mongo";
import { TimeEntryResultFactory } from "./entities/time-entry.result.factory";
import { AmountServiceProvider } from "./amount/amount-service.provider";
import { DurationSettingsModule } from '@modules/duration/duration-settings';
import { DurationStrategyModule } from '@modules/duration/duration-strategy';
import { AmountSettingsModule } from '@modules/amount/amount-settings';

@Module({
  imports: [
    MongooseModule.forFeature([{name: TimeEntry.name, schema: TimeEntrySchema}]),
    DurationSettingsModule,
    DurationStrategyModule,
    AmountSettingsModule
  ],
  controllers: [TimeEntryController],
  providers: [
    {provide: TimeEntryDataSource, useClass: TimeEntryMongoDataSource},
    TimeEntryResultFactory,
    AmountServiceProvider,
    TimeEntryResultCalculator
  ]
})
export class TimeEntryModule {}