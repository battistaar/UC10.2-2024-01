import { DynamicModule, Module, Provider } from "@nestjs/common";
import { TimeEntryDataSource } from "./data-source/datasource.service";
import { MongooseModule } from "@nestjs/mongoose";
import { TimeEntry, TimeEntrySchema } from "./entities/time-entry.schema";

@Module({})
export class TimeEntryModule {
  static forRoot(providers: Provider[], global = true): DynamicModule {
    return {
      global,
      module: TimeEntryModule,
      imports: [
        MongooseModule.forFeature([{name: TimeEntry.name, schema: TimeEntrySchema}])
      ],
      providers: [
        ...providers
      ],
      exports: [TimeEntryDataSource]
    }
  }
}