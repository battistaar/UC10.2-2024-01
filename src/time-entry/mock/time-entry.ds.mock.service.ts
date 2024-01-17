import { Injectable } from "@nestjs/common";
import { TimeEntry } from "../entities/time-entry.schema";
import { CreateTimeEntryDTO } from "../entities/time-entry.dto";
import { Types } from 'mongoose';
import { TimeEntryDataSource } from "../datasource/datasource.service";

@Injectable()
export class TimeEntryMockDataSource extends TimeEntryDataSource {
  private data: TimeEntry[] = [];
  constructor(data: TimeEntry[] = []) {
    super();
    this.data = data;
  }

  setRecords(data: TimeEntry[]) {
    this.data = data;
  }

  async list(): Promise<TimeEntry[]> {
    return this.data;
  }

  async get(id: string): Promise<TimeEntry> {
    return this.data.find(e => e.id === id);
  }

  async create(data: CreateTimeEntryDTO): Promise<TimeEntry> {
    const id = new Types.ObjectId().toString();
    const record = {...data, id}
    this.data.push(record);
    return record;
  }
}