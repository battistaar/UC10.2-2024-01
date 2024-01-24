import { TimeEntryDurationService } from "./duration.service";

export class RoundedDurationService extends TimeEntryDurationService {
  constructor(protected roundValue: number = 30) {
    super();
  }
  
  protected calcDuration(millis: number): number {
    const roundMillis = this.roundValue * 1000 * 60;
    const rounded = Math.round(millis / roundMillis) * roundMillis;
    return rounded;
  }
}