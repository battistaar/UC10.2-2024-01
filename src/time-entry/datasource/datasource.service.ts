import { TimeEntry } from "../entities/time-entry.schema";
import { CreateTimeEntryDTO } from "../entities/time-entry.dto";

export abstract class TimeEntryDataSource {

  abstract list(): Promise<TimeEntry[]>;

  abstract get(id: string): Promise<TimeEntry>;

  abstract create(data: CreateTimeEntryDTO): Promise<TimeEntry>;
}