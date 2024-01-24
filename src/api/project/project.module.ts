import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { ProjectModule } from "@modules/project";

@Module({
  imports: [
    ProjectModule
  ],
  controllers: [ProjectController],
  providers: []
})
export class ProjectApiModule {}