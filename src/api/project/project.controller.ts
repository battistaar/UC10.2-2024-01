import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProjectDTO, ProjectDataSource, ProjectResultDTO } from '@modules/project';

@Controller('projects')
export class ProjectController {
  constructor(
    protected readonly dataSource: ProjectDataSource
  ) {}

  @Get()
  async list(): Promise<ProjectResultDTO[]> {
    return this.dataSource.list();
  }

  @Get(':id')
  async detail(@Param('id') id: string): Promise<ProjectResultDTO> {
    const record = await this.dataSource.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    
    return record;
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateProjectDTO): Promise<ProjectResultDTO> {
    return this.dataSource.create(createTimeEntryDTO);
  }
}
