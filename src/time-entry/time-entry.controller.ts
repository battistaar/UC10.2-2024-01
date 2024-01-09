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
import { TimeEntryDurationService } from './duration/duration.service';
import { TimeEntryAmountService } from './amount/amount.service';

@Controller('time-entries')
export class TimeEntryController {
  constructor(
    protected readonly dataSorce: TimeEntryDataSource,
    protected readonly durationSrv: TimeEntryDurationService,
    protected readonly amountSrv: TimeEntryAmountService) {}

  @Get()
  async list(): Promise<CalculatedTimeEntry[]> {
    const list = await this.dataSorce.list();

    return list.map((e) => {
      const duration = this.durationSrv.getDuration(e.start, e.end);
      return {
        ...e,
        amount: e.billable ? this.amountSrv.calcAmount(duration) : 0,
      };
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.dataSorce.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const duration = this.durationSrv.getDuration(record.start, record.end);
    return {
      ...record,
      amount: record.billable ? this.amountSrv.calcAmount(duration) : 0,
    };
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO) {
    const record = await this.dataSorce.add(createTimeEntryDTO);
  
    const duration = this.durationSrv.getDuration(record.start, record.end);
    return {
      ...record,
      amount: record.billable ? this.amountSrv.calcAmount(duration) : 0,
    };
  }
}
