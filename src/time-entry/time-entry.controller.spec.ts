import { Test, TestingModule } from "@nestjs/testing";
import { TimeEntryController } from "./time-entry.controller";
import { TimeEntryDataSource } from "./datasource/datasource.service";
import { TimeEntryMockDataSource } from "./mock/time-entry.ds.mock.service";
import { Types } from 'mongoose';
import { TimeEntry } from "./entities/time-entry.schema";
import { TimeEntryDurationService } from "./duration/duration.service";
import { ExactTimeEntryDurationService } from "./duration/exact-duration.service";
import { FixedAmountService } from "./amount/fixed-amount.service";
import { TimeEntryAmountService } from "./amount/amount.service";
import { TimeEntryResultFactory } from "./entities/time-entry.result.factory";

describe('TimeEntryController', () => {
  let controller: TimeEntryController;
  let dataSource: TimeEntryMockDataSource;
  let amountSrv: TimeEntryAmountService;
  let durationSrv: TimeEntryDurationService;
  let spyFactory: jest.SpyInstance;
  let spyResult: jest.Mock;

  beforeEach(async () => {
    dataSource = new TimeEntryMockDataSource();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TimeEntryController],
      providers: [
        {provide: TimeEntryDataSource, useValue: dataSource},
        {provide: TimeEntryDurationService, useClass: ExactTimeEntryDurationService},
        {provide: TimeEntryAmountService, useClass: FixedAmountService},
        TimeEntryResultFactory
      ]
    }).compile();

    controller = app.get<TimeEntryController>(TimeEntryController);
    amountSrv = app.get<TimeEntryAmountService>(TimeEntryAmountService);
    durationSrv = app.get<TimeEntryDurationService>(TimeEntryDurationService);

    const resultFactory = app.get<TimeEntryResultFactory>(TimeEntryResultFactory);
    spyFactory = jest.spyOn(resultFactory, 'getFactory');
    spyResult = jest.fn().mockReturnValue({});
    spyFactory.mockReturnValue(spyResult);

  })

  describe('list', () => {
    it('should return a list of elements', async () => {
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
        expect(spyFactory).toHaveBeenCalledWith(durationSrv, amountSrv);
        for(let i = 0; i < records.length; i++) {
          expect(spyResult).toHaveBeenNthCalledWith(i+1, records[i]);
        }
        expect(result).toStrictEqual([{}, {}]);
      });
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
      return controller.detail(records[1].id).then(result => {
        expect(spyFactory).toHaveBeenCalledWith(durationSrv, amountSrv);
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
  })

  describe('create', () => {
    it('should add a new record', async () => {
      const record = {
        description: 'Test1',
        start: new Date('2024-01-10T10:00:00.000Z'),
        end: new Date('2024-01-10T11:00:00.000Z'),
        billable: true
      }
      
      return controller.create(record).then(result =>{
        // const dataSourceResult = {
        //   ...record,
        //   id: new Types.ObjectId().toString()
        // }
        //jest.spyOn(dataSource, 'create').mockResolvedValue(dataSourceResult);
        expect(spyFactory).toHaveBeenCalledWith(durationSrv, amountSrv);
        //expect(spyResult).toHaveBeenCalledWith(dataSourceResult);
        expect(spyResult).toHaveBeenCalled();
        expect(result).toStrictEqual({});
      })
    });
  })
});