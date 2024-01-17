import { TimeEntryDurationService } from "./duration.service";

export class RoundedDurationService extends TimeEntryDurationService {
  constructor(protected roundValue: number = 30) {
    super();
  }
  
  protected calcDuration(millis: number): number {
    const minutes = millis / (1000 * 60);
    const rounded = Math.round(minutes / this.roundValue) * this.roundValue;
    return rounded / 60;
  }
} 