import { CreateTimeEntryDTO } from "../entities/time-entry.dto";
import { TimeEntry } from "../entities/time-entry.schema";
import { Types } from 'mongoose';

export abstract class TimeEntryDataSource {
  abstract list(): Promise<TimeEntry[]>;

  abstract get(id: Types.ObjectId | string): Promise<TimeEntry>;

  abstract add(data: CreateTimeEntryDTO): Promise<TimeEntry>
}