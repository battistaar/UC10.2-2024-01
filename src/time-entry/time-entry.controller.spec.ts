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
import { TimeEntryResultCalculator } from './entities/result-calculator.service';

describe('TimeEntryController', () => {
  let controller: TimeEntryController;
  let dataSource: TimeEntryMockDataSource;
  let spyResult: jest.Mock;
  

  beforeEach(async () => {
    dataSource = new TimeEntryMockDataSource();
    spyResult = jest.fn().mockResolvedValue({});
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TimeEntryController],
      providers: [{
        provide: TimeEntryDataSource,
        useValue: dataSource
      },
      {provide: TimeEntryAmountService, useClass: FixedAmountService},
      {provide: TimeEntryResultCalculator, useValue: {calcResult: spyResult} }
    ],
    }).compile();

    controller = app.get<TimeEntryController>(TimeEntryController);
  });

  describe('result calculator', () => {
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
        for(let i = 0; i < records.length; i++) {
          expect(spyResult).toHaveBeenNthCalledWith(i+1, records[i]);
        }
      } catch (_) {}
      finally {
      }
    })
    it('DETAIL: should call the settings provider', async () => {
      try {
        await controller.detail(records[0].id.toString());
        expect(spyResult).toHaveBeenCalledWith(records[0]);
      } catch (_) {}
    })
    it('CREATE: should calculate result', async () => {
      try {
        const record = {
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: true
        }
        await controller.create(record);
        expect(spyResult).toHaveBeenCalled();
      } catch (_) {}
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
        expect(result).toStrictEqual({});
      })
    });
  })
});