import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule, UserDataSource, UserMongoDataSource } from '@modules/user';
import { ProjectDataSource, ProjectModule, ProjectMongoDataSource } from '@modules/project';
import { TimeEntryModule } from '@modules/time-entry/time-entry.module';
import { TimeEntryDataSource, TimeEntryMongoDataSource } from '@modules/time-entry';
import { DurationStrategyModule, ExactTimeEntryDurationService, RoundedDurationService } from '@modules/duration/duration-strategy';
import { AmountSettingsDataSource, AmountSettingsModule, AmountSettingsStatiDataSource, STATIC_HOURLY_RATE } from '@modules/amount/amount-settings';
import { DurationSettingsDataSource, DurationSettingsModule, DurationSettingsStaticDataSource, STATIC_DURATION_STRATEGY } from '@modules/duration/duration-settings';
import { UserApiModule } from '@api/user/user-api.module';
import { ProjectApiModule } from '@api/project/project-api.module';
import { TimeEntryApiModule } from '@api/time-entry/time-entry.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/time-tracker'),
    DurationSettingsModule.forRoot([
      {provide: STATIC_DURATION_STRATEGY, useValue: 'exact'},
      {provide: DurationSettingsDataSource, useClass: DurationSettingsStaticDataSource}
    ], true),
    AmountSettingsModule.forRoot([
      {provide: STATIC_HOURLY_RATE, useValue: 60},
      {provide: AmountSettingsDataSource, useClass: AmountSettingsStatiDataSource}
    ], true),
    UserModule.forRoot([
      { provide: UserDataSource, useClass: UserMongoDataSource}
    ], true),
    ProjectModule.forRoot([
      {provide: ProjectDataSource, useClass: ProjectMongoDataSource}
    ], true),
    DurationStrategyModule.forRoot({
      'exact': new ExactTimeEntryDurationService(),
      'rounded': new RoundedDurationService()
    }, true),
    TimeEntryModule.forRoot([
      { provide: TimeEntryDataSource, useClass: TimeEntryMongoDataSource}
    ], true),
    UserApiModule,
    ProjectApiModule,
    TimeEntryApiModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
