import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Project } from "../entities/project.schema";
import { CreateProjectDTO } from "../entities/project.dto";
import { BaseMongoDataSoruce } from "@modules/utils/base-mongo.ds";

@Injectable()
export class ProjectMongoDataSource extends BaseMongoDataSoruce<Project, CreateProjectDTO> {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {
    super();
  }

  protected async performList() {
    return this.projectModel.find();
  }

  protected async performGet(id: string) {
    return this.projectModel.findById(id);
  }

  protected async performCreate(data: CreateProjectDTO) {
    return  this.projectModel.create(data);
  }
}