import { ExactTimeEntryDurationService } from "./exact-duration.service"

describe('ExactDurationService', () => {
  let srv: ExactTimeEntryDurationService;

  beforeEach(() => {
    srv = new ExactTimeEntryDurationService();
  })
  it('should calculate 0.5h', () => {
    const start = new Date('2024-01-10T10:00:00.000Z');
    const end = new Date('2024-01-10T10:30:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(0.5);
  });

  it('should calculate 1h', () => {
    const start = new Date('2024-01-10T10:00:00.000Z');
    const end = new Date('2024-01-10T11:00:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(1);
  });

  it('should calculate 0h', () => {
    const start = new Date('2024-01-10T10:00:00.000Z');
    const end = new Date('2024-01-10T10:00:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(0);
  });
});