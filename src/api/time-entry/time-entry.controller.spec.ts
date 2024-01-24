import { Test, TestingModule } from '@nestjs/testing';
import { TimeEntryController } from './time-entry.controller';
import { Types } from 'mongoose';
import { FixedAmountService } from './amount/fixed-amount.service';
import { TimeEntryAmountService } from './amount/amount.service';
import { TimeEntryResultCalculator } from './entities/result-calculator.service';
import { TimeEntryMockDataSource, TimeEntry, TimeEntryDataSource } from '@modules/time-entry';

describe('TimeEntryController', () => {
  let controller: TimeEntryController;
  let dataSource: TimeEntryMockDataSource;
  let spyResult: jest.Mock;
  

  beforeEach(async () => {
    dataSource = new TimeEntryMockDataSource();
    spyResult = spyResult = jest.fn((_: string, arg: TimeEntry | TimeEntry[]) => {
      return Array.isArray(arg) ? arg.map(() => ({})) : {};
    });
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
		await controller.list();
		
    expect(spyResult).toHaveBeenCalledWith('test', records);
    })
    it('DETAIL: should call the settings provider', async () => {
        await controller.detail(records[0].id.toString());
        expect(spyResult).toHaveBeenCalledWith('test', records[0]);
    })
    it('CREATE: should calculate result', async () => {
        const record = {
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: true
        }
        await controller.create(record);
        expect(spyResult).toHaveBeenCalled();
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