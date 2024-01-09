import { TimeEntryDataSource } from './time-entry-datasource.service';
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
import { CalculatedTimeEntry } from './time-entry.entity';
import { CreateTimeEntryDTO } from './time-entry.dto';

@Controller('time-entries')
export class TimeEntryController {
  constructor(protected readonly dataSorce: TimeEntryDataSource) {}

  @Get()
  async list(): Promise<CalculatedTimeEntry[]> {
    const list = await this.dataSorce.list();

    return list.map((e) => {
      const duration = (e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60);
      return {
        ...e,
        amount: e.billable ? duration * 60 : 0,
      };
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.dataSorce.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const duration = (record.end.getTime() - record.start.getTime()) / (1000 * 60 * 60);
    return {
      ...record,
      amount: record.billable ? duration * 60 : 0,
    };
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO) {
    const record = await this.dataSorce.add(createTimeEntryDTO);
  
    const duration = (record.end.getTime() - record.start.getTime()) / (1000 * 60 * 60);
    return {
      ...record,
      amount: record.billable ? duration * 60 : 0,
    };
  }
}
