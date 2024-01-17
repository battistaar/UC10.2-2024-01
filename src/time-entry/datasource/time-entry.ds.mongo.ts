import { Injectable } from "@nestjs/common";
import { TimeEntry } from "../time-entry.schema";
import { CreateTimeEntryDTO } from "../time-entry.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TimeEntryDataSource } from "./datasource.service";

@Injectable()
export class TimeEntryMongoDataSource extends TimeEntryDataSource {
  constructor(
    @InjectModel(TimeEntry.name) private readonly timeEntryModel: Model<TimeEntry>,
  ) {
    super();
  }

  async list(): Promise<TimeEntry[]> {
    return this.timeEntryModel.find().then(records => records.map(r => r.toObject()));
  }

  async get(id: string): Promise<TimeEntry> {
    return this.timeEntryModel.findById(id).then(result => result.toObject());
  }

  async create(data: CreateTimeEntryDTO): Promise<TimeEntry> {
    const record = await this.timeEntryModel.create(data);
    return record.toObject();
  }
}