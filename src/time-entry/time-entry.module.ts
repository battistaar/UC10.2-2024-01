import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TimeEntry, TimeEntrySchema } from "./time-entry.schema";
import { TimeEntryController } from "./time-entry.controller";
import { TimeEntryMongoDataSource } from "./time-entry.ds.mongo.service";
import { TimeEntryDataSource } from "./time-entry.ds.service";

@Module({
  imports: [MongooseModule.forFeature([{name: TimeEntry.name, schema: TimeEntrySchema}])],
  controllers: [TimeEntryController],
  providers: [{provide: TimeEntryDataSource, useClass: TimeEntryMongoDataSource}]
})
export class TimeEntryModule {}