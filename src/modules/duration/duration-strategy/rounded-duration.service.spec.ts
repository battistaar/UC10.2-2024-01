import { RoundedDurationService } from './rounded-duration.service';
import { TimeEntryDurationService } from './duration.service';

describe('ExactDurationService', () => {
  let srv: TimeEntryDurationService;

  beforeAll(() => {
    srv = new RoundedDurationService(30);
  })
  it('should round up to 1.5h', () => {
    const start = new Date('2024-01-10T10:00:00.000Z');
    const end = new Date('2024-01-10T11:20:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(1.5);
  });

  it('should round down to 1.5h', () => {
    const start = new Date('2024-01-10T10:00:00.000Z');
    const end = new Date('2024-01-10T11:40:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(1.5);
  });

  it('should round up to 1h', () => {
    const start = new Date('2024-01-10T10:00:00.000Z');
    const end = new Date('2024-01-10T10:50:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(1);
  });

  it('should round down to 1h', () => {
    const start = new Date('2024-01-10T10:00:00.000Z');
    const end = new Date('2024-01-10T11:10:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(1);
  });

  it('should calculate 1h', () => {
    const start = new Date('2024-01-10T10:00:00.000Z');
    const end = new Date('2024-01-10T11:00:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(1);
  });

  it('should calculate 0.5h', () => {
    const start = new Date('2024-01-10T10:00:00.000Z');
    const end = new Date('2024-01-10T10:30:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(0.5);
  });

  it('should calculate 0h', () => {
    const start = new Date('2024-01-10T10:00:00.000Z');
    const end = new Date('2024-01-10T10:00:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(0);
  });
});