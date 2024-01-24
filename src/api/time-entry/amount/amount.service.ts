import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class TimeEntryAmountService {
  abstract calcAmount(duration: number): number;
}