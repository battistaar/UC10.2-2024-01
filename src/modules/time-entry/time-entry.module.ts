import { Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TimeEntry, TimeEntrySchema } from "./entities/time-entry.schema";
import { TimeEntryDataSource } from "./data-source/time-entry.ds.service";

@Module({})
export class TimeEntryModule {
  static forRoot(providers: Provider[], global: boolean = true) {
    return {
      global,
      module: TimeEntryModule,
      imports: [MongooseModule.forFeature(
        [{ name: TimeEntry.name, schema: TimeEntrySchema}]
      )],
      providers: [
        ...providers
      ],
      exports: [TimeEntryDataSource]
    }
  }
}