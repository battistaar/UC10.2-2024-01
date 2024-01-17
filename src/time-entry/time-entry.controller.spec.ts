import { Test, TestingModule } from "@nestjs/testing";
import { TimeEntryController } from "./time-entry.controller";
import { TimeEntryDataSource } from "./datasource/datasource.service";
import { TimeEntryMockDataSource } from "./mock/time-entry.ds.mock.service";
import { Types } from 'mongoose';
import { TimeEntry } from "./time-entry.schema";
import { TimeEntryDurationService } from "./duration/duration.service";
import { ExactTimeEntryDurationService } from "./duration/exact-duration.service";
import { FixedAmountService } from "./amount/fixed-amount.service";
import { TimeEntryAmountService } from "./amount/amount.service";

describe('TimeEntryController', () => {
  let controller: TimeEntryController;
  let dataSource: TimeEntryMockDataSource;
  let durationSrv: TimeEntryDurationService;
  let amountSrv: TimeEntryAmountService;

  beforeEach(async () => {
    dataSource = new TimeEntryMockDataSource();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TimeEntryController],
      providers: [
        {provide: TimeEntryDataSource, useValue: dataSource},
        {provide: TimeEntryDurationService, useClass: ExactTimeEntryDurationService},
        {provide: TimeEntryAmountService, useClass: FixedAmountService}
      ]
    }).compile();

    controller = app.get<TimeEntryController>(TimeEntryController);
    durationSrv = app.get<TimeEntryDurationService>(TimeEntryDurationService);
    amountSrv = app.get<TimeEntryAmountService>(TimeEntryAmountService);
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
        expect(result.length).toBe(records.length);
      });
    });

    it('should calculate billable amount', () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toString(),
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: true
        },
        {
          id: new Types.ObjectId().toString(),
          description: 'Test2',
          start: new Date('2024-01-10T11:00:00.000Z'),
          end: new Date('2024-01-10T13:00:00.000Z'),
          billable: false
        },

        {
          id: new Types.ObjectId().toString(),
          description: 'Test2',
          start: new Date('2024-01-13T10:00:00.000Z'),
          end: new Date('2024-01-13T10:00:00.000Z'),
          billable: true
        }
      ];
      dataSource.setRecords(records);
      const durationSpy = jest.spyOn(durationSrv, 'getDuration').mockReturnValue(1);
      const amountSpy = jest.spyOn(amountSrv, 'calcAmount').mockReturnValue(60);
      return controller.list().then(result => {      
        for(let i = 0; i < records.length; i++) {
          expect(durationSpy).toHaveBeenNthCalledWith(i+1, records[i].start, records[i].end);
        }

        expect(amountSpy).toHaveBeenCalledTimes(2);
        expect(amountSpy).toHaveBeenCalledWith(1);

        expect(result[0].amount).toBe(60);
        expect(result[1].amount).toBe(0);
        expect(result[2].amount).toBe(60);
      })
    });
  });

  describe('detail', () => {
    it('should return a single record with amount"', async () => {
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
      const durationSpy = jest.spyOn(durationSrv, 'getDuration');
      return controller.detail(records[1].id).then(result => {
        expect(durationSpy).toHaveBeenCalledWith(records[1].start, records[1].end);
        expect(result.id).toBe(records[1].id);
        expect(result.amount).toBeDefined();
      })
    });

    it('should calculate billable amounts"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toString(),
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: true
        }
      ];
      dataSource.setRecords(records);
      const durationSpy = jest.spyOn(durationSrv, 'getDuration').mockReturnValue(1);
      const amountSpy = jest.spyOn(amountSrv, 'calcAmount').mockReturnValue(60);
      return controller.detail(records[0].id).then(result => {
        expect(durationSpy).toHaveBeenCalledWith(records[0].start, records[0].end);
        expect(amountSpy).toHaveBeenCalledWith(1);
        expect(result.amount).toBe(60);
      })
    });
    it('should leave non billable amounts to 0"', async () => {
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

      return controller.detail(records[0].id).then(result => {
        expect(result.amount).toBe(0);
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
    it('should add a new billable record', async () => {
      const record = {
        description: 'Test1',
        start: new Date('2024-01-10T10:00:00.000Z'),
        end: new Date('2024-01-10T11:00:00.000Z'),
        billable: true
      }
      const durationSpy = jest.spyOn(durationSrv, 'getDuration').mockReturnValue(1);
      const amountSpy = jest.spyOn(amountSrv, 'calcAmount').mockReturnValue(60);
      return controller.create(record).then(result =>{
        expect(durationSpy).toHaveBeenCalledWith(record.start, record.end);
        expect(amountSpy).toHaveBeenCalledWith(1)
        expect(result.id).toBeDefined();
        expect(result.description).toBe(record.description);
        expect(result.billable).toBe(true);
        expect(result.amount).toBe(60);
      })
    });

    it('should add a new non billable record', async () => {
      const record = {
        description: 'Test1',
        start: new Date('2024-01-10T10:00:00.000Z'),
        end: new Date('2024-01-10T11:00:00.000Z'),
        billable: false
      }
      return controller.create(record).then(result =>{
        expect(result.id).toBeDefined();
        expect(result.description).toBe(record.description);
        expect(result.billable).toBe(false);
        expect(result.amount).toBe(0);
      })
    });
  })
});