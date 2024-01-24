import { Injectable } from "@nestjs/common";
import { TimeEntryDurationService } from "./duration.service";

@Injectable()
export class DurationStrategySelectorService {
  protected strategies: {[key: string]: TimeEntryDurationService} = {};

  addStrategy(identifier: string, strategy: TimeEntryDurationService) {
    this.strategies[identifier] = strategy;
  }

  getStrategy(identifier: string): TimeEntryDurationService {
    if (!this.strategies[identifier]) {
      throw new Error(`Duration strategy ${identifier} not found`);
    }
    return this.strategies[identifier];
  }
}