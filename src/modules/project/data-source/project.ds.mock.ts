import { Injectable } from "@nestjs/common";
import { Types } from 'mongoose';
import { ProjectDataSource } from "./project.ds.service";
import { Project } from "../entities/project.schema";
import { CreateProjectDTO } from "../entities/project.dto";

@Injectable()
export class ProjectMockDataSource extends ProjectDataSource {
  private data: Project[] = [];
  constructor(data: Project[] = []) {
    super();
    this.data = data;
  }

  setRecords(data: Project[]) {
    this.data = data;
  }

  async list(): Promise<Project[]> {
    return this.data;
  }

  async get(id: string): Promise<Project> {
    return this.data.find(e => e.id === id);
  }

  async create(data: CreateProjectDTO): Promise<Project> {
    const id = new Types.ObjectId().toString();
    const record = {...data, id}
    this.data.push(record);
    return record;
  }
}