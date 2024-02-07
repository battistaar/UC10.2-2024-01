import { TimeEntry } from "../entities/time-entry.schema";
import { CreateTimeEntryDTO } from "../entities/time-entry.dto";
import { DataSource } from "@modules/utils/datasource";

export abstract class TimeEntryDataSource implements DataSource<TimeEntry, CreateTimeEntryDTO> {

  abstract list(): Promise<TimeEntry[]>;

  abstract get(id: string): Promise<TimeEntry>;

  abstract create(data: CreateTimeEntryDTO): Promise<TimeEntry>;
}