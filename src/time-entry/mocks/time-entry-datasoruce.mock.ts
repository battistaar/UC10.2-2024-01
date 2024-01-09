import { Injectable } from '@nestjs/common';
import { TimeEntry } from '../time-entry.schema';
import { Types } from 'mongoose';
import { CreateTimeEntryDTO } from '../time-entry.dto';

@Injectable()
export class MockTimeEntryDataSource {
  private data: TimeEntry[] = [];

  constructor(data: TimeEntry[] = []) {
    this.data = data;
  }

  setRecords(data: TimeEntry[]) {
    this.data = data;
  }

  async list(): Promise<TimeEntry[]> {
    return this.data;
  }

  async get(id: Types.ObjectId | string): Promise<TimeEntry> {
    return this.data.find(e => e.id.equals(id));
  }

  async add(data: CreateTimeEntryDTO): Promise<TimeEntry> {
    const id = new Types.ObjectId();
    const record = { ...data, id};
    this.data.push(record);
    return record;
  }

}