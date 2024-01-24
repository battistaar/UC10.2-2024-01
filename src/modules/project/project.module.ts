import { Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Project, ProjectSchema } from "./entities/project.schema";
import { ProjectDataSource } from "./data-source/project.ds.service";

@Module({})
export class ProjectModule {
  static forRoot(providers: Provider[], global: boolean = true) {
    return {
      global,
      module: ProjectModule,
      imports: [MongooseModule.forFeature(
        [{ name: Project.name, schema: ProjectSchema}]
      )],
      providers: [
        ...providers
      ],
      exports: [ProjectDataSource]
    }
  }
}