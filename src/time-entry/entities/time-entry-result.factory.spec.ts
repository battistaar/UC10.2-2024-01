import { TimeEntryAmountService } from "../amount/amount.service";
import { FixedAmountService } from "../amount/fixed-amount.service"
import { TimeEntryDurationService } from "../duration/duration.service";
import { ExactTimeEntryDurationService } from "../duration/exact-duration.service";
import { TimeEntryResultFactory } from "./time-entry-result.factory";
import { Types } from 'mongoose';

describe('TimEntryResultFactory', () => {
  let amountSrv: TimeEntryAmountService;
  let durationSrv: TimeEntryDurationService;
  beforeEach(() => {
    amountSrv = new FixedAmountService();
    durationSrv = new ExactTimeEntryDurationService();
  })
  it('should reuturn a billable result', () => {
    const entry = {
      id: new Types.ObjectId(),
      description: 'Test1',
      start: new Date('2024-01-10T10:00:00.000Z'),
      end: new Date('2024-01-10T11:00:00.000Z'),
      billable: true
    }
    const factory = new TimeEntryResultFactory(durationSrv, amountSrv).getFactory();
    const amountSpy = jest.spyOn(amountSrv, 'calcAmount');
    const durationSpy = jest.spyOn(durationSrv, 'getDuration').mockReturnValue(60);
    const result = factory(entry);
    expect(durationSpy).toHaveBeenCalledWith(entry.start, entry.end);
    expect(amountSpy).toHaveBeenCalledWith(60)
    expect(result.id).toBe(entry.id);
    expect(result.amount).toBeDefined();
  });

  it('should reuturn a non billable result', () => {
    const entry = {
      id: new Types.ObjectId(),
      description: 'Test1',
      start: new Date('2024-01-10T10:00:00.000Z'),
      end: new Date('2024-01-10T11:00:00.000Z'),
      billable: false
    }
    const factory = new TimeEntryResultFactory(durationSrv, amountSrv).getFactory();
    const amountSpy = jest.spyOn(amountSrv, 'calcAmount');
    const durationSpy = jest.spyOn(durationSrv, 'getDuration').mockReturnValue(60);
    const result = factory(entry);
    expect(durationSpy).toHaveBeenCalledWith(entry.start, entry.end);
    expect(amountSpy).not.toHaveBeenCalled();
    expect(result.id).toBe(entry.id);
    expect(result.amount).toBe(0);
  });
})