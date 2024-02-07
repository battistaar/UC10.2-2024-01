import { Module } from "@nestjs/common";
import { AmountSettingsDataSource, AmountSettingsProvider } from "./amount-settings.ds";
import { UserDataSource, UserModule } from "@modules/user";
import { TimeEntryDataSource, TimeEntryModule } from "@modules/time-entry";
import { ProjectDataSource, ProjectModule } from "@modules/project";
import { CompanyModule } from "@modules/company";
import { EntityAmountSettingsDataSource } from "./entity-amount-settings/amount-settings.ds.entity";
import { CompanyAmountSettings } from "./entities/company-amount-settings.ds";
import { UserAmountSettings } from "./entities/user-amount-settings.ds";
import { ProjectAmountSettings, ProjectAmountSettingsAdapter } from "./entities/project-amount-settings.ds";
import { TIME_ENTRY_AMOUNT_SETTINGS_FACTORY, TimeEntryAmountSettings } from "./entities/time-entry-amount-settings.ds";

@Module({
  imports: [
    UserModule,
    TimeEntryModule,
    ProjectModule,
    CompanyModule
  ],
  providers:[
    {provide: AmountSettingsDataSource, useClass: EntityAmountSettingsDataSource},
    CompanyAmountSettings,
    {
      provide: UserAmountSettings,
      useFactory: (prev: CompanyAmountSettings, curr: UserDataSource) => {
        return new UserAmountSettings(prev, curr, async entity => entity.company);
      },
      inject: [CompanyAmountSettings, UserDataSource]
    },
    {
      provide: ProjectAmountSettings,
      useFactory: (prev: UserAmountSettings, curr: ProjectDataSource) => {
        return new ProjectAmountSettings(prev, curr);
      },
      inject: [UserAmountSettings, ProjectDataSource]
    },
    {
      provide: TIME_ENTRY_AMOUNT_SETTINGS_FACTORY,
      useFactory: (original: ProjectAmountSettings, curr: TimeEntryDataSource) => {
        return {
          get(userId: string): AmountSettingsProvider {
            const prevSource = new ProjectAmountSettingsAdapter(original, userId);
            return new TimeEntryAmountSettings(prevSource, curr, async entity => entity.project);
          }
        }
      },
      inject: [ProjectAmountSettings, TimeEntryDataSource]
    }
  ],
  exports: [
    AmountSettingsDataSource,
    CompanyAmountSettings,
    UserAmountSettings,
    ProjectAmountSettings,
    TIME_ENTRY_AMOUNT_SETTINGS_FACTORY
  ]
})
export class AmountSettingsModule {}