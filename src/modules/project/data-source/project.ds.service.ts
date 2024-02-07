import { DataSource } from "@modules/utils/datasource";
import { CreateProjectDTO } from "../entities/project.dto";
import { Project } from "../entities/project.schema";

export abstract class ProjectDataSource implements DataSource<Project, CreateProjectDTO> {

  abstract list(): Promise<Project[]>;

  abstract get(id: string): Promise<Project>;

  abstract create(data: CreateProjectDTO): Promise<Project>;
}