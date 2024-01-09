import { Injectable } from "@nestjs/common";
import { TimeEntryAmountService } from "./amount.service";

@Injectable()
export class FixedAmountService extends TimeEntryAmountService {
  calcAmount(duration: number) {
      return duration * 60;
  }
}