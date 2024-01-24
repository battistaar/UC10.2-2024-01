import { DurationStrategySelectorService } from './modules/duration/duration-strategy/duration-strategy-selector.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntryModule } from './time-entry/time-entry.module';
import { DurationSettingsDataSource, DurationSettingsModule, DurationSettingsStaticDataSource, STATIC_DURATION_STRATEGY } from '@modules/duration/duration-settings';
import { DurationStrategyModule, ExactTimeEntryDurationService, RoundedDurationService, TimeEntryDurationService } from '@modules/duration/duration-strategy';
import { AmountSettingsDataSource, AmountSettingsModule, AmountSettingsStatiDataSource, STATIC_HOURLY_RATE, STATIC_MIN_BILLABLE_DURATION } from '@modules/amount/amount-settings';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/time-tracker'),
    DurationSettingsModule.forRoot([
      {provide: STATIC_DURATION_STRATEGY, useValue: 'exact'},
      {provide: DurationSettingsDataSource, useClass: DurationSettingsStaticDataSource}
    ]),
    AmountSettingsModule.forRoot([
      {provide: STATIC_HOURLY_RATE, useValue: 60},
      {provide: STATIC_MIN_BILLABLE_DURATION, useValue: 10},
      {provide: AmountSettingsDataSource, useClass: AmountSettingsStatiDataSource}
    ]),
    DurationStrategyModule,
    TimeEntryModule
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