import { Module, Provider } from "@nestjs/common";
import { DurationSettingsDataSource } from "./duration-settings.ds";

@Module({})
export class DurationSettingsModule {
  static forRoot(providers: Provider[], global: boolean = true) {
    return {
      global,
      module: DurationSettingsModule,
      providers: [
        ...providers
      ],
      exports: [DurationSettingsDataSource]
    }
  }
}