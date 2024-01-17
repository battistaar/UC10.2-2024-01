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
import { TimeEntryDataSource } from './datasource/datasource.service';
import { TimeEntryDurationService } from './duration/duration.service';

@Controller('time-entries')
export class TimeEntryController {
  constructor(
    protected readonly dataSource: TimeEntryDataSource,
    protected readonly durationSrv: TimeEntryDurationService
  ) {}

  @Get()
  async list(): Promise<CalculatedTimeEntry[]> {
    const list = await this.dataSource.list();

    return list.map((e) => {
      const duration = this.durationSrv.getDuration(e.start, e.end);
      return {
        ...e,
        amount: e.billable ? duration * 60 : 0,
      };
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.dataSource.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const duration = this.durationSrv.getDuration(record.start, record.end);
    return {
      ...record,
      amount: record.billable ? duration * 60 : 0,
    };
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO) {
    const record = await this.dataSource.create(createTimeEntryDTO);
  
    const duration = this.durationSrv.getDuration(record.start, record.end);
    return {
      ...record,
      amount: record.billable ? duration * 60 : 0,
    };
  }
}
