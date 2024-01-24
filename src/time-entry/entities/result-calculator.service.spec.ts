import { Types } from "mongoose";
import { TimeEntryResultCalculator } from "./result-calculator.service";
import { TimeEntryResultFactory } from "./time-entry.result.factory";
import { DurationSettingsDataSource, DurationSettingsStaticDataSource } from "@modules/duration/duration-settings";
import { DurationStrategySelectorService, ExactTimeEntryDurationService } from "@modules/duration/duration-strategy";
import { AmountSettingsDataSource, AmountSettingsStatiDataSource } from "@modules/amount/amount-settings";

describe('TimeEntryResultCalculator', () => {
  const resultFactorySrv: TimeEntryResultFactory = new TimeEntryResultFactory();
  let durationSettingsSrv: DurationSettingsDataSource;
  let durationStrategySelector: DurationStrategySelectorService;
  let amountSettingsSrv: AmountSettingsDataSource;
  let resultCalculator: TimeEntryResultCalculator;

  beforeEach(() => {
    durationSettingsSrv = new DurationSettingsStaticDataSource('exact');
    durationStrategySelector = new DurationStrategySelectorService();
    durationStrategySelector.addStrategy('exact', new ExactTimeEntryDurationService());
    amountSettingsSrv = new AmountSettingsStatiDataSource(60, 10);
    resultCalculator = new TimeEntryResultCalculator(durationSettingsSrv, durationStrategySelector, resultFactorySrv, amountSettingsSrv);
  })

  it('should return a record with amount 60', async () => {
    const record = {
      id: new Types.ObjectId().toString(),
      description: 'Test1',
      start: new Date('2024-01-10T10:00:00.000Z'),
      end: new Date('2024-01-10T11:00:00.000Z'),
      billable: true
    }
    const result = await resultCalculator.calcResult('test', record);
    expect(result.amount).toBe(60);
  })

  it('should return a record with amount 30', async () => {
    const record = {
      id: new Types.ObjectId().toString(),
      description: 'Test1',
      start: new Date('2024-01-10T10:00:00.000Z'),
      end: new Date('2024-01-10T10:30:00.000Z'),
      billable: true
    }
    const result = await resultCalculator.calcResult('test', record);
    expect(result.amount).toBe(30);
  })

  it('should return a record with amount 0', async () => {
    const record = {
      id: new Types.ObjectId().toString(),
      description: 'Test1',
      start: new Date('2024-01-10T10:00:00.000Z'),
      end: new Date('2024-01-10T10:00:00.000Z'),
      billable: true
    }
    const result = await resultCalculator.calcResult('test', record);
    expect(result.amount).toBe(0);
  })

  it('should consider min billable', async () => {
    const record = {
      id: new Types.ObjectId().toString(),
      description: 'Test1',
      start: new Date('2024-01-10T10:00:00.000Z'),
      end: new Date('2024-01-10T10:05:00.000Z'),
      billable: true
    }
    const result = await resultCalculator.calcResult('test', record);
    expect(result.amount).toBe(0);
  })

  it('should handle arrays', async () => {
    const records = [
      {
        id: new Types.ObjectId().toString(),
        description: 'Test1',
        start: new Date('2024-01-10T10:00:00.000Z'),
        end: new Date('2024-01-10T11:00:00.000Z'),
        billable: true
      },
      {
        id: new Types.ObjectId().toString(),
        description: 'Test1',
        start: new Date('2024-01-10T10:00:00.000Z'),
        end: new Date('2024-01-10T10:05:00.000Z'),
        billable: true
      },
      {
        id: new Types.ObjectId().toString(),
        description: 'Test1',
        start: new Date('2024-01-10T10:00:00.000Z'),
        end: new Date('2024-01-10T11:00:00.000Z'),
        billable: false
      }
    ];
    const result = await resultCalculator.calcResult('test', records);
    expect(result[0].amount).toBe(60);
    expect(result[1].amount).toBe(0);
    expect(result[2].amount).toBe(0);
  })
})