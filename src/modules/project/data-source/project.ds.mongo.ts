import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Project } from "../entities/project.schema";
import { ProjectDataSource } from "./project.ds.service";
import { CreateProjectDTO } from "../entities/project.dto";

@Injectable()
export class ProjectMongoDataSource extends ProjectDataSource {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {
    super();
  }

  async list(): Promise<Project[]> {
    return this.projectModel.find().then(records => records.map(r => r.toObject()));
  }

  async get(id: string): Promise<Project> {
    return this.projectModel.findById(id).then(result => result.toObject());
  }

  async create(data: CreateProjectDTO): Promise<Project> {
    const record = await this.projectModel.create(data);
    return record.toObject();
  }
}