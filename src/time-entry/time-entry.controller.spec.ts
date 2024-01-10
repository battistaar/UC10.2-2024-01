import { Test, TestingModule } from '@nestjs/testing';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntryDataSource } from './datasource/time-entry.ds.service';
import { TimeEntryMockDataSource } from './mocks/time-entry.ds.mock.service';
import { Types } from 'mongoose';
import { TimeEntry } from './entities/time-entry.schema';
import { ExactTimeEntryDurationService } from './duration/exact-duration.service';
import { TimeEntryDurationService } from './duration/duration.service';
import { FixedAmountService } from './amount/fixed-amount.service';
import { TimeEntryAmountService } from './amount/amount.service';
import { TimeEntryResultFactory } from './entities/time-entry-result.factory';

describe('TimeEntryController', () => {
  let controller: TimeEntryController;
  let dataSource: TimeEntryMockDataSource;
  let resultFactory: TimeEntryResultFactory;

  beforeEach(async () => {
    dataSource = new TimeEntryMockDataSource();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TimeEntryController],
      providers: [{
        provide: TimeEntryDataSource,
        useValue: dataSource
      },
      {provide: TimeEntryDurationService, useClass: ExactTimeEntryDurationService},
      {provide: TimeEntryAmountService, useClass: FixedAmountService},
      TimeEntryResultFactory
    ],
    }).compile();

    controller = app.get<TimeEntryController>(TimeEntryController);
    resultFactory = app.get<TimeEntryResultFactory>(TimeEntryResultFactory);
  });

  describe('list',  () => {
    it('should return a list of elements"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId(),
          description: 'Test1',
          start: new Date(),
          end: new Date(),
          billable: true
        },
        {
          id: new Types.ObjectId(),
          description: 'Test2',
          start: new Date(),
          end: new Date(),
          billable: true
        }
      ];
      dataSource.setRecords(records);
      const spyFactory = jest.fn().mockResolvedValue({});
      jest.spyOn(resultFactory, 'getFactory').mockReturnValue(spyFactory);
      return controller.list().then(result => {
        for(let i = 0; i < records.length; i++) {
          expect(spyFactory).toHaveBeenNthCalledWith(i+1, records[i]);
        }
        expect(result.length).toBe(records.length);
      })
    });
  });

  describe('detail', () => {
    it('should return a single record with amount"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId(),
          description: 'Test1',
          start: new Date(),
          end: new Date(),
          billable: true
        },
        {
          id: new Types.ObjectId(),
          description: 'Test2',
          start: new Date(),
          end: new Date(),
          billable: true
        }
      ];
      dataSource.setRecords(records);
      const spyFactory = jest.fn().mockResolvedValue({});
      jest.spyOn(resultFactory, 'getFactory').mockReturnValue(spyFactory);
      return controller.detail(records[1].id.toString()).then(result => {
        expect(spyFactory).toHaveBeenCalledWith(records[1]);
        expect(result).toStrictEqual({});
      })
    });

    it('should throw an exception if not found"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId(),
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
      const spyFactory = jest.fn().mockResolvedValue({});
      jest.spyOn(resultFactory, 'getFactory').mockReturnValue(spyFactory);
      return controller.create(record).then(result =>{
        expect(spyFactory).toHaveBeenCalled();
        expect(result).toStrictEqual({});
      })
    });
  })
});
