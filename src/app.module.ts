import { DurationStrategySelectorService } from './modules/duration/duration-strategy/duration-strategy-selector.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DurationSettingsDataSource, DurationSettingsModule, DurationSettingsStaticDataSource, STATIC_DURATION_STRATEGY } from '@modules/duration/duration-settings';
import { DurationStrategyModule, ExactTimeEntryDurationService, RoundedDurationService } from '@modules/duration/duration-strategy';
import { AmountSettingsDataSource, AmountSettingsModule, EntityAmountSettingsDataSource, STATIC_HOURLY_RATE, STATIC_MIN_BILLABLE_DURATION } from '@modules/amount/amount-settings';
import { TimeEntryDataSource, TimeEntryModule, TimeEntryMongoDataSource } from '@modules/time-entry';
import { TimeEntryApiModule } from '@api/time-entry';
import { UserDataSource, UserModule, UserMongoDataSource } from '@modules/user';
import { UserApiModule } from '@api/user';
import { CompanyDataSource, CompanyModule, CompanyMongoDataSource } from '@modules/company';
import { CompanyApiModule } from '@api/company';
import { ProjectDataSource, ProjectModule, ProjectMongoDataSource } from '@modules/project';
import { ProjectApiModule } from '@api/project';
import mongoose from 'mongoose';
mongoose.set('debug', true);

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/time-tracker'),
    DurationSettingsModule.forRoot([
      {provide: STATIC_DURATION_STRATEGY, useValue: 'exact'},
      {provide: DurationSettingsDataSource, useClass: DurationSettingsStaticDataSource}
    ]),
    DurationStrategyModule,
    TimeEntryModule.forRoot([
      {provide: TimeEntryDataSource, useClass: TimeEntryMongoDataSource}
    ]),
    UserModule.forRoot([
      {provide: UserDataSource, useClass: UserMongoDataSource}
    ]),
    CompanyModule.forRoot([
      {provide: CompanyDataSource, useClass: CompanyMongoDataSource}
    ]),
    ProjectModule.forRoot([
      {provide: ProjectDataSource, useClass: ProjectMongoDataSource}
    ]),
    AmountSettingsModule,
    TimeEntryApiModule,
    UserApiModule,
    CompanyApiModule,
    ProjectApiModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ExactTimeEntryDurationService,
    RoundedDurationService
  ],
})
export class AppModule {
  constructor(
    durationStrategySrv: DurationStrategySelectorService,
    exact: ExactTimeEntryDurationService,
    rounded: RoundedDurationService
  ){
    durationStrategySrv.addStrategy('exact', exact);
    durationStrategySrv.addStrategy('rounded', rounded);
  }
}