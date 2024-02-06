import { Module } from "@nestjs/common";
import { AmountSettingsDataSource } from "./amount-settings.ds";
import { UserModule } from "@modules/user";
import { TimeEntryModule } from "@modules/time-entry";
import { ProjectModule } from "@modules/project";
import { CompanyModule } from "@modules/company";
import { EntityAmountSettingsDataSource } from "./entity-amount-settings/amount-settings.ds.entity";

@Module({
  imports: [
    UserModule,
    TimeEntryModule,
    ProjectModule,
    CompanyModule
  ],
  providers:[
    {provide: AmountSettingsDataSource, useClass: EntityAmountSettingsDataSource}
  ],
  exports: [AmountSettingsDataSource]
})
export class AmountSettingsModule {}