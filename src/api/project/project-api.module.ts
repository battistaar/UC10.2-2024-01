import { Module } from "@nestjs/common";
import { ProjectModule } from "@modules/project";
import { ProjectController } from "./project.controller";

@Module({
  imports: [ProjectModule],
  controllers: [ProjectController]
})
export class ProjectApiModule { }