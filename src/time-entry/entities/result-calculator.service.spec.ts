import { Types } from "mongoose";
import { AmountSettingsDataSource } from "../amount-settings/amount-settings.ds";
import { AmountSettingsStatiDataSource } from "../amount-settings/amount-settings.ds.static";
import { DurationSettingsDataSource } from "../duration-settings/duration-settings.ds";
import { DurationSettingsStaticDataSource } from "../duration-settings/duration-settings.ds.static.service";
import { DurationStrategySelectorService } from "../duration/duration-strategy-selector.service";
import { ExactTimeEntryDurationService } from "../duration/exact-duration.service";
import { TimeEntryResultCalculator } from "./result-calculator.service";
import { TimeEntryResultFactory } from "./time-entry.result.factory";

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
    amountSettingsSrv = new AmountSettingsStatiDataSource(60);
    resultCalculator = new TimeEntryResultCalculator(resultFactorySrv, durationSettingsSrv, durationStrategySelector, amountSettingsSrv);
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
})