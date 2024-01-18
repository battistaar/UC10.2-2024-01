import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TimeEntry, TimeEntrySchema } from "./entities/time-entry.schema";
import { TimeEntryController } from "./time-entry.controller";
import { TimeEntryDataSource } from "./datasource/datasource.service";
import { TimeEntryMongoDataSource } from "./datasource/time-entry.ds.mongo";
import { TimeEntryDurationService } from "./duration/duration.service";
import { ExactTimeEntryDurationService } from "./duration/exact-duration.service";
import { TimeEntryResultFactory } from "./entities/time-entry.result.factory";
import { DurationSettingsStaticDataSource, STATIC_DURATION_STRATEGY } from "./duration-settings/duration-settings.ds.static.service";
import { DurationStrategySelectorService } from "./duration/duration-strategy-selector.service";
import { DurationSettingsDataSource } from "./duration-settings/duration-settings.ds";
import { RoundedDurationService } from "./duration/rounded-duration.service";
import { AmountSettingsStatiDataSource, STATIC_HOURLY_RATE } from "./amount-settings/amount-settings.ds.static";
import { AmountSettingsDataSource } from "./amount-settings/amount-settings.ds";
import { AmountServiceProvider } from "./amount/amount-service.provider";

@Module({
  imports: [MongooseModule.forFeature([{name: TimeEntry.name, schema: TimeEntrySchema}])],
  controllers: [TimeEntryController],
  providers: [
    {provide: TimeEntryDataSource, useClass: TimeEntryMongoDataSource},
    TimeEntryResultFactory,
    {provide: STATIC_DURATION_STRATEGY, useValue: 'exact'},
    {provide: DurationSettingsDataSource, useClass: DurationSettingsStaticDataSource},
    ExactTimeEntryDurationService,
    RoundedDurationService,
    {
      provide: DurationStrategySelectorService,
      useFactory: (
        exact: TimeEntryDurationService,
        rounded: TimeEntryDurationService
        ) => {
        const srv = new DurationStrategySelectorService();
        srv.addStrategy('exact', exact);
        srv.addStrategy('rounded', rounded);
        return srv;
      },
      inject: [ExactTimeEntryDurationService, RoundedDurationService]
    },
    {provide: STATIC_HOURLY_RATE, useValue: 50},
    {provide: AmountSettingsDataSource, useClass: AmountSettingsStatiDataSource},
    AmountServiceProvider
  ]
})
export class TimeEntryModule {}