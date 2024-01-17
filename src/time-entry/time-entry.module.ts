import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TimeEntry, TimeEntrySchema } from "./entities/time-entry.schema";
import { TimeEntryController } from "./time-entry.controller";
import { TimeEntryMongoDataSource } from "./datasource/time-entry.ds.mongo.service";
import { TimeEntryDataSource } from "./datasource/time-entry.ds.service";
import { TimeEntryDurationService } from "./duration/duration.service";
import { ExactTimeEntryDurationService } from "./duration/exact-duration.service";
import { TimeEntryAmountService } from "./amount/amount.service";
import { FixedAmountService } from "./amount/fixed-amount.service";
import { TimeEntryResultFactory } from "./entities/time-entry-result.factory";
import { DurationSettingsDataSource } from "./duration-settings/duration.settings.ds.service";
import { DurationServiceStaticDataSource, STATIC_DURATION_STRATEGY } from "./duration-settings/duration-settings.ds.static.service";
import { RoundedTimeEntryDurationService } from "./duration/rounded-duration.service";
import { DurationStrategySelectorService } from "./duration/duration-strategy-selector.service";

@Module({
  imports: [MongooseModule.forFeature([{name: TimeEntry.name, schema: TimeEntrySchema}])],
  controllers: [TimeEntryController],
  providers: [
    {provide: TimeEntryDataSource, useClass: TimeEntryMongoDataSource},
    {provide: TimeEntryDurationService, useClass: ExactTimeEntryDurationService},
    {provide: TimeEntryAmountService, useClass: FixedAmountService},
    TimeEntryResultFactory,
    {provide: STATIC_DURATION_STRATEGY, useValue: 'exact'},
    {provide: DurationSettingsDataSource, useClass: DurationServiceStaticDataSource},
    ExactTimeEntryDurationService,
    RoundedTimeEntryDurationService,
    {
      provide: DurationStrategySelectorService, 
      useFactory: (exact, rounded) => {
        const srv = new DurationStrategySelectorService();
        srv.addStrategy('exact', exact);
        srv.addStrategy('rounded', rounded);
        return srv;
      },
      inject: [ExactTimeEntryDurationService, RoundedTimeEntryDurationService]
    }
  ]
})
export class TimeEntryModule {}