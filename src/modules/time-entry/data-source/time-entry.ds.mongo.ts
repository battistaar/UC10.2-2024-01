import { Injectable } from "@nestjs/common";
import { TimeEntry } from "../entities/time-entry.schema";
import { CreateTimeEntryDTO } from "../entities/time-entry.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseMongoDataSoruce } from "@modules/utils/base-mongo.ds";

@Injectable()
export class TimeEntryMongoDataSource extends BaseMongoDataSoruce<TimeEntry, CreateTimeEntryDTO> {
  constructor(
    @InjectModel(TimeEntry.name) private readonly timeEntryModel: Model<TimeEntry>,
  ) {
    super();
  }

  protected async performList() {
    return this.timeEntryModel.find();
  }

  protected async performGet(id: string) {
    return this.timeEntryModel.findById(id);
  }

  protected async performCreate(data: CreateTimeEntryDTO) {
    return this.timeEntryModel.create(data);
  }
}