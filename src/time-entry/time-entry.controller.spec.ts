import { Test, TestingModule } from '@nestjs/testing';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntryDataSource } from './datasource/datasource.service';
import { TimeEntryMockDataSource } from './mock/time-entry.ds.mock.service';
import { Types } from 'mongoose';
import { TimeEntry } from './entities/time-entry.schema';
import { FixedAmountService } from './amount/fixed-amount.service';
import { TimeEntryAmountService } from './amount/amount.service';
import { TimeEntryResultFactory } from './entities/time-entry.result.factory';
import { DurationSettingsDataSource } from './duration-settings/duration-settings.ds';
import { DurationStrategySelectorService } from './duration/duration-strategy-selector.service';
import { ExactTimeEntryDurationService } from './duration/exact-duration.service';
import { DurationSettingsStaticDataSource, STATIC_DURATION_STRATEGY } from './duration-settings/duration-settings.ds.static.service';

describe('TimeEntryController', () => {
  let controller: TimeEntryController;
  let dataSource: TimeEntryMockDataSource;
  let spyFactory: jest.SpyInstance;
  let spyResult: jest.Mock;
  let spyDurationSettings: jest.SpyInstance;
  let spyStrategyProvider: jest.SpyInstance;
  

  beforeEach(async () => {
    dataSource = new TimeEntryMockDataSource();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TimeEntryController],
      providers: [{
        provide: TimeEntryDataSource,
        useValue: dataSource
      },
      {provide: TimeEntryAmountService, useClass: FixedAmountService},
      TimeEntryResultFactory,
      {provide: STATIC_DURATION_STRATEGY, useValue: 'exact'},
      {provide: DurationSettingsDataSource, useClass: DurationSettingsStaticDataSource},
      DurationStrategySelectorService
    ],
    }).compile();

    controller = app.get<TimeEntryController>(TimeEntryController);
    
    const durationSettings = app.get<DurationSettingsDataSource>(DurationSettingsDataSource);
    spyDurationSettings = jest.spyOn(durationSettings, 'getDurationSettings');

    const durationStrategyProvider = app.get<DurationStrategySelectorService>(DurationStrategySelectorService);
    durationStrategyProvider.addStrategy('exact', new ExactTimeEntryDurationService());
    spyStrategyProvider = jest.spyOn(durationStrategyProvider, 'getStrategy');

    const resultFactory = app.get<TimeEntryResultFactory>(TimeEntryResultFactory);
    spyResult = jest.fn().mockResolvedValue({});
    spyFactory = jest.spyOn(resultFactory, 'getFactory');
    spyFactory.mockReturnValue(spyResult);
  });

  describe('duration strategy', () => {
    const records: TimeEntry[] = [
      {
        id: new Types.ObjectId().toString(),
        description: 'Test1',
        start: new Date(),
        end: new Date(),
        billable: true
      },
      {
        id: new Types.ObjectId().toString(),
        description: 'Test2',
        start: new Date(),
        end: new Date(),
        billable: true
      }
    ];
    beforeEach(() => {
      dataSource.setRecords(records);
    })

    it('LIST: should call the settings provider', async () => {
      try {
        await controller.list();
      } catch (_) {}
      finally {
        expect(spyDurationSettings).toHaveBeenCalled();
      }
    })
    it('DETAIL: should call the settings provider', async () => {
      try {
        await controller.detail(records[0].id.toString());
      } catch (_) {}
      finally {
        expect(spyDurationSettings).toHaveBeenCalled();
      }
    })
    it('CREATE: should call the settings provider', async () => {
      try {
        const record = {
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: true
        }
        await controller.create(record);
      } catch (_) {}
      finally {
        expect(spyDurationSettings).toHaveBeenCalled();
      }
    })

    it('LIST: should request the right duration strategy', async () => {
      spyDurationSettings.mockResolvedValue({strategy: 'test'});
      try {
        await controller.list();
      } catch(_) {}
      finally {
        expect(spyStrategyProvider).toHaveBeenCalledWith('test');
      }
    })

    it('DETAIL: should request the right duration strategy', async () => {
      spyDurationSettings.mockResolvedValue({strategy: 'test'});
      try {
        await controller.detail(records[0].id.toString());
      } catch(_) {}
      finally {
        expect(spyStrategyProvider).toHaveBeenCalledWith('test');
      }
    })

    it('CREATE: should request the right duration strategy', async () => {
      spyDurationSettings.mockResolvedValue({strategy: 'test'});
      try {
        const record = {
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: true
        }
        await controller.create(record);
      } catch(_) {}
      finally {
        expect(spyStrategyProvider).toHaveBeenCalledWith('test');
      }
    })
  })

  describe('list',  () => {
    it('should return a list of elements"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toString(),
          description: 'Test1',
          start: new Date(),
          end: new Date(),
          billable: true
        },
        {
          id: new Types.ObjectId().toString(),
          description: 'Test2',
          start: new Date(),
          end: new Date(),
          billable: true
        }
      ];
      dataSource.setRecords(records);
      return controller.list().then(result => {
        expect(spyFactory).toHaveBeenCalled();
        for(let i = 0; i < records.length; i++) {
          expect(spyResult).toHaveBeenNthCalledWith(i+1, records[i]);
        }
        expect(result.length).toBe(records.length);
      })
    });
  });

  describe('detail', () => {
    it('should return a single record"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toString(),
          description: 'Test1',
          start: new Date(),
          end: new Date(),
          billable: true
        },
        {
          id: new Types.ObjectId().toString(),
          description: 'Test2',
          start: new Date(),
          end: new Date(),
          billable: true
        }
      ];
      dataSource.setRecords(records);
      return controller.detail(records[1].id.toString()).then(result => {
        expect(spyFactory).toHaveBeenCalled();
        expect(spyResult).toHaveBeenCalledWith(records[1]);
        expect(result).toStrictEqual({});
      })
    });

    it('should throw an exception if not found"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toString(),
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: false
        }
      ];
      dataSource.setRecords(records);
      return expect(controller.detail('test')).rejects.toThrow('Not found');
    });

  });

  describe('create', () => {
    it('should add a new record', async () => {
      const record = {
        description: 'Test1',
        start: new Date('2024-01-10T10:00:00.000Z'),
        end: new Date('2024-01-10T11:00:00.000Z'),
        billable: true
      }
      return controller.create(record).then(result =>{
        expect(spyFactory).toHaveBeenCalled();
        expect(spyResult).toHaveBeenCalled();
        expect(result).toStrictEqual({});
      })
    });
  })
});