import { Injectable } from "@nestjs/common";
import { TimeEntry } from "../entities/time-entry.schema";
import { CreateTimeEntryDTO } from "../entities/time-entry.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseMongoDatasource } from "@modules/utils/base-mongo-datasource";

@Injectable()
export class TimeEntryMongoDataSource extends BaseMongoDatasource<TimeEntry, CreateTimeEntryDTO> {
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