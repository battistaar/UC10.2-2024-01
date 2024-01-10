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

@Module({
  imports: [MongooseModule.forFeature([{name: TimeEntry.name, schema: TimeEntrySchema}])],
  controllers: [TimeEntryController],
  providers: [
    {provide: TimeEntryDataSource, useClass: TimeEntryMongoDataSource},
    {provide: TimeEntryDurationService, useClass: ExactTimeEntryDurationService},
    {provide: TimeEntryAmountService, useClass: FixedAmountService},
    TimeEntryResultFactory
  ]
})
export class TimeEntryModule {}