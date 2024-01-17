import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TimeEntry, TimeEntrySchema } from "./time-entry.schema";
import { TimeEntryController } from "./time-entry.controller";
import { TimeEntryDataSource } from "./datasource/datasource.service";
import { TimeEntryMongoDataSource } from "./datasource/time-entry.ds.mongo";
import { TimeEntryDurationService } from "./duration/duration.service";
import { ExactTimeEntryDurationService } from "./duration/exact-duration.service";
import { TimeEntryAmountService } from "./amount/amount.service";
import { FixedAmountService } from "./amount/fixed-amount.service";

@Module({
  imports: [MongooseModule.forFeature([{name: TimeEntry.name, schema: TimeEntrySchema}])],
  controllers: [TimeEntryController],
  providers: [
    {provide: TimeEntryDataSource, useClass: TimeEntryMongoDataSource},
    {provide: TimeEntryDurationService, useClass: ExactTimeEntryDurationService},
    {provide: TimeEntryAmountService, useClass: FixedAmountService}
  ]
})
export class TimeEntryModule {}