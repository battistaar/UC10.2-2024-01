import { TimeEntryDataSource } from './datasource/time-entry.ds.service';
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
import { CalculatedTimeEntry } from './entities/time-entry.entity';
import { CreateTimeEntryDTO } from './entities/time-entry.dto';
import { TimeEntryResultFactory } from './entities/time-entry-result.factory';

@Controller('time-entries')
export class TimeEntryController {
  constructor(
    protected readonly dataSorce: TimeEntryDataSource,
    protected readonly resultFactory: TimeEntryResultFactory) {}

  @Get()
  async list(): Promise<CalculatedTimeEntry[]> {
    const list = await this.dataSorce.list();

    return list.map((e) => {
      return this.resultFactory.getResultEntity(e);
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.dataSorce.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.resultFactory.getResultEntity(record);
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO) {
    const record = await this.dataSorce.add(createTimeEntryDTO);
    return this.resultFactory.getResultEntity(record);
  }
}
